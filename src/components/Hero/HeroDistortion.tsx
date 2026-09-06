import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * A glass "lens" that drifts and follows the cursor, refracting the big
 * headline behind it — a WebGL take on the Spline distortion look.
 *
 * Rendered behind the real (crawlable) hero <h1>, so this is purely
 * decorative: the canvas is aria-hidden and never the source of truth
 * for the heading text.
 */

const LINES = ["AGENTIC", "AI SYSTEMS", "IN PRODUCTION"];

function Lens({ pointer }: { pointer: React.RefObject<THREE.Vector2> }) {
  const ref = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;

    // Target follows the pointer across the viewport, with a slow idle drift
    // so it never sits perfectly still.
    const t = state.clock.elapsedTime;
    const driftX = Math.sin(t * 0.35) * 1.4;
    const driftY = Math.cos(t * 0.27) * 0.8;

    const targetX = (pointer.current.x * viewport.width) / 2 + driftX;
    const targetY = (pointer.current.y * viewport.height) / 2 + driftY;

    // Ease toward the target — damp() gives frame-rate-independent smoothing.
    mesh.position.x = THREE.MathUtils.damp(mesh.position.x, targetX, 4, delta);
    mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, 4, delta);
    mesh.rotation.x = Math.sin(t * 0.5) * 0.25;
    mesh.rotation.y = Math.cos(t * 0.4) * 0.25;

    // Subtle breathing scale so the lens feels alive.
    const s = 1 + Math.sin(t * 0.6) * 0.08;
    mesh.scale.setScalar(s);
  });

  return (
    <mesh ref={ref} position={[0, 0, 2]}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <MeshTransmissionMaterial
        thickness={2.5}
        roughness={0}
        transmission={1}
        ior={1.6}
        chromaticAberration={0.9}
        anisotropy={0.4}
        distortion={1.2}
        distortionScale={0.6}
        temporalDistortion={0.35}
        backside
      />
    </mesh>
  );
}

function Scene({
  pointer,
  color,
}: {
  pointer: React.RefObject<THREE.Vector2>;
  color: string;
}) {
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <pointLight position={[-5, -2, 4]} intensity={1.2} />

      <group position={[0, 0, -0.5]}>
        {LINES.map((line, i) => (
          <Text
            key={line}
            font="https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff"
            fontSize={1.6}
            letterSpacing={-0.04}
            lineHeight={1}
            color={color}
            anchorX="center"
            anchorY="middle"
            position={[0, 1.9 - i * 1.9, 0]}
          >
            {line}
          </Text>
        ))}
      </group>

      <Lens pointer={pointer} />
    </>
  );
}

export default function HeroDistortion() {
  const pointer = useRef(new THREE.Vector2(0, 0));
  const [textColor, setTextColor] = useState("#111111");

  // Match the refracted text to the current theme.
  useEffect(() => {
    const resolve = () =>
      document.documentElement.dataset.theme === "dark"
        ? "#e8e8ee"
        : "#15151a";
    setTextColor(resolve());

    const observer = new MutationObserver(() => setTextColor(resolve()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    );
  };

  return (
    <div
      className="hero-distortion"
      aria-hidden="true"
      onPointerMove={onPointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene pointer={pointer} color={textColor} />
      </Canvas>
    </div>
  );
}
