'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points in a sphere
const generateParticles = (count: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 10 * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
};

const ParticleSystem = () => {
  const ref = useRef<THREE.Points>(null!);
  
  // Using useState to ensure we only generate positions once on mount
  const sphere = useRef(generateParticles(3000));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere.current} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#8b5cf6" // Subtle purple/slate tone
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
};

export function AntigravityBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
