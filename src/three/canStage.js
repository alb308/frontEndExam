import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* =========================================================
   Can skin: wraps the front photo round the front half of the
   can and the back photo (or the front again, if there's no
   back) round the other half, with a short crossfade at the
   sides. The projection is the physical one (x = sin θ), so
   seen from the front the can matches the photo exactly. Past
   ~70° the photo has almost no detail left; that last strip is
   only ever seen edge-on, because the can rests on a face.
   ========================================================= */
const SKIN_W = 1024;
const REACH = (70 * Math.PI) / 180; // furthest angle the photo still resolves
const SIN_REACH = Math.sin(REACH);
const SEAM = 0.05; // radians of crossfade where the two halves meet
const skins = new Map();
const imageLoader = new THREE.ImageLoader();

export function loadSkin(front, back) {
  const key = `${front}|${back ?? ''}`;
  if (!skins.has(key)) {
    skins.set(key, Promise.all([
      imageLoader.loadAsync(front),
      back ? imageLoader.loadAsync(back).catch(() => null) : null,
    ]).then(([f, b]) => buildSkin(readPhoto(f), b && readPhoto(b))));
  }
  return skins.get(key);
}

// Pixels, per-row silhouette and a fix for the shading baked into the photo's edges.
function readPhoto(img) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, w, h).data;

  const left = new Float32Array(h).fill(-1);
  const right = new Float32Array(h).fill(-1);
  let widest = 0;
  for (let y = 0; y < h; y++) {
    let l = 0, r = w - 1;
    while (l < w && px[(y * w + l) * 4 + 3] < 128) l++;
    while (r > l && px[(y * w + r) * 4 + 3] < 128) r--;
    if (l < r) { left[y] = l + 1; right[y] = r - 1; widest = Math.max(widest, r - l); }
  }
  let top = 0, bottom = h - 1;
  while (top < h && right[top] - left[top] < widest * 0.3) top++;
  while (bottom > top && right[bottom] - left[bottom] < widest * 0.3) bottom--;
  for (let y = top + 1; y <= bottom; y++) {
    if (right[y] - left[y] < widest * 0.3) { left[y] = left[y - 1]; right[y] = right[y - 1]; }
  }

  // Brightness across the can (−1…1). Edges darker than the middle are studio falloff,
  // which would show as a dark stripe once the side faces the camera: lift it back up.
  const BINS = 48;
  const lum = new Float32Array(BINS), cnt = new Float32Array(BINS);
  for (let y = top; y <= bottom; y += 2) {
    const cx = (left[y] + right[y]) / 2, half = (right[y] - left[y]) / 2;
    for (let b = 0; b < BINS; b++) {
      const o = (y * w + Math.round(cx + ((b + 0.5) / BINS * 2 - 1) * half)) * 4;
      lum[b] += 0.2126 * px[o] + 0.7152 * px[o + 1] + 0.0722 * px[o + 2]; cnt[b]++;
    }
  }
  let ref = 0, refN = 0;
  for (let b = 0; b < BINS; b++) {
    lum[b] /= cnt[b];
    if (Math.abs((b + 0.5) / BINS * 2 - 1) < 0.35) { ref += lum[b]; refN++; }
  }
  ref /= refN;
  const gain = new Float32Array(BINS);
  for (let b = 0; b < BINS; b++) {
    const x = Math.abs((b + 0.5) / BINS * 2 - 1);
    const g = THREE.MathUtils.clamp(ref / Math.max(lum[b], 1), 1, 1.4);
    gain[b] = THREE.MathUtils.lerp(1, g, THREE.MathUtils.smoothstep(x, 0.5, 0.9));
  }

  const widths = [];
  for (let y = top; y <= bottom; y++) widths.push(right[y] - left[y]);
  widths.sort((a, b) => a - b);
  const aspect = (bottom - top + 1) / Math.max(1, widths[widths.length >> 1]);

  return { px, w, top, rows: bottom - top + 1, left, right, gain, aspect };
}

