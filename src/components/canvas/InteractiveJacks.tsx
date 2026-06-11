import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface JackData {
  id: number;
  basePosition: THREE.Vector3;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotSpeed: THREE.Vector3;
  color: string;
  scale: number;
  roughness: number;
  metalness: number;
}

function JackMesh({ data }: { data: JackData }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // 1. Natural slow spin
    meshRef.current.rotation.x += data.rotSpeed.x;
    meshRef.current.rotation.y += data.rotSpeed.y;
    meshRef.current.rotation.z += data.rotSpeed.z;

    // 2. Translate mouse pointer from normalized coordinates (-1 to 1) to rough aspect units
    const mouseX = state.pointer.x * 6;
    const mouseY = state.pointer.y * 4;

    const dx = data.position.x - mouseX;
    const dy = data.position.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Mouse repulsion force
    let forceX = 0;
    let forceY = 0;
    const maxRadius = 3.2;

    if (distance < maxRadius) {
      const strength = (maxRadius - distance) / maxRadius; // 0 to 1
      forceX = (dx / (distance || 0.01)) * strength * 0.35;
      forceY = (dy / (distance || 0.01)) * strength * 0.35;
    }

    // Spring force back to base position
    const springX = (data.basePosition.x - data.position.x) * 0.025;
    const springY = (data.basePosition.y - data.position.y) * 0.025;

    data.velocity.x += springX + forceX;
    data.velocity.y += springY + forceY;

    // Friction dampening
    data.velocity.x *= 0.9;
    data.velocity.y *= 0.9;

    data.position.x += data.velocity.x;
    data.position.y += data.velocity.y;

    meshRef.current.position.copy(data.position);
  });

  const color = data.color;

  return (
    <group
      ref={meshRef}
      position={data.position.toArray()}
      scale={[data.scale, data.scale, data.scale]}
    >
      {/* X Cylinder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color={color} roughness={data.roughness} metalness={data.metalness} />
      </mesh>
      {/* Y Cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color={color} roughness={data.roughness} metalness={data.metalness} />
      </mesh>
      {/* Z Cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color={color} roughness={data.roughness} metalness={data.metalness} />
      </mesh>

      {/* Rounded spherical knobs at cylinder ends */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} roughness={data.roughness} metalness={data.metalness} />
      </mesh>
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} roughness={data.roughness} metalness={data.metalness} />
      </mesh>
      <mesh position={[0.4, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} roughness={data.roughness} metalness={data.metalness} />
      </mesh>
      <mesh position={[-0.4, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} roughness={data.roughness} metalness={data.metalness} />
      </mesh>
      <mesh position={[0, 0, 0.4]} castShadow receiveShadow>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} roughness={data.roughness} metalness={data.metalness} />
      </mesh>
      <mesh position={[0, 0, -0.4]} castShadow receiveShadow>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} roughness={data.roughness} metalness={data.metalness} />
      </mesh>
    </group>
  );
}

function Scene({ count }: { count: number }) {
  const jacks = useMemo(() => {
    const arr: JackData[] = [];
    const colors = ["#ffffff", "#002df2", "#111111", "#1a5b5c", "#e03d67"];

    for (let i = 0; i < count; i++) {
      // Position jacks in a grid-like cloud
      const basePosition = new THREE.Vector3(
        (Math.random() - 0.5) * 8.5,
        (Math.random() - 0.5) * 5.5,
        (Math.random() - 0.5) * 2.5,
      );

      // Select colors based on user's references: White, Electric Blue, Shiny Black, accents of Pink/Teal
      let color = colors[0];
      const rand = Math.random();
      if (rand < 0.3) {
        color = "#ffffff"; // glossy white
      } else if (rand < 0.6) {
        color = "#0a2df2"; // glossy electric blue
      } else if (rand < 0.8) {
        color = "#0a0a0a"; // shiny pitch black
      } else if (rand < 0.9) {
        color = "#e03d67"; // brand lipstick crimson
      } else {
        color = "#1a5b5c"; // brand teal
      }

      arr.push({
        id: i,
        basePosition,
        position: basePosition
          .clone()
          .add(new THREE.Vector3((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, 0)),
        velocity: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
        ),
        color,
        scale: Math.random() * 0.7 + 0.6,
        roughness: 0.08,
        metalness: color === "#ffffff" ? 0.1 : 0.85, // reflective metallic properties
      });
    }
    return arr;
  }, [count]);

  return (
    <>
      {jacks.map((jack) => (
        <JackMesh key={jack.id} data={jack} />
      ))}
    </>
  );
}

export function InteractiveJacks() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-transparent z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} style={{ pointerEvents: "auto" }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 6, 4]} intensity={1.5} />
        <pointLight position={[-6, -6, -2]} intensity={0.4} />
        <Scene count={18} />
      </Canvas>
    </div>
  );
}

export default InteractiveJacks;
