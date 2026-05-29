// =====================================================================
//  SiltCRT — soft granular signal emulator
//  Pipeline:  source(image|video) ─▶ [CRT pass: voronoi phosphor + kawase
//             bloom/umbra] ─▶ [persistence feedback] ─▶ [tube present:
//             curvature/vignette/grain] ─▶ canvas
//  Export:    canvas.captureStream() ─▶ MediaRecorder ─▶ .webm
// =====================================================================

// ---- shared GLSL chunks ---------------------------------------------
const noiseFunction = `
    float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
`;
const voronoiHash = `
    vec2 hash22(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)),
                 dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
`;
const passthroughVertex = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// === THREE.JS SETUP ==================================================
const canvas = document.getElementById('main-canvas');
const canvasContainer = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ canvas, preserveDrawingBuffer: true, antialias: false });
renderer.setClearColor(0x0d0b06, 1);
renderer.setPixelRatio(1);
renderer.setSize(200, 200);

// One fullscreen quad, reused across passes by swapping its material.
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const geometry = new THREE.PlaneGeometry(2, 2);
const quad = new THREE.Mesh(geometry);
scene.add(quad);

// === UNIFORMS ========================================================
const crtUniforms = {
    u_time:          { value: 0.0 },
    u_texture:       { value: null },
    u_aspect:        { value: 1.0 },
    u_texel:         { value: new THREE.Vector2(1 / 600, 1 / 600) },
    u_turbulence:    { value: 0.0 },
    u_flowSpeed:     { value: 0.0 },
    u_chromaticBleed:{ value: 0.001 },
    u_phosphorSize:  { value: 7500.0 },
    u_softness:      { value: 0.5 },
    u_bloomIntensity:{ value: 0.8 },
    u_bloomThreshold:{ value: 0.7 },
    u_bloomRadius:   { value: 2.0 },
    u_umbraIntensity:{ value: 0.0 },
    u_umbraThreshold:{ value: 0.3 },
    u_umbraRadius:   { value: 2.0 },
    u_phosphorTint:  { value: new THREE.Color(0xa6ad4a) },
    u_tintAmount:    { value: 0.4 }
};
const feedbackUniforms = {
    u_current:     { value: null },
    u_prev:        { value: null },
    u_persistence: { value: 0.6 }
};
const presentUniforms = {
    u_texture:   { value: null },
    u_aspect:    { value: 1.0 },
    u_time:      { value: 0.0 },
    u_curvature: { value: 0.08 },
    u_vignette:  { value: 0.35 },
    u_grain:     { value: 0.06 }
};

