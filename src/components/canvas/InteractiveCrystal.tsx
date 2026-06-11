import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";

interface CrystalProps {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
}

function SingleCrystal({ position, scale, rotation }: CrystalProps) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* 1. Inner Glowing Energy Core: shines through the outer translucent body */}
      <mesh scale={[0.55, 0.65, 0.55]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#6fffe9" // Neon Ice core
          toneMapped={false}
        />
      </mesh>

      {/* 2. Outer Translucent Faceted Glass Crust: flat shaded to capture reflections */}
      <mesh castShadow receiveShadow>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#0b132b" // Prussian Blue base
          emissive="#5bc0be" // Tropical Teal secondary glow
          emissiveIntensity={1.5}
          roughness={0.05} // Highly polished
          metalness={0.35}
          transmission={0.45} // Semi-transparent to reveal internal core
          thickness={1.2}
          ior={1.9} // High index of refraction for intense light bending
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          flatShading={true} // Emphasizes sharp crystal edges
        />
      </mesh>

      {/* 3. Glowing Edge Highlights: precise wireframe outline overlay */}
      <mesh scale={[1.01, 1.01, 1.01]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#6fffe9" // Vibrant Neon Ice highlight
          wireframe
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function CrystalCluster() {
  const groupRef = useRef<THREE.Group>(null);
  const introTime = useRef(0);
  const INTRO_DURATION = 2.8; // 2.8 seconds cinematic entry

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Accumulate entry progress time
    if (introTime.current < INTRO_DURATION) {
      introTime.current += delta;
    }

    const progress = Math.min(1, introTime.current / INTRO_DURATION);
    // Smooth ease-out cubic curve (deceleration)
    const t = 1 - Math.pow(1 - progress, 3);

    const time = state.clock.getElapsedTime();

    // 1. Position: Coming from above to bottom, moving right to left
    // Start: X=3.5, Y=4.5, Z=-2.0
    // End: X=0.0, Y=0.0, Z=0.0
    const baseX = THREE.MathUtils.lerp(3.5, 0, t);
    const baseY = THREE.MathUtils.lerp(4.5, 0, t);
    const baseZ = THREE.MathUtils.lerp(-2.0, 0, t);

    groupRef.current.position.x = baseX;
    groupRef.current.position.y = baseY + Math.sin(time * 0.5) * 0.15; // float bobbing
    groupRef.current.position.z = baseZ;

    // 2. Rotation: 360 degree spin on Y axis
    // Extra intro rotation drops from 360 degrees (2 * Math.PI) to 0
    const baseRotY = time * 0.12;
    const introRotY = (1 - t) * Math.PI * 2;
    groupRef.current.rotation.y = baseRotY + introRotY;

    // 3. Tilt: Mouse-interactive rotation + initial cinematic pitch/roll tumble
    const targetRotX = state.pointer.y * 0.4;
    const targetRotY = state.pointer.x * 0.4;

    const currentMouseRotX = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    const currentMouseRotZ = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -targetRotY * 0.4,
      0.05,
    );

    // Initial tumble on X and Z axes (fade out as t approaches 1)
    const introRotX = (1 - t) * Math.PI * 1.2;
    const introRotZ = -(1 - t) * Math.PI * 0.8;

    groupRef.current.rotation.x = currentMouseRotX + introRotX;
    groupRef.current.rotation.z = currentMouseRotZ + introRotZ;
  });

  return (
    <group ref={groupRef}>
      {/* Central main tall crystal */}
      <SingleCrystal position={[0, 0.1, 0]} scale={[0.85, 2.3, 0.85]} rotation={[0, 0, 0]} />

      {/* Left leaning crystal */}
      <SingleCrystal
        position={[-0.65, -0.4, 0.2]}
        scale={[0.55, 1.4, 0.55]}
        rotation={[0.2, 0.1, 0.35]}
      />

      {/* Right leaning crystal */}
      <SingleCrystal
        position={[0.6, -0.5, -0.15]}
        scale={[0.48, 1.25, 0.48]}
        rotation={[-0.15, -0.2, -0.3]}
      />
    </group>
  );
}

export function InteractiveCrystal() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-transparent z-0">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} style={{ pointerEvents: "auto" }}>
        <ambientLight intensity={0.5} />

        {/* Cinematic light setup to create high contrast highlights & deep shadows */}
        {/* 1. Strong spotlight from top-right for specular highlights */}
        <spotLight
          position={[5, 8, 5]}
          angle={0.4}
          penumbra={1}
          intensity={12}
          color="#6fffe9" // Neon Ice key light
          castShadow
        />

        {/* 2. Strong directional rim light from top-left-back to wrap glass contours */}
        <directionalLight
          position={[-5, 5, -5]}
          intensity={8}
          color="#5bc0be" // Tropical Teal rim light
        />

        {/* 3. Deep fill light from bottom-left to keep shadow details rich & colored */}
        <directionalLight
          position={[-5, -3, 3]}
          intensity={4}
          color="#1c2541" // Space Indigo fill light
        />

        {/* 4. Core point light inside the crystal cluster space */}
        <pointLight position={[0, -1, 1]} color="#6fffe9" intensity={6} />

        <CrystalCluster />

        {/* Ambient floating neon sparkles */}
        <Sparkles count={75} scale={5.0} size={2.5} speed={0.2} color="#6fffe9" opacity={0.7} />

        {/* Studio reflections */}
        <Environment preset="studio" environmentIntensity={1.0} />
      </Canvas>
    </div>
  );
}

export default InteractiveCrystal;
