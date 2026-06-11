import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 3D Simplex noise shader source code
const vertexShader = `
  uniform float uTime;
  uniform float uNoiseSpeed;
  uniform float uNoiseStrength;
  uniform float uNoiseFrequency;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Ashima Arts Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Evaluate noise based coordinates to displace along normals
    vec3 noiseCoords = position * uNoiseFrequency + vec3(0.0, uTime * uNoiseSpeed, 0.0);
    float displacement = snoise(noiseCoords) * uNoiseStrength;
    
    vec3 displacedPosition = position + normal * displacement;
    vPosition = displacedPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;

  void main() {
    vec3 normal = normalize(vNormal);
    
    // Fresnel glow effect
    float fresnel = dot(normal, vec3(0.0, 0.0, 1.0));
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 2.8);

    // Solid vibrant color (no mix / no gradient)
    vec3 baseColor = uColor1;

    // Monochromatic specular shimmer
    float spec = dot(normal, normalize(vec3(1.0, 1.0, 2.0)));
    spec = max(0.0, spec);
    spec = pow(spec, 40.0);

    vec3 finalColor = baseColor + vec3(spec * 0.35);

    gl_FragColor = vec4(finalColor, 0.9);
  }
`;

function BlobMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Set premium cosmetics colors: vibrant lipstick crimson
  const color1 = useMemo(() => new THREE.Color("#e03d67"), []);
  const color2 = useMemo(() => new THREE.Color("#e03d67"), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseSpeed: { value: 0.45 },
      uNoiseStrength: { value: 0.25 },
      uNoiseFrequency: { value: 1.2 },
      uColor1: { value: color1 },
      uColor2: { value: color2 },
    }),
    [color1, color2],
  );

  useFrame((state) => {
    // Skip calculations if scrolled out of the hero view (conserves GPU cycles)
    if (typeof window !== "undefined" && window.scrollY > window.innerHeight) {
      return;
    }

    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }

    if (meshRef.current) {
      // Slow rotation for natural organic behavior
      meshRef.current.rotation.x = time * 0.08;
      meshRef.current.rotation.y = time * 0.12;

      // Mouse drag fluid movement (interpolate current position to normalized mouse pointers)
      meshRef.current.position.x += (state.pointer.x * 2.2 - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (state.pointer.y * 2.2 - meshRef.current.position.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[1.8, 1.8, 1.8]}>
      {/* Optimized sphere segments for high performance */}
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export function MorphingBlob() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} style={{ pointerEvents: "none" }}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <BlobMesh />
      </Canvas>
    </div>
  );
}

export default MorphingBlob;