// Colour of photo p at normalised height t (0 = top) and across-position x (−1…1).
function sampler(p) {
  const BINS = p.gain.length;
  return (t, x, out) => {
    const y = p.top + Math.round(t * (p.rows - 1));
    const cx = (p.left[y] + p.right[y]) / 2, half = (p.right[y] - p.left[y]) / 2;
    const fx = cx + x * half;
    const x0 = Math.floor(fx), f = fx - x0;
    const a = (y * p.w + x0) * 4;
    const g = p.gain[Math.min(BINS - 1, Math.floor((x + 1) / 2 * BINS))];
    for (let c = 0; c < 3; c++) out[c] = Math.min(255, (p.px[a + c] * (1 - f) + p.px[a + 4 + c] * f) * g);
  };
}

// Angle on the can → position across the photo (−1…1).
function project(theta) {
  const a = Math.abs(theta);
  const x = a <= REACH
    ? Math.sin(a)
    : SIN_REACH + (1 - SIN_REACH) * Math.min(1, (a - REACH) / (Math.PI / 2 + SEAM - REACH));
  return Math.sign(theta) * x;
}

function buildSkin(front, back) {
  const rows = front.rows;
  const sf = sampler(front), sb = sampler(back ?? front);

  const xf = new Float32Array(SKIN_W), xb = new Float32Array(SKIN_W), mix = new Float32Array(SKIN_W);
  for (let i = 0; i < SKIN_W; i++) {
    const theta = ((i + 0.5) / SKIN_W) * Math.PI * 2 - Math.PI;
    const phi = theta > 0 ? theta - Math.PI : theta + Math.PI; // angle from the back's centre
    xf[i] = project(theta);
    xb[i] = project(phi);
    mix[i] = THREE.MathUtils.smoothstep(Math.abs(theta) - Math.PI / 2, -SEAM, SEAM);
  }

  const out = document.createElement('canvas');
  out.width = SKIN_W; out.height = rows;
  const octx = out.getContext('2d');
  const dst = octx.createImageData(SKIN_W, rows);
  const d = dst.data;
  const a = [0, 0, 0], b = [0, 0, 0];
  for (let row = 0; row < rows; row++) {
    const t = row / Math.max(1, rows - 1);
    for (let i = 0; i < SKIN_W; i++) {
      const m = mix[i], o = (row * SKIN_W + i) * 4;
      if (m < 1) sf(t, xf[i], a);
      if (m > 0) sb(t, xb[i], b);
      for (let c = 0; c < 3; c++) d[o + c] = a[c] * (1 - m) + b[c] * m;
      d[o + 3] = 255;
    }
  }
  octx.putImageData(dst, 0, 0);
  return { canvas: out, aspect: front.aspect };
}

/* =========================================================
   Geometry: one lathe for the printed wall, one for the
   aluminium ends, plus rim and pull tab. Radius = 1.
   ========================================================= */
const v2 = (x, y) => new THREE.Vector2(x, y);