// === CRT MATERIAL (voronoi phosphor + kawase bloom/umbra) ============
const crtMaterial = new THREE.ShaderMaterial({
    uniforms: crtUniforms,
    vertexShader: passthroughVertex,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D u_texture;
        uniform float u_time, u_aspect, u_turbulence, u_flowSpeed, u_chromaticBleed;
        uniform float u_phosphorSize, u_softness;
        uniform float u_bloomIntensity, u_bloomThreshold, u_bloomRadius;
        uniform float u_umbraIntensity, u_umbraThreshold, u_umbraRadius;
        uniform vec2  u_texel;
        uniform vec3  u_phosphorTint;
        uniform float u_tintAmount;
        ${noiseFunction}
        ${voronoiHash}

        float luminance(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }

        // Kawase-style rotating-disc bloom: bright matter spreads outward.
        vec3 kawaseBloom(sampler2D tex, vec2 uv, float radius, float threshold,
                         float intensity, vec2 texel, float time){
            const int N = 12;
            float angStep = 6.2831853 / float(N);
            float rot = fract(time * 0.03) * 6.2831853;
            vec3 acc = vec3(0.0);
            float wsum = 0.0;
            for (int i = 0; i < N; ++i) {
                float a = rot + angStep * float(i);
                vec2 dir = vec2(cos(a), sin(a));
                for (int r = 1; r <= 3; ++r) {
                    vec2 offs = dir * texel * (radius * float(r));
                    vec3 c = texture2D(tex, uv + offs).rgb;
                    float b = max(0.0, luminance(c) - threshold);
                    float w = 1.0 / float(r);
                    acc += c * b * w;
                    wsum += w;
                }
            }
            if (wsum > 0.0) acc /= wsum;
            return acc * intensity;
        }

        // Mirror of the bloom: dark matter spreads inward as a dimming field.
        float kawaseUmbra(sampler2D tex, vec2 uv, float radius, float threshold,
                          float intensity, vec2 texel, float time){
            const int N = 12;
            float angStep = 6.2831853 / float(N);
            float rot = fract(time * 0.03) * 6.2831853;
            float acc = 0.0;
            float wsum = 0.0;
            for (int i = 0; i < N; ++i) {
                float a = rot + angStep * float(i);
                vec2 dir = vec2(cos(a), sin(a));
                for (int r = 1; r <= 3; ++r) {
                    vec2 offs = dir * texel * (radius * float(r));
                    vec3 c = texture2D(tex, uv + offs).rgb;
                    float b = max(0.0, threshold - luminance(c));
                    float w = 1.0 / float(r);
                    acc += b * w;
                    wsum += w;
                }
            }
            if (wsum > 0.0) acc /= wsum;
            return acc * intensity;
        }

        void main() {
            vec2 correctedUv = vUv - 0.5;
            correctedUv.x *= u_aspect;
            correctedUv += 0.5;

            // --- WARPING ---
            vec2 flow = vec2(
                (noise(correctedUv * 2.0 + u_time * u_flowSpeed) - 0.5) * 2.0,
                (noise(correctedUv * 2.0 - u_time * u_flowSpeed + 0.5) - 0.5) * 2.0
            );
            vec2 distortedUv = vUv + flow * u_turbulence * 0.1;

            // --- PROBABILISTIC VORONOI PHOSPHOR CELLS ---
            vec2 uv = distortedUv;
            uv.x *= u_aspect;
            uv *= u_phosphorSize / 20.0;
            vec2 i_uv = floor(uv);

            vec2 points[9];
            float dists[9];
            int index = 0;
            for (int i = -1; i <= 1; i++) {
                for (int j = -1; j <= 1; j++) {
                    vec2 neighbor = vec2(float(i), float(j));
                    vec2 seed_point = i_uv + neighbor + hash22(i_uv + neighbor) * 0.5 + 0.5;
                    points[index] = seed_point;
                    dists[index] = length(seed_point - uv);
                    index++;
                }
            }

            float total_weight = 0.0;
            float weights[9];
            for (int k = 0; k < 9; k++) {
                float power = mix(16.0, 2.0, u_softness);
                float weight = 1.0 / (pow(dists[k], power) + 0.0001);
                weights[k] = weight;
                total_weight += weight;
            }
            vec2 final_point_pos = points[0];
            float roll = noise(vUv * 5.0 + u_time) * total_weight;
            float cumulative_weight = 0.0;
            for (int k = 0; k < 9; k++) {
                cumulative_weight += weights[k];
                if (roll < cumulative_weight) { final_point_pos = points[k]; break; }
            }
            vec2 phosphorUv = final_point_pos / (u_phosphorSize / 20.0);
            phosphorUv.x /= u_aspect;

            // --- CHROMATIC PHOSPHOR ASSEMBLY ---
            float r = texture2D(u_texture, phosphorUv - u_chromaticBleed).r;
            float g = texture2D(u_texture, phosphorUv).g;
            float b = texture2D(u_texture, phosphorUv + u_chromaticBleed).b;
            vec3 final_color = vec3(r, g, b);

            // --- KAWASE BLOOM (tinted toward the phosphor hue) ---
            vec3 bloom = kawaseBloom(u_texture, distortedUv, u_bloomRadius,
                                     u_bloomThreshold, u_bloomIntensity, u_texel, u_time);
            float bl = max(bloom.r, max(bloom.g, bloom.b));
            bloom = mix(bloom, u_phosphorTint * bl, u_tintAmount);
            final_color += bloom;

            // --- KAWASE UMBRA (negative bloom) ---
            float umbra = kawaseUmbra(u_texture, distortedUv, u_umbraRadius,
                                      u_umbraThreshold, u_umbraIntensity, u_texel, u_time);
            final_color -= umbra;

            gl_FragColor = vec4(clamp(final_color, 0.0, 1.0), 1.0);
        }
    `
});

// Phosphor persistence: a max-decay feedback blend. Bright matter lingers
// and rots toward black across frames — the signal breathes instead of stilling.
const feedbackMaterial = new THREE.ShaderMaterial({
    uniforms: feedbackUniforms,
    vertexShader: passthroughVertex,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D u_current;
        uniform sampler2D u_prev;
        uniform float u_persistence;
        void main() {
            vec3 cur  = texture2D(u_current, vUv).rgb;
            vec3 prev = texture2D(u_prev, vUv).rgb;
            vec3 trail = prev * u_persistence;
            gl_FragColor = vec4(max(cur, trail), 1.0);
        }
    `
});

