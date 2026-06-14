/**
 * Capa de "motas de luz" sobre el hero, con WebGPU + TSL.
 *
 * Partículas cálidas y tenues que ascienden con un leve vaivén — luciérnagas /
 * polvo de luz suspendido sobre el bosque. Atmósfera, no protagonismo. Va
 * confinada al <canvas> del hero. Si WebGPU no existe, lanza error y el hero
 * se ve perfecto solo con la fotografía.
 *
 * Patrón de compute basado en el ejemplo webgpu_compute_particles de Three.js (MIT).
 */

import * as THREE from 'three/webgpu';
import {
  Fn,
  uniform,
  float,
  vec4,
  color,
  uv,
  hash,
  time,
  instancedArray,
  instanceIndex,
} from 'three/tsl';

const PARTICLE_COUNT = 520;
const FIELD_W = 30;
const FIELD_H = 18;
const FIELD_D = 8;

export async function initParticles(canvas) {
  if (!navigator.gpu) throw new Error('navigator.gpu ausente');
  if (!canvas) throw new Error('canvas no encontrado');

  const sizeOf = () => {
    const r = canvas.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  };

  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, alpha: true });
  let { w, h } = sizeOf();
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  await renderer.init();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
  camera.position.set(0, 0, 20);

  const positions = instancedArray(PARTICLE_COUNT, 'vec3');
  const seeds = instancedArray(PARTICLE_COUNT, 'vec3'); // x: velocidad, y: fase, z: tamaño/brillo

  const computeInit = Fn(() => {
    const pos = positions.element(instanceIndex);
    const seed = seeds.element(instanceIndex);

    pos.x.assign(hash(instanceIndex.add(11)).sub(0.5).mul(FIELD_W));
    pos.y.assign(hash(instanceIndex.add(29)).sub(0.5).mul(FIELD_H));
    pos.z.assign(hash(instanceIndex.add(53)).sub(0.5).mul(FIELD_D));

    seed.x.assign(hash(instanceIndex.add(71)).mul(0.28).add(0.08));
    seed.y.assign(hash(instanceIndex.add(97)).mul(6.2832));
    seed.z.assign(hash(instanceIndex.add(131)).mul(0.7).add(0.4));
  })().compute(PARTICLE_COUNT);

  await renderer.computeAsync(computeInit);

  const computeUpdate = Fn(() => {
    const pos = positions.element(instanceIndex);
    const seed = seeds.element(instanceIndex);
    const t = time;

    pos.y.addAssign(seed.x.mul(0.012));
    pos.x.addAssign(t.add(seed.y).sin().mul(0.005));
    pos.z.addAssign(t.mul(0.6).add(seed.y).cos().mul(0.003));

    const top = float(FIELD_H * 0.5);
    pos.y.assign(pos.y.greaterThan(top).select(float(FIELD_H * -0.5), pos.y));
  })().compute(PARTICLE_COUNT);

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.SpriteNodeMaterial();
  material.transparent = true;
  material.depthWrite = false;
  material.blending = THREE.AdditiveBlending;
  material.positionNode = positions.element(instanceIndex);
  material.scaleNode = seeds.element(instanceIndex).z.mul(0.12);

  // brillo cálido con caída radial muy suave (cremoso, no dorado chillón)
  material.colorNode = Fn(() => {
    const d = uv().sub(0.5).length();
    const glow = float(0.5).sub(d).mul(2.0).clamp(0.0, 1.0);
    const a = glow.mul(glow);
    const tone = color(0xc8b27a).mix(color(0xf6efdc), glow);
    return vec4(tone, a.mul(0.6));
  })();

  const mesh = new THREE.InstancedMesh(geometry, material, PARTICLE_COUNT);
  mesh.frustumCulled = false;
  scene.add(mesh);

  function onResize() {
    ({ w, h } = sizeOf());
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', onResize);

  renderer.setAnimationLoop(() => {
    renderer.compute(computeUpdate);
    renderer.render(scene, camera);
  });

  return renderer;
}
