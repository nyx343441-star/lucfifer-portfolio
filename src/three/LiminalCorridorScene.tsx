import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

interface LiminalCorridorSceneProps {
  paused?: boolean;
  reducedMotion?: boolean;
}

const _dummy = new THREE.Object3D();
const _targetCam = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _colorTmp = new THREE.Color();

function createSeededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

interface SurfaceTextureSet {
  albedo: THREE.CanvasTexture;
  roughness: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

function createBrutalistWallMaps(
  maxAnisotropy: number,
  resolution: number
): SurfaceTextureSet {
  const rand = createSeededRandom(4219);
  const size = resolution;

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const aCtx = albedoCanvas.getContext('2d');

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  if (aCtx && rCtx && bCtx) {
    // Rich dark charcoal-navy architectural concrete
    aCtx.fillStyle = '#121620';
    aCtx.fillRect(0, 0, size, size);

    rCtx.fillStyle = '#b8b8b8';
    rCtx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    // Subtle board-formed horizontal tonal bands
    const bandCount = 16;
    const bandH = size / bandCount;
    for (let i = 0; i < bandCount; i++) {
      const shade = 14 + Math.floor(rand() * 10);
      aCtx.fillStyle = `rgba(${shade}, ${shade + 3}, ${shade + 10}, 0.16)`;
      aCtx.fillRect(0, i * bandH, size, bandH);
    }

    // Fine mineral aggregate & subtle tonal weathering
    const speckCount = Math.floor(size * 12);
    for (let i = 0; i < speckCount; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const w = 1 + rand() * 3.6;
      const shade = Math.floor(11 + rand() * 24);
      aCtx.fillStyle = `rgba(${shade}, ${shade + 3}, ${shade + 9}, 0.22)`;
      aCtx.fillRect(x, y, w, w);

      const rShade = Math.floor(135 + rand() * 90);
      rCtx.fillStyle = `rgba(${rShade}, ${rShade}, ${rShade}, 0.2)`;
      rCtx.fillRect(x, y, w * 1.4, w * 1.4);

      const bShade = Math.floor(108 + rand() * 42);
      bCtx.fillStyle = `rgba(${bShade}, ${bShade}, ${bShade}, 0.24)`;
      bCtx.fillRect(x, y, w, w);
    }

    // Vertical moisture / atmospheric runoff streaks on brutalist concrete
    for (let i = 0; i < 36; i++) {
      const sx = rand() * size;
      const sy = rand() * size * 0.4;
      const sh = size * (0.25 + rand() * 0.55);
      const sw = 2 + rand() * 8;
      const streakGrad = aCtx.createLinearGradient(sx, sy, sx, sy + sh);
      streakGrad.addColorStop(0, 'rgba(6, 8, 13, 0.28)');
      streakGrad.addColorStop(0.5, 'rgba(7, 9, 15, 0.14)');
      streakGrad.addColorStop(1, 'rgba(18, 22, 32, 0)');
      aCtx.fillStyle = streakGrad;
      aCtx.fillRect(sx, sy, sw, sh);

      const rStreak = rCtx.createLinearGradient(sx, sy, sx, sy + sh);
      rStreak.addColorStop(0, 'rgba(95, 95, 95, 0.28)');
      rStreak.addColorStop(1, 'rgba(184, 184, 184, 0)');
      rCtx.fillStyle = rStreak;
      rCtx.fillRect(sx, sy, sw, sh);
    }

    // Architectural formwork panel seams with micro-chamfer highlights
    const step = size / 4;
    for (let g = 0; g <= size; g += step) {
      aCtx.strokeStyle = 'rgba(4, 5, 9, 0.72)';
      aCtx.lineWidth = 2.2;
      aCtx.beginPath();
      aCtx.moveTo(0, g);
      aCtx.lineTo(size, g);
      aCtx.moveTo(g, 0);
      aCtx.lineTo(g, size);
      aCtx.stroke();

      aCtx.strokeStyle = 'rgba(38, 46, 66, 0.22)';
      aCtx.lineWidth = 1;
      aCtx.beginPath();
      aCtx.moveTo(0, g + 2);
      aCtx.lineTo(size, g + 2);
      aCtx.stroke();

      bCtx.strokeStyle = 'rgba(34, 34, 34, 0.85)';
      bCtx.lineWidth = 2.5;
      bCtx.beginPath();
      bCtx.moveTo(0, g);
      bCtx.lineTo(size, g);
      bCtx.moveTo(g, 0);
      bCtx.lineTo(g, size);
      bCtx.stroke();
    }

    // Recessed tie-rod form holes
    for (let gx = step * 0.2; gx < size; gx += step) {
      for (let gy = step * 0.2; gy < size; gy += step) {
        aCtx.fillStyle = 'rgba(4, 5, 8, 0.72)';
        aCtx.beginPath();
        aCtx.arc(gx, gy, 2.5, 0, Math.PI * 2);
        aCtx.fill();

        bCtx.fillStyle = 'rgba(22, 22, 22, 0.92)';
        bCtx.beginPath();
        bCtx.arc(gx, gy, 3.1, 0, Math.PI * 2);
        bCtx.fill();
      }
    }
  }

  const albedo = new THREE.CanvasTexture(albedoCanvas);
  albedo.colorSpace = THREE.SRGBColorSpace;
  albedo.wrapS = THREE.RepeatWrapping;
  albedo.wrapT = THREE.RepeatWrapping;
  albedo.repeat.set(3, 12);
  albedo.anisotropy = maxAnisotropy;

  const roughness = new THREE.CanvasTexture(roughCanvas);
  roughness.wrapS = THREE.RepeatWrapping;
  roughness.wrapT = THREE.RepeatWrapping;
  roughness.repeat.set(3, 12);
  roughness.anisotropy = maxAnisotropy;

  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(3, 12);
  bump.anisotropy = maxAnisotropy;

  return { albedo, roughness, bump };
}

function createWetFloorMaps(
  maxAnisotropy: number,
  resolution: number
): SurfaceTextureSet {
  const rand = createSeededRandom(8842);
  const size = resolution;

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const aCtx = albedoCanvas.getContext('2d');

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  if (aCtx && rCtx && bCtx) {
    // Dark troweled slate-concrete floor
    aCtx.fillStyle = '#0d1018';
    aCtx.fillRect(0, 0, size, size);

    // Mid-matte damp baseline roughness (0.58)
    rCtx.fillStyle = '#969696';
    rCtx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    // Fine mineral grit
    const speckCount = Math.floor(size * 10);
    for (let i = 0; i < speckCount; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const w = 1 + rand() * 3.5;
      const shade = Math.floor(9 + rand() * 18);
      aCtx.fillStyle = `rgba(${shade}, ${shade + 2}, ${shade + 6}, 0.2)`;
      aCtx.fillRect(x, y, w, w);

      const bShade = Math.floor(110 + rand() * 36);
      bCtx.fillStyle = `rgba(${bShade}, ${bShade}, ${bShade}, 0.2)`;
      bCtx.fillRect(x, y, w, w);
    }

    // Large organic shallow puddles (very dark roughness = glossy mirror reflections)
    for (let i = 0; i < 22; i++) {
      const cx = rand() * size;
      const cy = rand() * size;
      const rad = size * (0.08 + rand() * 0.16);

      const puddleRough = rCtx.createRadialGradient(cx, cy, rad * 0.15, cx, cy, rad);
      puddleRough.addColorStop(0, 'rgba(10, 10, 10, 0.92)');
      puddleRough.addColorStop(0.55, 'rgba(26, 26, 26, 0.7)');
      puddleRough.addColorStop(0.85, 'rgba(72, 72, 72, 0.35)');
      puddleRough.addColorStop(1, 'rgba(150, 150, 150, 0)');
      rCtx.fillStyle = puddleRough;
      rCtx.beginPath();
      rCtx.arc(cx, cy, rad, 0, Math.PI * 2);
      rCtx.fill();

      // Wet concrete darkens slightly beneath water film
      const puddleDark = aCtx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      puddleDark.addColorStop(0, 'rgba(5, 6, 11, 0.55)');
      puddleDark.addColorStop(0.75, 'rgba(7, 9, 15, 0.28)');
      puddleDark.addColorStop(1, 'rgba(13, 16, 24, 0)');
      aCtx.fillStyle = puddleDark;
      aCtx.beginPath();
      aCtx.arc(cx, cy, rad, 0, Math.PI * 2);
      aCtx.fill();

      // Flatten micro-bump slightly inside standing water
      const puddleFlat = bCtx.createRadialGradient(cx, cy, 0, cx, cy, rad * 0.85);
      puddleFlat.addColorStop(0, 'rgba(128, 128, 128, 0.85)');
      puddleFlat.addColorStop(1, 'rgba(128, 128, 128, 0)');
      bCtx.fillStyle = puddleFlat;
      bCtx.beginPath();
      bCtx.arc(cx, cy, rad, 0, Math.PI * 2);
      bCtx.fill();
    }

    // Crisp floor expansion joints
    const step = size / 4;
    aCtx.strokeStyle = 'rgba(3, 4, 7, 0.8)';
    aCtx.lineWidth = 2;
    bCtx.strokeStyle = 'rgba(28, 28, 28, 0.9)';
    bCtx.lineWidth = 2.4;
    for (let g = 0; g <= size; g += step) {
      aCtx.beginPath();
      aCtx.moveTo(0, g);
      aCtx.lineTo(size, g);
      aCtx.moveTo(g, 0);
      aCtx.lineTo(g, size);
      aCtx.stroke();

      bCtx.beginPath();
      bCtx.moveTo(0, g);
      bCtx.lineTo(size, g);
      bCtx.moveTo(g, 0);
      bCtx.lineTo(g, size);
      bCtx.stroke();
    }
  }

  const albedo = new THREE.CanvasTexture(albedoCanvas);
  albedo.colorSpace = THREE.SRGBColorSpace;
  albedo.wrapS = THREE.RepeatWrapping;
  albedo.wrapT = THREE.RepeatWrapping;
  albedo.repeat.set(3, 16);
  albedo.anisotropy = maxAnisotropy;

  const roughness = new THREE.CanvasTexture(roughCanvas);
  roughness.wrapS = THREE.RepeatWrapping;
  roughness.wrapT = THREE.RepeatWrapping;
  roughness.repeat.set(3, 16);
  roughness.anisotropy = maxAnisotropy;

  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(3, 16);
  bump.anisotropy = maxAnisotropy;

  return { albedo, roughness, bump };
}

function createDustTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(248, 250, 255, 0.92)');
    grad.addColorStop(0.35, 'rgba(186, 202, 232, 0.36)');
    grad.addColorStop(1, 'rgba(5, 5, 7, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function LiminalCorridorScene({
  paused = false,
  reducedMotion = false,
}: LiminalCorridorSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(paused || reducedMotion);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    pausedRef.current = paused || reducedMotion;
  }, [paused, reducedMotion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const isMobile = window.innerWidth < 768;
    if (isSoftwareGl) {
      document.body.classList.add('software-gl');
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && !isMobile,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    );
    renderer.setSize(
      container.clientWidth || window.innerWidth,
      container.clientHeight || window.innerHeight
    );
    renderer.shadowMap.enabled = !isSoftwareGl && !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x05060c);
    scene.background = fogColor;
    scene.fog = new THREE.FogExp2(0x060811, 0.032);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 2.25, 8.5);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.045);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const texResolution = isMobile ? 512 : 1024;
    const wallMaps = createBrutalistWallMaps(maxAnisotropy, texResolution);
    const floorMaps = createWetFloorMaps(maxAnisotropy, texResolution);

    // Cinema Lighting Rig: cool midnight skylight + angled shadow key + softboxes + deep crimson beacons
    const hemiLight = new THREE.HemisphereLight(0x4a6085, 0x05060b, 0.78);
    scene.add(hemiLight);

    const atriumKey = new THREE.DirectionalLight(0xdbe7ff, 2.05);
    atriumKey.position.set(6.5, 22, 8);
    if (!isSoftwareGl && !isMobile) {
      atriumKey.castShadow = true;
      atriumKey.shadow.mapSize.width = 2048;
      atriumKey.shadow.mapSize.height = 2048;
      atriumKey.shadow.camera.near = 2;
      atriumKey.shadow.camera.far = 70;
      atriumKey.shadow.camera.left = -16;
      atriumKey.shadow.camera.right = 16;
      atriumKey.shadow.camera.top = 30;
      atriumKey.shadow.camera.bottom = -30;
      atriumKey.shadow.radius = 3;
      atriumKey.shadow.bias = -0.0004;
      atriumKey.shadow.normalBias = 0.02;
    }
    scene.add(atriumKey);

    // Subtle overhead skylight softbox panels for elongated wet-floor & brushed-steel highlights
    const rectLights: THREE.RectAreaLight[] = [];
    if (!isSoftwareGl && !isMobile) {
      RectAreaLightUniformsLib.init();
      const skyPanel1 = new THREE.RectAreaLight(0x7c98c4, 3.2, 6.5, 3.2);
      skyPanel1.position.set(0, 11.4, -10);
      skyPanel1.lookAt(0, 0, -10);
      scene.add(skyPanel1);
      rectLights.push(skyPanel1);

      const skyPanel2 = new THREE.RectAreaLight(0x637ea8, 2.8, 6.5, 3.2);
      skyPanel2.position.set(0, 11.4, -34);
      skyPanel2.lookAt(0, 0, -34);
      scene.add(skyPanel2);
      rectLights.push(skyPanel2);
    }

    const crimsonBeacon1 = new THREE.PointLight(0xdc2626, 24, 28, 1.65);
    crimsonBeacon1.position.set(-4.1, 4.1, -16);
    scene.add(crimsonBeacon1);

    const crimsonBeacon2 = new THREE.PointLight(0xef4444, 26, 32, 1.6);
    crimsonBeacon2.position.set(4.1, 4.1, -38);
    scene.add(crimsonBeacon2);

    const crimsonHorizonLight = new THREE.PointLight(0xb91c1c, 34, 42, 1.45);
    crimsonHorizonLight.position.set(0, 4.6, -64);
    scene.add(crimsonHorizonLight);

    const navyAtriumGlow = new THREE.PointLight(0x1e3a8a, 22, 38, 1.45);
    navyAtriumGlow.position.set(0, 8.2, -24);
    scene.add(navyAtriumGlow);

    // 1. Wet, mirror-puddled brutalist concrete floor
    const floorGeo = new THREE.PlaneGeometry(24, 118, 1, 1);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x121622),
      map: floorMaps.albedo,
      roughnessMap: floorMaps.roughness,
      bumpMap: floorMaps.bump,
      bumpScale: 0.028,
      roughness: 0.44,
      metalness: 0.14,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.45,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, 0, -36);
    floor.receiveShadow = true;
    scene.add(floor);

    // Brushed dark titanium material for recessed floor runner, pillar collars, & beacon housings
    const metalTrimMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x181e2b),
      roughness: 0.26,
      metalness: 0.88,
      anisotropy: isSoftwareGl ? 0 : 0.65,
      envMapIntensity: 1.35,
    });

    // Recessed central architectural drainage runner + dual flanking expansion rails
    const channelGeo = new THREE.BoxGeometry(0.46, 0.024, 114);
    const centerChannel = new THREE.Mesh(channelGeo, metalTrimMat);
    centerChannel.position.set(0, 0.012, -36);
    centerChannel.receiveShadow = true;
    scene.add(centerChannel);

    const trimRailGeo = new THREE.BoxGeometry(0.14, 0.24, 112);
    const leftFloorCurb = new THREE.Mesh(trimRailGeo, metalTrimMat);
    leftFloorCurb.position.set(-8.6, 0.12, -36);
    const rightFloorCurb = new THREE.Mesh(trimRailGeo, metalTrimMat);
    rightFloorCurb.position.set(8.6, 0.12, -36);
    scene.add(leftFloorCurb, rightFloorCurb);

    // Wall-mounted horizontal architectural conduit rails
    const wallConduitGeo = new THREE.BoxGeometry(0.16, 0.18, 112);
    const leftConduit = new THREE.Mesh(wallConduitGeo, metalTrimMat);
    leftConduit.position.set(-9.35, 1.35, -36);
    const rightConduit = new THREE.Mesh(wallConduitGeo, metalTrimMat);
    rightConduit.position.set(9.35, 1.35, -36);
    scene.add(leftConduit, rightConduit);

    // 2. Corridor walls with weathered concrete maps
    const wallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x131722),
      map: wallMaps.albedo,
      roughnessMap: wallMaps.roughness,
      bumpMap: wallMaps.bump,
      bumpScale: 0.042,
      roughness: 0.86,
      metalness: 0.08,
      envMapIntensity: 0.85,
    });

    const leftWallGeo = new THREE.PlaneGeometry(118, 15);
    leftWallGeo.rotateY(Math.PI / 2);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-9.5, 7.5, -36);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWallGeo = new THREE.PlaneGeometry(118, 15);
    rightWallGeo.rotateY(-Math.PI / 2);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
    rightWall.position.set(9.5, 7.5, -36);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Architectural bay components
    const ceilingSlabGeo = new THREE.BoxGeometry(20, 0.65, 5.2);
    const ceilingRibGeo = new THREE.BoxGeometry(19.2, 0.34, 0.36);
    const pillarGeo = new THREE.BoxGeometry(1.32, 13.4, 1.32);
    const lintelGeo = new THREE.BoxGeometry(18.6, 1.05, 1.24);
    const plinthGeo = new THREE.BoxGeometry(1.76, 0.54, 1.76);
    const baseCollarGeo = new THREE.BoxGeometry(1.88, 0.14, 1.88);
    const capitalGeo = new THREE.BoxGeometry(1.66, 0.42, 1.66);

    const beaconShroudGeo = new THREE.BoxGeometry(0.18, 3.92, 0.18);
    const beaconStripGeo = new THREE.BoxGeometry(0.09, 3.74, 0.09);

    const beaconRedMat = new THREE.MeshStandardMaterial({
      color: 0x2b0808,
      emissive: new THREE.Color(0xef4444),
      emissiveIntensity: 2.35,
      roughness: 0.25,
      metalness: 0.1,
    });
    const beaconCoolMat = new THREE.MeshStandardMaterial({
      color: 0x162032,
      emissive: new THREE.Color(0x64748b),
      emissiveIntensity: 1.1,
      roughness: 0.35,
      metalness: 0.15,
    });

    const baysGroup = new THREE.Group();
    const BAY_COUNT = isMobile ? 8 : 11;
    const BAY_SPACING = 8.2;

    for (let i = 0; i < BAY_COUNT; i++) {
      const z = 4 - i * BAY_SPACING;
      const bay = new THREE.Group();
      bay.position.set(0, 0, z);

      const leftPillar = new THREE.Mesh(pillarGeo, wallMat);
      leftPillar.position.set(-6.4, 6.7, 0);
      leftPillar.castShadow = true;
      leftPillar.receiveShadow = true;

      const rightPillar = new THREE.Mesh(pillarGeo, wallMat);
      rightPillar.position.set(6.4, 6.7, 0);
      rightPillar.castShadow = true;
      rightPillar.receiveShadow = true;

      const leftPlinth = new THREE.Mesh(plinthGeo, wallMat);
      leftPlinth.position.set(-6.4, 0.27, 0);
      const rightPlinth = new THREE.Mesh(plinthGeo, wallMat);
      rightPlinth.position.set(6.4, 0.27, 0);

      const leftBaseCollar = new THREE.Mesh(baseCollarGeo, metalTrimMat);
      leftBaseCollar.position.set(-6.4, 0.07, 0);
      const rightBaseCollar = new THREE.Mesh(baseCollarGeo, metalTrimMat);
      rightBaseCollar.position.set(6.4, 0.07, 0);

      const leftCapital = new THREE.Mesh(capitalGeo, wallMat);
      leftCapital.position.set(-6.4, 10.65, 0);
      const rightCapital = new THREE.Mesh(capitalGeo, wallMat);
      rightCapital.position.set(6.4, 10.65, 0);

      const lintel = new THREE.Mesh(lintelGeo, wallMat);
      lintel.position.set(0, 11.4, 0);
      lintel.castShadow = true;

      const ceilingSlab = new THREE.Mesh(ceilingSlabGeo, wallMat);
      ceilingSlab.position.set(0, 12.6, 0);

      const ceilingRib = new THREE.Mesh(ceilingRibGeo, metalTrimMat);
      ceilingRib.position.set(0, 12.1, 2.3);

      bay.add(
        leftPillar,
        rightPillar,
        leftPlinth,
        rightPlinth,
        leftBaseCollar,
        rightBaseCollar,
        leftCapital,
        rightCapital,
        lintel,
        ceilingSlab,
        ceilingRib
      );

      if (i === 2 || i === 5 || i === 8) {
        const shroudL = new THREE.Mesh(beaconShroudGeo, metalTrimMat);
        shroudL.position.set(-5.71, 3.1, 0.61);
        const stripL = new THREE.Mesh(beaconStripGeo, beaconRedMat);
        stripL.position.set(-5.66, 3.1, 0.67);

        const shroudR = new THREE.Mesh(beaconShroudGeo, metalTrimMat);
        shroudR.position.set(5.71, 3.1, 0.61);
        const stripR = new THREE.Mesh(beaconStripGeo, beaconRedMat);
        stripR.position.set(5.66, 3.1, 0.67);

        bay.add(shroudL, stripL, shroudR, stripR);
      } else if (i % 2 === 1) {
        const sideSign = i % 4 === 1 ? -1 : 1;
        const shroudC = new THREE.Mesh(beaconShroudGeo, metalTrimMat);
        shroudC.position.set(sideSign * 5.71, 4.2, 0.61);
        const coolStrip = new THREE.Mesh(beaconStripGeo, beaconCoolMat);
        coolStrip.position.set(sideSign * 5.66, 4.2, 0.67);
        bay.add(shroudC, coolStrip);
      }

      baysGroup.add(bay);
    }
    scene.add(baysGroup);

    // 3. Soft Volumetric Skylight Rays with multi-streak modulation
    const shaftGeo = new THREE.CylinderGeometry(1.3, 4.9, 15.5, 24, 1, true);
    const shaftMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewPos = -mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec3 viewDir = normalize(vViewPos);
          float edge = pow(abs(dot(viewDir, vNormal)), 2.05);
          float vFade = smoothstep(0.02, 0.28, vUv.y) * smoothstep(1.0, 0.14, vUv.y);
          float rays = 0.72 + 0.18 * sin(vUv.x * 18.8495 + uTime * 0.18) + 0.10 * cos(vUv.x * 31.4159 - uTime * 0.28);
          float breath = 0.86 + 0.14 * sin(uTime * 0.35 + vUv.y * 2.5);
          float alpha = edge * vFade * rays * breath * 0.082;
          vec3 col = mix(vec3(0.18, 0.25, 0.42), vec3(0.56, 0.68, 0.86), vUv.y);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const shaftsGroup = new THREE.Group();
    [-2, -18, -34, -50].forEach((zPos, idx) => {
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.position.set(idx % 2 === 0 ? 0.75 : -0.75, 6.85, zPos);
      shaft.rotation.z = idx % 2 === 0 ? -0.14 : 0.12;
      shaftsGroup.add(shaft);
    });
    scene.add(shaftsGroup);

    // 4. Low-lying slow drifting floor mist ribbons for layered atmospheric depth
    const mistGeo = new THREE.PlaneGeometry(17.5, 11);
    const mistMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float radial = exp(-dot(p * vec2(1.0, 1.15), p * vec2(1.0, 1.15)) * 2.4);
          float wave = 0.65 + 0.35 * sin(vUv.x * 6.283 + uTime * 0.22 + sin(vUv.y * 4.0));
          float bottomFade = smoothstep(0.0, 0.24, vUv.y) * smoothstep(1.0, 0.25, vUv.y);
          float alpha = radial * wave * bottomFade * 0.16;
          vec3 mistCol = mix(vec3(0.06, 0.09, 0.16), vec3(0.16, 0.06, 0.09), vUv.x * 0.35);
          gl_FragColor = vec4(mistCol, alpha);
        }
      `,
    });

    const mistGroup = new THREE.Group();
    const mistDepths = isMobile ? [-16, -38, -58] : [-12, -26, -42, -60];
    mistDepths.forEach((zPos, idx) => {
      const mistPlane = new THREE.Mesh(mistGeo, mistMat);
      mistPlane.position.set(idx % 2 === 0 ? -0.4 : 0.4, 2.1, zPos);
      mistGroup.add(mistPlane);
    });
    scene.add(mistGroup);

    // 5. Distant threshold architectural monolith & soft GLSL crimson-navy portal glow
    const farPortalGeo = new THREE.PlaneGeometry(11.5, 12.5);
    const farPortalMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 c = (vUv - vec2(0.5, 0.46)) * vec2(1.45, 1.0);
          float d = length(c);
          float core = exp(-d * d * 7.5);
          float halo = exp(-d * 3.1) * 0.65;
          float breath = 0.92 + 0.08 * sin(uTime * 0.6);
          vec3 crimson = vec3(0.86, 0.16, 0.16);
          vec3 navy = vec3(0.11, 0.20, 0.44);
          vec3 col = mix(navy, crimson, clamp(core * 1.4, 0.0, 1.0));
          float alpha = clamp((core * 0.52 + halo * 0.36) * breath, 0.0, 0.85);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const farPortal = new THREE.Mesh(farPortalGeo, farPortalMat);
    farPortal.position.set(0, 4.8, -76);
    scene.add(farPortal);

    // 6. Drifting atmospheric dust motes illuminated by skylight and crimson beacons
    const dustTex = createDustTexture();
    const dustRand = createSeededRandom(9921);
    const DUST_COUNT = isMobile ? 55 : 135;
    const dustGeo = new THREE.PlaneGeometry(0.095, 0.095);
    const dustMat = new THREE.MeshBasicMaterial({
      map: dustTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dustMesh = new THREE.InstancedMesh(dustGeo, dustMat, DUST_COUNT);
    dustMesh.frustumCulled = false;

    const dustParticles: {
      x: number;
      y: number;
      z: number;
      vy: number;
      phase: number;
      scale: number;
    }[] = [];

    for (let i = 0; i < DUST_COUNT; i++) {
      const x = (dustRand() - 0.5) * 11.2;
      const y = 0.35 + dustRand() * 9.8;
      const z = 6 - dustRand() * 70;
      const scale = 0.42 + dustRand() * 1.05;
      dustParticles.push({
        x,
        y,
        z,
        vy: 0.035 + dustRand() * 0.085,
        phase: dustRand() * Math.PI * 2,
        scale,
      });

      _dummy.position.set(x, y, z);
      _dummy.scale.setScalar(scale);
      _dummy.updateMatrix();
      dustMesh.setMatrixAt(i, _dummy.matrix);
      _colorTmp.setHex(i % 7 === 0 ? 0xf87171 : i % 3 === 0 ? 0x93c5fd : 0xcbd5e1);
      dustMesh.setColorAt(i, _colorTmp);
    }
    dustMesh.instanceMatrix.needsUpdate = true;
    if (dustMesh.instanceColor) dustMesh.instanceColor.needsUpdate = true;
    dustMesh.computeBoundingSphere();
    scene.add(dustMesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const pointer = { x: 0, y: 0 };
    let scrollProgress = 0;
    let elapsedTotal = 0;

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function updateScene(delta: number) {
      if (!pausedRef.current) {
        elapsedTotal += delta;
      }
      const t = elapsedTotal;

      shaftMat.uniforms.uTime.value = t;
      mistMat.uniforms.uTime.value = t;
      farPortalMat.uniforms.uTime.value = t;

      const targetZ = 8.2 - scrollProgress * 39.0;
      const targetX = pointer.x * 0.72 + Math.sin(t * 0.16) * 0.1;
      const targetY = 2.32 + pointer.y * 0.34 + Math.cos(t * 0.2) * 0.05;

      _targetCam.set(targetX, targetY, targetZ);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCam.x, 3.0, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCam.y, 3.0, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCam.z, 2.8, delta);

      _targetLook.set(pointer.x * 0.35, 2.48 + pointer.y * 0.25, camera.position.z - 22);
      camera.lookAt(_targetLook);

      crimsonBeacon1.intensity = 22 + Math.sin(t * 1.15) * 2.5;
      crimsonBeacon2.intensity = 24 + Math.cos(t * 0.95) * 2.5;

      for (let i = 0; i < DUST_COUNT; i++) {
        const d = dustParticles[i];
        if (!pausedRef.current) {
          d.y += d.vy * delta;
          if (d.y > 10.2) d.y = 0.35;
        }
        const dx = d.x + Math.sin(t * 0.32 + d.phase) * 0.2;
        _dummy.position.set(dx, d.y, d.z);
        _dummy.quaternion.copy(camera.quaternion);
        _dummy.scale.setScalar(d.scale);
        _dummy.updateMatrix();
        dustMesh.setMatrixAt(i, _dummy.matrix);
      }
      dustMesh.instanceMatrix.needsUpdate = true;
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      updateScene(delta);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    updateScene(0.016);
    renderer.render(scene, camera);
    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      floorGeo.dispose();
      floorMat.dispose();
      channelGeo.dispose();
      trimRailGeo.dispose();
      wallConduitGeo.dispose();
      metalTrimMat.dispose();
      leftWallGeo.dispose();
      rightWallGeo.dispose();
      wallMat.dispose();
      ceilingSlabGeo.dispose();
      ceilingRibGeo.dispose();
      pillarGeo.dispose();
      lintelGeo.dispose();
      plinthGeo.dispose();
      baseCollarGeo.dispose();
      capitalGeo.dispose();
      beaconShroudGeo.dispose();
      beaconStripGeo.dispose();
      beaconRedMat.dispose();
      beaconCoolMat.dispose();
      shaftGeo.dispose();
      shaftMat.dispose();
      mistGeo.dispose();
      mistMat.dispose();
      farPortalGeo.dispose();
      farPortalMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      dustTex.dispose();

      wallMaps.albedo.dispose();
      wallMaps.roughness.dispose();
      wallMaps.bump.dispose();
      floorMaps.albedo.dispose();
      floorMaps.roughness.dispose();
      floorMaps.bump.dispose();
      envTarget.dispose();
      rectLights.forEach((l) => l.dispose?.());

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (contextLost) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(148,163,184,0.14),transparent_52%),radial-gradient(ellipse_at_50%_75%,rgba(153,27,27,0.16),transparent_60%),linear-gradient(180deg,#050507_0%,#0a0e18_55%,#040406_100%)]"
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div ref={mountRef} className="h-full w-full" />
      <div className="film-grain-overlay pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_14%,rgba(5,5,8,0.72)_88%)]" />
    </div>
  );
}