// Tube present: barrel curvature, vignette, organic grain — applied last so
// distortion + grain never accumulate inside the feedback buffer.
const presentMaterial = new THREE.ShaderMaterial({
    uniforms: presentUniforms,
    vertexShader: passthroughVertex,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D u_texture;
        uniform float u_aspect, u_time, u_curvature, u_vignette, u_grain;
        void main() {
            vec2 c = vUv - 0.5;
            c.x *= u_aspect;
            float r2 = dot(c, c);
            vec2 w = c * (1.0 + u_curvature * r2);
            w.x /= u_aspect;
            vec2 uv = w + 0.5;

            if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
                gl_FragColor = vec4(0.051, 0.043, 0.024, 1.0); // hued sediment edge
                return;
            }

            vec3 col = texture2D(u_texture, uv).rgb;

            vec2 cc = uv - 0.5; cc.x *= u_aspect;
            float d = length(cc);
            col *= 1.0 - smoothstep(0.42, 0.95, d) * u_vignette;

            float gr = fract(sin(dot(floor(uv * vec2(900.0, 900.0)) + floor(u_time * 60.0),
                                     vec2(12.9898, 78.233))) * 43758.5453);
            col += (gr - 0.5) * u_grain;

            gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
        }
    `
});

// === RENDER TARGETS ==================================================
const rtParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, depthBuffer: false, stencilBuffer: false };
let rtScene = null, rtPrevA = null, rtPrevB = null;

function disposeTargets() {
    [rtScene, rtPrevA, rtPrevB].forEach(rt => rt && rt.dispose());
}
function recreateTargets(w, h) {
    disposeTargets();
    rtScene = new THREE.WebGLRenderTarget(w, h, rtParams);
    rtPrevA = new THREE.WebGLRenderTarget(w, h, rtParams);
    rtPrevB = new THREE.WebGLRenderTarget(w, h, rtParams);
    const old = renderer.getClearColor(new THREE.Color());
    renderer.setClearColor(0x000000, 1);
    [rtPrevA, rtPrevB].forEach(rt => { renderer.setRenderTarget(rt); renderer.clear(); });
    renderer.setRenderTarget(null);
    renderer.setClearColor(old, 1);
}

// === SOURCE HANDLING (image OR video) ================================
const MAX_SIZE = 600;
let sourceType = null;
let videoEl = null;
let activeTexture = null;

function applyAspect(w, h) {
    const aspect = w / h;
    let newWidth, newHeight;
    if (aspect >= 1) { newWidth = MAX_SIZE; newHeight = MAX_SIZE / aspect; }
    else { newWidth = MAX_SIZE * aspect; newHeight = MAX_SIZE; }
    newWidth = Math.round(newWidth); newHeight = Math.round(newHeight);

    canvasContainer.style.width = `${newWidth}px`;
    canvasContainer.style.height = `${newHeight}px`;
    renderer.setSize(newWidth, newHeight);
    recreateTargets(newWidth, newHeight);

    crtUniforms.u_aspect.value = aspect;
    presentUniforms.u_aspect.value = aspect;
    crtUniforms.u_texel.value.set(1 / newWidth, 1 / newHeight);
}

function clearVideo() {
    if (videoEl) { videoEl.pause(); videoEl.removeAttribute('src'); videoEl.load(); videoEl = null; }
    document.getElementById('video-transport').classList.add('hidden');
    document.getElementById('match-video-btn').classList.add('hidden');
}

function loadSource(file) {
    if (!file) return;
    if (file.type.startsWith('image/'))      loadImageFile(file);
    else if (file.type.startsWith('video/')) loadVideoFile(file);
}

function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        new THREE.TextureLoader().load(e.target.result, (texture) => {
            clearVideo();
            sourceType = 'image';
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            if (activeTexture) activeTexture.dispose();
            activeTexture = texture;
            crtUniforms.u_texture.value = texture;
            applyAspect(texture.image.naturalWidth, texture.image.naturalHeight);
            revealStage();
            document.getElementById('source-meta').textContent = '';
        });
    };
    reader.readAsDataURL(file);
}

function loadVideoFile(file) {
    clearVideo();
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.loop = document.getElementById('loop-toggle').checked;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    video.addEventListener('loadeddata', () => {
        sourceType = 'video';
        videoEl = video;
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.format = THREE.RGBAFormat;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        if (activeTexture) activeTexture.dispose();
        activeTexture = texture;
        crtUniforms.u_texture.value = texture;
        applyAspect(video.videoWidth, video.videoHeight);
        video.play().catch(() => {});
        revealStage();

        document.getElementById('video-transport').classList.remove('hidden');
        document.getElementById('match-video-btn').classList.remove('hidden');
        document.getElementById('play-pause-btn').textContent = '⏸ pause';
        const dur = isFinite(video.duration) ? video.duration.toFixed(1) + 's' : '—';
        document.getElementById('source-meta').textContent = `${video.videoWidth}×${video.videoHeight} · ${dur}`;
    }, { once: true });
}

function revealStage() {
    document.getElementById('drop-zone').classList.add('hidden');
}

// === RENDER LOOP (multipass) =========================================
function renderFrame() {
    quad.material = crtMaterial;
    renderer.setRenderTarget(rtScene);
    renderer.render(scene, camera);

    feedbackUniforms.u_current.value = rtScene.texture;
    feedbackUniforms.u_prev.value = rtPrevA.texture;
    quad.material = feedbackMaterial;
    renderer.setRenderTarget(rtPrevB);
    renderer.render(scene, camera);

    presentUniforms.u_texture.value = rtPrevB.texture;
    quad.material = presentMaterial;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    const t = rtPrevA; rtPrevA = rtPrevB; rtPrevB = t;
}

function animate() {
    requestAnimationFrame(animate);
    if (!crtUniforms.u_texture.value || !rtScene) return;
    crtUniforms.u_time.value += 0.01;
    presentUniforms.u_time.value = crtUniforms.u_time.value;
    renderFrame();
}
animate();

// === UI: SLIDER ↔ NUMBER SYNC ========================================
function setupSliderSync(sliderId, numberId, target, key, options = {}) {
    const slider = document.getElementById(sliderId);
    const numberInput = document.getElementById(numberId);
    if (!slider || !numberInput) return;
    const apply = (value) => {
        let v = parseFloat(value);
        if (options.isLog) v = Math.pow(v, 3);
        if (options.isExponential) v = Math.pow(v, 2);
        if (target && key) target[key].value = v;
    };
    slider.addEventListener('input', () => { numberInput.value = slider.value; apply(slider.value); });
    numberInput.addEventListener('input', () => { slider.value = numberInput.value; apply(numberInput.value); });
    numberInput.value = slider.value;
    apply(slider.value);
}

setupSliderSync('turbulence',     'turbulence-num',     crtUniforms, 'u_turbulence',    { isLog: true });
setupSliderSync('flowSpeed',      'flowSpeed-num',      crtUniforms, 'u_flowSpeed',     { isLog: true });
setupSliderSync('phosphorSize',   'phosphorSize-num',   crtUniforms, 'u_phosphorSize');
setupSliderSync('chromaticBleed', 'chromaticBleed-num', crtUniforms, 'u_chromaticBleed');
setupSliderSync('voronoiSoftness','voronoiSoftness-num',crtUniforms, 'u_softness');
setupSliderSync('bloomIntensity', 'bloomIntensity-num', crtUniforms, 'u_bloomIntensity');
setupSliderSync('bloomThreshold', 'bloomThreshold-num', crtUniforms, 'u_bloomThreshold');
setupSliderSync('bloomRadius',    'bloomRadius-num',    crtUniforms, 'u_bloomRadius');
setupSliderSync('umbraIntensity', 'umbraIntensity-num', crtUniforms, 'u_umbraIntensity');
setupSliderSync('umbraThreshold', 'umbraThreshold-num', crtUniforms, 'u_umbraThreshold');
setupSliderSync('umbraRadius',    'umbraRadius-num',    crtUniforms, 'u_umbraRadius');
setupSliderSync('persistence',    'persistence-num',    feedbackUniforms, 'u_persistence');
setupSliderSync('curvature',      'curvature-num',      presentUniforms, 'u_curvature');
setupSliderSync('vignette',       'vignette-num',       presentUniforms, 'u_vignette');
setupSliderSync('grain',          'grain-num',          presentUniforms, 'u_grain');
setupSliderSync('tintAmount',     'tintAmount-num',     crtUniforms, 'u_tintAmount');
setupSliderSync('duration',       'duration-num',       null, null);
setupSliderSync('fps',            'fps-num',            null, null);

const tintInput = document.getElementById('phosphorTint');
tintInput.addEventListener('input', () => crtUniforms.u_phosphorTint.value.set(tintInput.value));
crtUniforms.u_phosphorTint.value.set(tintInput.value);

// === FILE / DRAG-DROP ================================================
const body = document.body;
const fileUpload = document.getElementById('file-upload');
document.getElementById('upload-btn').addEventListener('click', () => fileUpload.click());
document.getElementById('upload-btn-placeholder').addEventListener('click', () => fileUpload.click());
fileUpload.addEventListener('change', (e) => loadSource(e.target.files[0]));
body.addEventListener('dragover', (e) => { e.preventDefault(); body.classList.add('drag-over'); });
body.addEventListener('dragleave', () => body.classList.remove('drag-over'));
body.addEventListener('drop', (e) => { e.preventDefault(); body.classList.remove('drag-over'); loadSource(e.dataTransfer.files[0]); });

// === VIDEO TRANSPORT =================================================
document.getElementById('play-pause-btn').addEventListener('click', () => {
    if (!videoEl) return;
    if (videoEl.paused) { videoEl.play(); document.getElementById('play-pause-btn').textContent = '⏸ pause'; }
    else { videoEl.pause(); document.getElementById('play-pause-btn').textContent = '▶ play'; }
});
document.getElementById('loop-toggle').addEventListener('change', (e) => { if (videoEl) videoEl.loop = e.target.checked; });
document.getElementById('match-video-btn').addEventListener('click', () => {
    if (videoEl && isFinite(videoEl.duration)) {
        const d = Math.max(1, Math.ceil(videoEl.duration));
        document.getElementById('duration').value = Math.min(d, 30);
        document.getElementById('duration-num').value = d;
    }
});

// === SAVE STILL FRAME ================================================
document.getElementById('save-btn').addEventListener('click', () => {
    if (!crtUniforms.u_texture.value) return;
    const link = document.createElement('a');
    link.download = 'siltcrt-frame.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// === RANDOMIZE =======================================================
document.getElementById('randomize-btn').addEventListener('click', () => {
    const rnd = (min, max) => (Math.random() * (max - min) + min);
    const set = (id, v, dp = 2) => {
        const s = document.getElementById(id), n = document.getElementById(id + '-num');
        if (!s) return;
        const val = parseFloat(v).toFixed(dp);
        s.value = val; n.value = val;
        s.dispatchEvent(new Event('input'));
    };
    set('turbulence', rnd(0.1, 0.7));
    set('flowSpeed', rnd(0.2, 0.7));
    set('phosphorSize', Math.round(rnd(40, 4000)), 0);
    set('chromaticBleed', rnd(0, 0.008), 4);
    set('voronoiSoftness', rnd(0.2, 0.9));
    set('bloomIntensity', rnd(0.4, 1.4));
    set('bloomThreshold', rnd(0.4, 0.85));
    set('bloomRadius', rnd(1, 5), 1);
    set('persistence', rnd(0.3, 0.85));
    set('curvature', rnd(0, 0.25));
    set('vignette', rnd(0.2, 0.7));
    set('grain', rnd(0.02, 0.18), 3);
    set('tintAmount', rnd(0.2, 0.7));
});

// === VIDEO EXPORT (canvas → MediaRecorder → .webm) ===================
const recordBtn = document.getElementById('record-btn');
const recIndicator = document.getElementById('rec-indicator');
const captureStatus = document.getElementById('capture-status');
let recorder = null, recording = false;

function pickMimeType() {
    const candidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
    if (!window.MediaRecorder) return '';
    for (const t of candidates) { if (MediaRecorder.isTypeSupported(t)) return t; }
    return '';
}

recordBtn.addEventListener('click', () => {
    if (recording) return;
    if (!crtUniforms.u_texture.value) { captureStatus.textContent = 'load a specimen first'; return; }

    const mime = pickMimeType();
    if (!mime) { captureStatus.textContent = 'recording unsupported in this browser'; return; }

    const seconds = Math.max(1, parseInt(document.getElementById('duration-num').value, 10) || 6);
    const fps = Math.min(60, Math.max(12, parseInt(document.getElementById('fps-num').value, 10) || 30));

    const stream = canvas.captureStream(fps);
    const chunks = [];
    recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 12000000 });
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
        const ext = mime.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: mime });
        const link = document.createElement('a');
        link.download = `siltcrt-capture.${ext}`;
        link.href = URL.createObjectURL(blob);
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 4000);
        finishRecording();
    };

    if (sourceType === 'video' && videoEl) {
        videoEl.currentTime = 0;
        videoEl.loop = true;
        videoEl.play().catch(() => {});
        document.getElementById('play-pause-btn').textContent = '⏸ pause';
    }

    recording = true;
    recordBtn.classList.add('recording');
    recordBtn.textContent = 'capturing…';
    recIndicator.classList.remove('hidden');
    recorder.start();

    const start = performance.now();
    const total = seconds * 1000;
    const tick = () => {
        if (!recording) return;
        const elapsed = performance.now() - start;
        const remain = Math.max(0, (total - elapsed) / 1000);
        captureStatus.textContent = `capturing · ${remain.toFixed(1)}s left`;
        if (elapsed >= total) { if (recorder && recorder.state !== 'inactive') recorder.stop(); }
        else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
});

function finishRecording() {
    recording = false;
    recordBtn.classList.remove('recording');
    recordBtn.textContent = 'export video';
    recIndicator.classList.add('hidden');
    captureStatus.textContent = 'saved · records the live signal to .webm';
    if (sourceType === 'video' && videoEl) {
        videoEl.loop = document.getElementById('loop-toggle').checked;
    }
}