import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";

interface SphereItem {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  rotation: THREE.Euler;
  rotSpeed: THREE.Vector3;
  textureIndex: number;
}

const IMAGE_URLS = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];

function PhysicsSpheres({
  spheres,
  textures,
}: {
  spheres: SphereItem[];
  textures: THREE.Texture[];
}) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    const dt = Math.min(0.03, delta);
    const count = spheres.length;

    // 1. Apply forces (center gravity pull and cursor repulsion)
    for (let i = 0; i < count; i++) {
      const b = spheres[i];

      // Gravity pull to center coordinates (0, 0, 0) - gentler pull
      b.velocity.x -= b.position.x * 0.022 * dt * 60;
      b.velocity.y -= b.position.y * 0.022 * dt * 60;
      b.velocity.z -= b.position.z * 0.022 * dt * 60;

      // Translate 2D pointer coordinates (-1 to 1) to approximate 3D aspect bounds
      const mouseX = state.pointer.x * (state.viewport.width / 2) * 1.1;
      const mouseY = state.pointer.y * (state.viewport.height / 2) * 1.1;

      const dx = b.position.x - mouseX;
      const dy = b.position.y - mouseY;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);

      // Repulsion radius of 2.5 units
      const repulsionRadius = 2.5;
      if (distToMouse < repulsionRadius) {
        const strength = (repulsionRadius - distToMouse) / repulsionRadius;
        const pushForce = strength * 0.45; // reduced repulsion strength
        b.velocity.x += (dx / (distToMouse || 0.01)) * pushForce * dt * 45; // reduced speed
        b.velocity.y += (dy / (distToMouse || 0.01)) * pushForce * dt * 45;
        b.velocity.z += (Math.random() - 0.5) * pushForce * dt * 10;
      }

      // Add small ambient drift
      b.velocity.x += (Math.random() - 0.5) * 0.08 * dt * 60;
      b.velocity.y += (Math.random() - 0.5) * 0.08 * dt * 60;
      b.velocity.z += (Math.random() - 0.5) * 0.08 * dt * 60;
    }

    // 2. Resolve sphere-to-sphere collision overlaps (Elastic Impulse Solver)
    for (let i = 0; i < count; i++) {
      const b1 = spheres[i];
      for (let j = i + 1; j < count; j++) {
        const b2 = spheres[j];

        const dx = b2.position.x - b1.position.x;
        const dy = b2.position.y - b1.position.y;
        const dz = b2.position.z - b1.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const minDistance = (b1.scale + b2.scale) * 0.95; // allow minimal overlap for realistic clumping

        if (distance < minDistance) {
          const overlap = minDistance - distance;

          // Normal direction vector
          const nx = dx / (distance || 0.01);
          const ny = dy / (distance || 0.01);
          const nz = dz / (distance || 0.01);

          // Displace positions to push apart (50% each)
          const pushX = nx * overlap * 0.5;
          const pushY = ny * overlap * 0.5;
          const pushZ = nz * overlap * 0.5;

          b1.position.x -= pushX;
          b1.position.y -= pushY;
          b1.position.z -= pushZ;

          b2.position.x += pushX;
          b2.position.y += pushY;
          b2.position.z += pushZ;

          // Velocity rebound exchange
          const bounce = 0.5;
          b1.velocity.x -= pushX * bounce;
          b1.velocity.y -= pushY * bounce;
          b1.velocity.z -= pushZ * bounce;

          b2.velocity.x += pushX * bounce;
          b2.velocity.y += pushY * bounce;
          b2.velocity.z += pushZ * bounce;
        }
      }
    }

    // 3. Apply friction and update coordinates
    for (let i = 0; i < count; i++) {
      const b = spheres[i];
      b.velocity.x *= 0.88;
      b.velocity.y *= 0.88;
      b.velocity.z *= 0.88;

      b.position.x += b.velocity.x;
      b.position.y += b.velocity.y;
      b.position.z += b.velocity.z;

      // Update rotation
      b.rotation.x += b.rotSpeed.x;
      b.rotation.y += b.rotSpeed.y;
      b.rotation.z += b.rotSpeed.z;

      // Update mesh transforms
      const ref = meshRefs.current[i];
      if (ref) {
        ref.position.copy(b.position);
        ref.rotation.copy(b.rotation);
      }
    }
  });

  return (
    <>
      {spheres.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          scale={[s.scale, s.scale, s.scale]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1, 32, 32]} />
          {/* Glossy physical material with the preloaded logo texture map */}
          <meshPhysicalMaterial
            map={textures[s.textureIndex]}
            emissive="#ffffff"
            emissiveMap={textures[s.textureIndex]}
            emissiveIntensity={0.25}
            roughness={0.12}
            metalness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>
      ))}
    </>
  );
}

function Scene() {
  const textures = useTexture(IMAGE_URLS);

  // Initialize sphere physics data
  const spheres = useMemo(() => {
    const arr: SphereItem[] = [];
    const count = 20;

    for (let i = 0; i < count; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 4.5,
          (Math.random() - 0.5) * 4.5,
          (Math.random() - 0.5) * 2.0,
        ),
        velocity: new THREE.Vector3(0, 0, 0),
        scale: Math.random() * 0.18 + 0.45, // scale range 0.45 to 0.63
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
        ),
        textureIndex: i % IMAGE_URLS.length, // cycle through images
      });
    }
    return arr;
  }, []);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 8, 5]} intensity={1.5} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} />

      <PhysicsSpheres spheres={spheres} textures={textures} />

      {/* Add soft environment reflection details */}
      <Environment preset="studio" environmentIntensity={0.6} />
    </>
  );
}

export function TechStackCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-transparent z-0">
      <Canvas camera={{ position: [0, 0, 6.0], fov: 45 }} style={{ pointerEvents: "auto" }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default TechStackCanvas;
