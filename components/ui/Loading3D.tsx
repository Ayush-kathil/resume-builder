'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

function RotatingCore() {
  const meshRef = useRef<Mesh>(null!);
  const outerRef = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    // Inner core rotation
    meshRef.current.rotation.x += delta * 1.2;
    meshRef.current.rotation.y += delta * 1.5;
    
    // Outer wireframe rotation
    outerRef.current.rotation.x -= delta * 0.5;
    outerRef.current.rotation.y -= delta * 0.8;
  });

  return (
    <group>
      {/* Inner solid core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#ffffff"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Outer wireframe */}
      <mesh ref={outerRef} scale={1.4}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          wireframe 
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

export function Loading3D() {
  return (
    <div className="w-32 h-32 mb-6">
      <Canvas camera={{ position: [0, 0, 4.5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
        <RotatingCore />
      </Canvas>
    </div>
  );
}
