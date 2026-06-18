"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref">;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Optimized sizing & density parameters
    const SEPARATION = 160;
    const AMOUNTX = 30; // Reduced from 40 for optimal performance
    const AMOUNTY = 45; // Reduced from 60 for optimal performance

    // 1. Scene & Fog Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf4f6fa, 1500, 6000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    camera.position.set(0, 360, 1100);

    // Renderer setup (clamped pixel ratio for performance on retina screens)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent background

    // Style the canvas to ensure correct absolute positioning inside the container
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";

    container.appendChild(renderer.domElement);

    // 2. Geometry creation
    const positions = new Float32Array(AMOUNTX * AMOUNTY * 3);
    const colors = new Float32Array(AMOUNTX * AMOUNTY * 3);

    // Brand colors mapping: Warm Terracotta (#C75B3A)
    const terracottaColor = new THREE.Color("#C75B3A");

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

        positions[i * 3] = x;
        positions[i * 3 + 1] = 0; // Will be animated on GPU
        positions[i * 3 + 2] = z;

        colors[i * 3] = terracottaColor.r;
        colors[i * 3 + 1] = terracottaColor.g;
        colors[i * 3 + 2] = terracottaColor.b;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 3. Custom Vertex Shader for GPU-based wave animation
    const vertexShader = `
      uniform float uTime;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec3 pos = position;
        
        // Compute waves in parallel on GPU using trigonometric functions
        float wave1 = sin(pos.x * 0.0025 + uTime * 0.8) * 45.0;
        float wave2 = cos(pos.z * 0.0035 + uTime * 0.6) * 40.0;
        pos.y = wave1 + wave2;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Attenuate dot size based on distance from camera
        gl_PointSize = 6.0 * (350.0 / -mvPosition.z);
      }
    `;

    // Custom Fragment Shader to render clean circular dots
    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        // Draw round particles instead of squares
        vec2 center = gl_PointCoord - vec2(0.5);
        if (length(center) > 0.5) discard;
        
        // Circular soft fall-off edge
        float strength = 1.0 - (length(center) * 2.0);
        gl_FragColor = vec4(vColor, strength * 0.22); // Subtle 22% opacity
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 4. Animation Loop & Lifecycle
    let animId = 0;
    const clock = new THREE.Clock();
    let isPageFocused = true;
    let isScrolledDeep = false;

    const tick = () => {
      animId = requestAnimationFrame(tick);

      // OPTIMIZATION: Only render if tab is focused and page is not scrolled deep
      if (!isPageFocused || isScrolledDeep) return;

      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;
      renderer.render(scene, camera);
    };

    // 5. Visibility and Scroll Listeners
    const handleScroll = () => {
      // Pause drawing if scrolled deep (e.g. past first viewport fold and solid panels cover backdrop)
      isScrolledDeep = window.scrollY > window.innerHeight * 1.2;
    };

    const handleFocus = () => {
      isPageFocused = true;
    };
    const handleBlur = () => {
      isPageFocused = false;
    };
    const handleVisibility = () => {
      isPageFocused = document.visibilityState === "visible";
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);

    // 6. Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Start loop
    tick();

    // Clean up
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 bg-transparent overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

export default DottedSurface;