function buildCan(H) {
  const wall = new THREE.LatheGeometry([
    v2(0.86, 0), v2(0.93, 0.03), v2(0.98, 0.08), v2(1, 0.15),
    v2(1, H - 0.38), v2(0.97, H - 0.26), v2(0.9, H - 0.12), v2(0.87, H - 0.04), v2(0.88, H),
  ], 128, -Math.PI, Math.PI * 2);
  // Map the photo by height, not by profile index, so the print isn't stretched on the neck.
  const pos = wall.attributes.position;
  const uv = wall.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setY(i, pos.getY(i) / H);

  const base = new THREE.LatheGeometry([v2(0, 0.12), v2(0.55, 0.1), v2(0.78, 0.03), v2(0.86, 0)], 96); // domed
  const lid = new THREE.LatheGeometry([
    v2(0.88, H), v2(0.84, H - 0.02), v2(0.8, H - 0.06), v2(0.3, H - 0.065), v2(0, H - 0.065),
  ], 96); // recessed

  const rim = new THREE.TorusGeometry(0.865, 0.028, 12, 96);
  rim.rotateX(Math.PI / 2);
  rim.translate(0, H - 0.005, 0);

  const tabShape = new THREE.Shape();
  tabShape.absarc(0, 0.12, 0.2, 0, Math.PI, false);
  tabShape.absarc(0, -0.3, 0.16, Math.PI, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absellipse(0, 0.1, 0.12, 0.08, 0, Math.PI * 2, true);
  tabShape.holes.push(hole);
  const tab = new THREE.ExtrudeGeometry(tabShape, {
    depth: 0.015, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.01, bevelSegments: 2, curveSegments: 24,
  });
  tab.rotateX(-Math.PI / 2);
  tab.translate(0, H - 0.045, 0.12);

  const rivet = new THREE.CylinderGeometry(0.05, 0.06, 0.03, 20);
  rivet.translate(0, H - 0.05, 0.02);

  return { wall, base, lid, rim, tab, rivet };
}

/* =========================================================
   Floor light: radial falloff in a tiny shader, used both
   for the coloured glow and the contact shadow.
   ========================================================= */
function floorMaterial(color, strength, falloff, additive) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uStrength: { value: strength },
      uFalloff: { value: falloff },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uColor;
      uniform float uStrength;
      uniform float uFalloff;
      varying vec2 vUv;
      void main() {
        float d = clamp(1.0 - length(vUv - 0.5) * 2.0, 0.0, 1.0);
        gl_FragColor = vec4(uColor, pow(d, uFalloff) * uStrength);
      }`,
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

const easeOutBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
const easeInCubic = (t) => t * t * t;
const damp = (a, b, lambda, dt) => THREE.MathUtils.lerp(a, b, 1 - Math.exp(-lambda * dt));

/* =========================================================
   Stage: renderer + scene + interaction for one can.
   ========================================================= */
export class CanStage {
  constructor(host, { onReady, onError } = {}) {
    this.host = host;
    this.onReady = onReady;
    this.onError = onError;
    this.calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = 'can3d__canvas';
    host.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envMap;
    this.scene.environmentIntensity = 0.85;

    this.camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);

    // Key from front-right, two coloured rims from behind for the "neon" edge.
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 4, 5);
    this.rimL = new THREE.DirectionalLight(0xffffff, 3.2);
    this.rimL.position.set(-4, 2, -3);
    this.rimR = new THREE.DirectionalLight(0xffffff, 2.2);
    this.rimR.position.set(4, 1, -2.5);
    this.scene.add(key, this.rimL, this.rimR);

    this.glowColor = new THREE.Color('#a3ff12');
    this.targetGlow = this.glowColor.clone();

    this.labelMat = new THREE.MeshPhysicalMaterial({
      metalness: 0.3, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12,
    });
    this.metalMat = new THREE.MeshStandardMaterial({
      color: 0xd5d9de, metalness: 1, roughness: 0.26, side: THREE.DoubleSide,
    });

    // spin → float → can, so idle bob and drag rotation don't fight each other.
    this.pivot = new THREE.Group();
    this.spin = new THREE.Group();
    this.can = new THREE.Group();
    this.pivot.add(this.spin);
    this.spin.add(this.can);
    this.scene.add(this.pivot);

    this.glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), floorMaterial('#a3ff12', 0.55, 2.2, true));
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), floorMaterial('#000000', 0.75, 1.6, false));
    for (const m of [this.glow, this.shadow]) { m.rotation.x = -Math.PI / 2; this.scene.add(m); }
    this.glow.scale.setScalar(5.5);
    this.shadow.renderOrder = 1;

    this.H = 5;
    this.time = 0;
    this.angle = 0;
    this.velocity = 0;
    this.face = 0; // which face the can rests on: even = front, odd = back
    this.tilt = new THREE.Vector2();
    this.tiltTarget = new THREE.Vector2();
    this.anim = null; // { phase: 'out' | 'in', t }
    this.token = 0;

    this.bindInput();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.resize();

    // Only burn GPU while the can is on screen.
    this.visible = false;
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      renderer.setAnimationLoop(this.visible ? this.tick : null);
    });
    this.io.observe(host);
    this.timer = new THREE.Timer();
  }

  bindInput() {
    const el = this.renderer.domElement;
    let lastX = 0, lastT = 0, dragging = false;

    this.onDown = (e) => {
      dragging = true;
      lastX = e.clientX; lastT = performance.now();
      this.velocity = 0;
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-grabbing');
    };
    this.onMove = (e) => {
      const r = el.getBoundingClientRect();
      this.tiltTarget.set(((e.clientY - r.top) / r.height - 0.5) * 0.22, ((e.clientX - r.left) / r.width - 0.5) * -0.12);
      if (!dragging) return;
      const now = performance.now();
      const delta = (e.clientX - lastX) * 0.012;
      this.angle += delta;
      this.velocity = delta / Math.max((now - lastT) / 1000, 0.008);
      lastX = e.clientX; lastT = now;
    };
    this.onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      if (performance.now() - lastT > 80) this.velocity = 0; // held still before letting go
      // Settle on the face it was thrown towards; the sides are only ever seen in passing.
      this.face = Math.round((this.angle + this.velocity * 0.25) / Math.PI);
      el.releasePointerCapture?.(e.pointerId);
      el.classList.remove('is-grabbing');
    };
    this.onLeave = () => this.tiltTarget.set(0, 0);
    this.isDragging = () => dragging;

    el.addEventListener('pointerdown', this.onDown);
    el.addEventListener('pointermove', this.onMove);
    el.addEventListener('pointerup', this.onUp);
    el.addEventListener('pointercancel', this.onUp);
    el.addEventListener('pointerleave', this.onLeave);
  }

  async setCan(src, color, back) {
    const token = ++this.token;
    if (color) this.targetGlow.set(color);
    let skin;
    try {
      skin = await loadSkin(src, back);
    } catch (err) {
      if (token === this.token) this.onError?.(err);
      return;
    }
    if (token !== this.token || !this.renderer) return;

    const texture = new THREE.CanvasTexture(skin.canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());

    const first = !this.can.children.length;
    if (first || this.calm) {
      this.swap(texture, skin.aspect);
      this.anim = this.calm ? null : { phase: 'in', t: 0 };
      if (first) this.onReady?.();
    } else {
      this.pending?.texture.dispose();
      this.pending = { texture, aspect: skin.aspect };
      if (this.anim?.phase !== 'out') this.anim = { phase: 'out', t: 0 };
      this.face = 2 * Math.ceil((this.angle + 0.5) / (Math.PI * 2)); // whip round to the next front
    }
  }

  swap(texture, aspect) {
    this.labelMat.map?.dispose();
    this.labelMat.map = texture;
    this.labelMat.needsUpdate = true;

    for (const m of this.can.children) m.geometry.dispose();
    this.can.clear();
    this.H = 2 * aspect;
    const g = buildCan(this.H);
    this.can.add(
      new THREE.Mesh(g.wall, this.labelMat),
      new THREE.Mesh(g.base, this.metalMat),
      new THREE.Mesh(g.lid, this.metalMat),
      new THREE.Mesh(g.rim, this.metalMat),
      new THREE.Mesh(g.tab, this.metalMat),
      new THREE.Mesh(g.rivet, this.metalMat),
    );
    this.can.position.y = -this.H / 2;
    this.frame();
  }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.host;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.frame();
  }

  // Fit the whole can (plus some air for the float) in view, whatever its proportions.
  frame() {
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const fitH = (this.H * 1.22) / 2 / Math.tan(fov / 2);
    const fitW = 2.6 / 2 / Math.tan(fov / 2) / this.camera.aspect;
    const dist = Math.max(fitH, fitW);
    this.camera.position.set(0, this.H * 0.06, dist);
    this.camera.lookAt(0, 0, 0);
    const floor = -this.H / 2 - 0.02;
    this.glow.position.y = floor;
    this.shadow.position.y = floor + 0.001;
  }

  tick = () => {
    this.timer.update();
    const dt = Math.min(this.timer.getDelta(), 0.05);
    this.time += dt;

    // Swap choreography: drop + shrink out, pop back in with overshoot.
    let scale = 1, drop = 0;
    if (this.anim) {
      const a = this.anim;
      a.t += dt / (a.phase === 'out' ? 0.28 : 0.75);
      if (a.phase === 'out') {
        const k = easeInCubic(Math.min(a.t, 1));
        scale = 1 - 0.18 * k; drop = -0.9 * k;
        if (a.t >= 1) {
          this.swap(this.pending.texture, this.pending.aspect);
          this.pending = null;
          this.anim = { phase: 'in', t: 0 };
          scale = 0.82; drop = -0.9;
        }
      } else {
        const k = easeOutBack(Math.min(a.t, 1));
        scale = 0.82 + 0.18 * k; drop = -0.9 * (1 - k);
        if (a.t >= 1) this.anim = null;
      }
    }

    if (!this.isDragging()) {
      // Spring towards the resting face plus a slow sway, so the can still feels alive.
      const sway = this.calm ? 0 : Math.sin(this.time * 0.55) * 0.35;
      const k = 14;
      this.velocity += (-k * (this.angle - (this.face * Math.PI + sway)) - 2 * Math.sqrt(k) * this.velocity) * dt;
      this.angle += this.velocity * dt;
    }
    this.spin.rotation.y = this.angle;

    const bob = this.calm ? 0 : Math.sin(this.time * 1.2) * 0.09;
    this.can.position.y = -this.H / 2 + bob + drop;
    this.spin.scale.setScalar(scale);
    this.tilt.x = damp(this.tilt.x, this.tiltTarget.x, 4, dt);
    this.tilt.y = damp(this.tilt.y, this.tiltTarget.y, 4, dt);
    this.pivot.rotation.set(this.tilt.x, 0, this.tilt.y + (this.calm ? 0 : Math.sin(this.time * 0.7) * 0.025));

    // Shadow tightens as the can lifts; colours ease to the new line's glow.
    this.shadow.scale.setScalar(2.3 * scale - bob * 1.5 - drop * 0.4);
    this.glowColor.lerp(this.targetGlow, 1 - Math.exp(-3 * dt));
    this.glow.material.uniforms.uColor.value.copy(this.glowColor);
    this.rimL.color.copy(this.glowColor);
    this.rimR.color.copy(this.glowColor).lerp(new THREE.Color(1, 1, 1), 0.5);

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.token++;
    this.io.disconnect();
    this.resizeObserver.disconnect();
    this.renderer.setAnimationLoop(null);
    const el = this.renderer.domElement;
    el.removeEventListener('pointerdown', this.onDown);
    el.removeEventListener('pointermove', this.onMove);
    el.removeEventListener('pointerup', this.onUp);
    el.removeEventListener('pointercancel', this.onUp);
    el.removeEventListener('pointerleave', this.onLeave);
    this.pending?.texture.dispose();
    this.scene.traverse((o) => {
      o.geometry?.dispose();
      if (o.material && o.material !== this.labelMat && o.material !== this.metalMat) o.material.dispose();
    });
    this.labelMat.map?.dispose();
    this.labelMat.dispose();
    this.metalMat.dispose();
    this.envMap.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    el.remove();
    this.renderer = null;
  }
}
