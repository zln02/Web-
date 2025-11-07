import { particlesCursor } from './lib/threejs-toys.module.min.js'; 
// (CDN 버전 쓰고 싶다면 위 줄 대신 아래 줄 사용)
// import { particlesCursor } from 'https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js';

const pc = particlesCursor({
  el: document.getElementById('app'),
  gpgpuSize: 512,
  colors: [0x00ffff, 0x0080ff],
  color: 0xffffff,
  coordScale: 0.6,
  noiseIntensity: 0.001,
  noiseTimeCoef: 0.0001,
  pointSize: 6,
  pointDecay: 0.0025,
  sleepRadiusX: 250,
  sleepRadiusY: 250,
  sleepTimeCoefX: 0.001,
  sleepTimeCoefY: 0.002
});

document.body.addEventListener('click', () => {
  pc.uniforms.uColor.value.set(Math.random() * 0xffffff);
  pc.uniforms.uCoordScale.value = 0.001 + Math.random() * 2;
  pc.uniforms.uNoiseIntensity.value = 0.0001 + Math.random() * 0.001;
  pc.uniforms.uPointSize.value = 2 + Math.random() * 8;
});
