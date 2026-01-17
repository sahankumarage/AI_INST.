"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, ContactShadows, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function GeometricShape(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.1;
            meshRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <group {...props}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2, 0]} />
                {/* Glass-like material for ocean theme */}
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    roughness={0}
                    chromaticAberration={0.1}
                    anisotropy={0.1}
                    distortion={0.5}
                    distortionScale={0.5}
                    temporalDistortion={0.5}
                    color="#38bdf8"
                    background={new THREE.Color('#f0f9ff')}
                />
            </mesh>

            {/* Inner core */}
            <mesh scale={[0.5, 0.5, 0.5]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#0284c7" emissive="#0ea5e9" emissiveIntensity={0.5} />
            </mesh>
        </group>
    );
}

export function HeroModel() {
    return (
        <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-50 md:opacity-100">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#38bdf8" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0284c7" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <GeometricShape position={[3, 0, 0]} />
                </Float>


                <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} color="#0284c7" />
            </Canvas>
        </div>
    );
}
