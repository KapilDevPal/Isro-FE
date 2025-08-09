'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function RocketModel() {
  const rocketRef = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (rocketRef.current) {
      rocketRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (engineRef.current) {
      engineRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group ref={rocketRef}>
      {/* Rocket Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Rocket Nose Cone */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Rocket Fins */}
      <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.8, 1.5]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, -1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 0.8, 1.5]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>

      {/* Engine */}
      <mesh ref={engineRef} position={[0, -2.5, 0]}>
        <cylinderGeometry args={[0.6, 0.5, 0.5, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Engine Exhaust */}
      <mesh position={[0, -3, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 0.5, 8]} />
        <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={0.5} />
      </mesh>

      {/* Rocket Label */}
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.3}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        SPACE EXPLORER
      </Text>
    </group>
  );
}

interface Rocket3DProps {
  className?: string;
}

export default function Rocket3D({ className = '' }: Rocket3DProps) {
  return (
    <div className={`w-full h-64 ${className}`}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <RocketModel />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
} 