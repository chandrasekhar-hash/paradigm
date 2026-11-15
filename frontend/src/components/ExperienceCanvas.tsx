import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sparkles } from "@react-three/drei";
import {
  Component,
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

type ProgressRef = MutableRefObject<{ value: number }>;

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function useNearViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "300px 0px",
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Sculpture({
  progress,
  reduced,
  compact,
}: {
  progress: ProgressRef;
  reduced: boolean;
  compact: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }, delta) => {
    if (!group.current || !inner.current) return;
    if (reduced) return;
    const p = progress.current.value;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      p * Math.PI * 1.35 + pointer.x * 0.18,
      3.2,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -0.18 + p * 0.55 + pointer.y * 0.12,
      3.2,
      delta,
    );

    const initialX = compact ? 1.20 : 1.15;
    const initialY = compact ? 0.15 : -0.1;
    const shiftX = compact ? 0.05 : 1.9;
    const shiftY = compact ? 0.45 : 0.65;
    const baseScale = compact ? 0.82 : 1;
    const scaleDec = compact ? 0.22 : 0.28;

    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      initialX - p * shiftX,
      2.5,
      delta,
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      initialY + p * shiftY,
      2.5,
      delta,
    );
    const scale = baseScale - p * scaleDec;
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, scale, 2.5, delta));
    inner.current.rotation.z = clock.elapsedTime * 0.08;
  });

  return (
    <group ref={group} position={[compact ? 1.20 : 1.15, compact ? 0.15 : -0.1, 0]}>
      <group ref={inner} rotation={[0.2, -0.3, -0.35]}>
        <Float
          speed={reduced ? 0 : 1.1}
          rotationIntensity={reduced ? 0 : 0.18}
          floatIntensity={reduced ? 0 : 0.25}
        >
          <mesh castShadow>
            <torusKnotGeometry args={[1.45, 0.42, 220, 32, 2, 3]} />
            <meshStandardMaterial
              color="#bfc7ca"
              metalness={1}
              roughness={0.14}
              envMapIntensity={1.5}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0.3, 0]} scale={1.18}>
            <torusGeometry args={[1.8, 0.018, 10, 180]} />
            <meshBasicMaterial color="#c6ff4d" toneMapped={false} />
          </mesh>
          <mesh rotation={[0.35, 0.1, Math.PI / 2.2]} scale={1.25}>
            <torusGeometry args={[1.8, 0.012, 8, 180]} />
            <meshBasicMaterial color="#aab4ba" transparent opacity={0.5} />
          </mesh>
          <mesh position={[1.5, 1.05, 0.35]}>
            <icosahedronGeometry args={[0.22, 4]} />
            <meshStandardMaterial
              color="#c6ff4d"
              emissive="#526d12"
              emissiveIntensity={1.4}
              roughness={0.22}
            />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

function HeroScene({
  progress,
  reduced,
  compact,
}: {
  progress: ProgressRef;
  reduced: boolean;
  compact: boolean;
}) {
  useFrame(({ camera, pointer }, delta) => {
    if (reduced) return;
    const p = progress.current.value;
    const targetZ = compact ? 7.6 : 7.2;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      (compact ? p * 0.12 : p * 0.65) + pointer.x * 0.1,
      2.2,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      (compact ? p * 0.15 : p * 0.22) + pointer.y * 0.07,
      2.2,
      delta,
    );
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ - p * 1.05, 2.2, delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#080b0f"]} />
      <fog attach="fog" args={["#080b0f", 7, 15]} />
      <ambientLight intensity={0.24} />
      <spotLight
        position={[4, 6, 5]}
        intensity={90}
        angle={0.42}
        penumbra={0.8}
        color="#f4f5f6"
        castShadow
      />
      <pointLight position={[-4, -1, 3]} intensity={18} color="#5b8cff" />
      <pointLight position={[3, -3, 1]} intensity={12} color="#c6ff4d" />
      <mesh receiveShadow position={[0, -2.45, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
      <Sculpture progress={progress} reduced={reduced} compact={compact} />
      <Sparkles
        count={compact ? 34 : 80}
        scale={[10, 7, 5]}
        size={1.2}
        speed={reduced ? 0 : 0.2}
        opacity={0.65}
        color="#dbe2e4"
      />
      <Sparkles
        count={compact ? 10 : 24}
        scale={[8, 5, 3]}
        size={2}
        speed={reduced ? 0 : 0.12}
        opacity={0.55}
        color="#c6ff4d"
      />
    </>
  );
}

const nodePositions: [number, number, number][] = [
  [-2.8, 1.25, 0.2],
  [-1.4, 2.05, -1.2],
  [0, 0.8, 0.7],
  [2.25, 1.75, -0.8],
  [2.8, -0.35, 0.35],
  [1.55, -1.8, -0.6],
  [-0.45, -2.1, 0.8],
  [-2.4, -1.25, -0.5],
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  [0, 2],
  [1, 6],
  [2, 5],
  [3, 7],
  [4, 1],
  [6, 0],
];

function Network({ progress, reduced }: { progress: ProgressRef; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const particleGroup = useRef<THREE.Group>(null);
  const particlePaths = useMemo(
    () => Array.from({ length: 18 }, (_, index) => links[index % links.length]),
    [],
  );

  useFrame(({ pointer, clock }, delta) => {
    if (!group.current || !particleGroup.current) return;
    if (reduced) return;
    const p = progress.current.value;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      p * 1.2 + pointer.x * 0.12,
      2,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -0.12 + pointer.y * 0.08,
      2,
      delta,
    );
    const scale = 0.75 + p * 0.35;
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, scale, 2, delta));

    particleGroup.current.children.forEach((particle, index) => {
      const [a, b] = particlePaths[index];
      const start = nodePositions[a];
      const end = nodePositions[b];
      const t = (clock.elapsedTime * (0.1 + (index % 4) * 0.018) + index * 0.17) % 1;
      particle.position.set(
        THREE.MathUtils.lerp(start[0], end[0], t),
        THREE.MathUtils.lerp(start[1], end[1], t),
        THREE.MathUtils.lerp(start[2], end[2], t),
      );
    });
  });

  return (
    <group ref={group} scale={0.75}>
      {links.map(([a, b], index) => (
        <Line
          key={`${a}-${b}-${index}`}
          points={[nodePositions[a], nodePositions[b]]}
          color={index % 4 === 0 ? "#c6ff4d" : "#45525c"}
          lineWidth={index % 4 === 0 ? 0.8 : 0.45}
          transparent
          opacity={index % 4 === 0 ? 0.7 : 0.45}
        />
      ))}
      {nodePositions.map((position, index) => (
        <Float
          key={index}
          speed={reduced ? 0 : 0.5 + index * 0.05}
          floatIntensity={reduced ? 0 : 0.12}
        >
          <mesh position={position}>
            {index === 2 ? (
              <icosahedronGeometry args={[0.3, 2]} />
            ) : (
              <sphereGeometry args={[0.1 + (index % 3) * 0.035, 20, 20]} />
            )}
            <meshStandardMaterial
              color={index === 2 ? "#f4f5f6" : "#c6ff4d"}
              emissive={index === 2 ? "#5b8cff" : "#435d0b"}
              emissiveIntensity={index === 2 ? 1.2 : 0.8}
              metalness={0.55}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
      <group ref={particleGroup}>
        {particlePaths.map((_, index) => (
          <mesh key={index}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#f4f5f6" : "#c6ff4d"} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function NetworkScene({
  progress,
  reduced,
  compact,
}: {
  progress: ProgressRef;
  reduced: boolean;
  compact: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#0b1015"]} />
      <fog attach="fog" args={["#0b1015", 7, 14]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 4, 5]} intensity={35} color="#f4f5f6" />
      <pointLight position={[-4, -2, 2]} intensity={16} color="#5b8cff" />
      <Network progress={progress} reduced={reduced} />
      <Sparkles
        count={compact ? 16 : 34}
        scale={[7, 5, 4]}
        size={0.8}
        speed={reduced ? 0 : 0.15}
        color="#929ba5"
      />
    </>
  );
}

function Fallback({ kind }: { kind: "hero" | "network" }) {
  return (
    <div
      className={`webgl-fallback fallback-${kind}`}
      role="img"
      aria-label={`${kind} abstract fallback artwork`}
    >
      <i />
      <i />
      <i />
      <span className="mono">STATIC MODE / WEBGL UNAVAILABLE</span>
    </div>
  );
}

export function HeroCanvas({ progress }: { progress: ProgressRef }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compact = window.matchMedia("(max-width: 767px)").matches;
  useEffect(() => setSupported(canUseWebGL()), []);
  if (supported === false) return <Fallback kind="hero" />;
  if (supported === null) return null;
  return (
    <SceneBoundary fallback={<Fallback kind="hero" />}>
      <Canvas
        className="experience-canvas"
        camera={{ position: [0, 0, compact ? 7.6 : 7.2], fov: compact ? 44 : 42 }}
        dpr={[1, 1.7]}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        shadows
      >
        <HeroScene progress={progress} reduced={reduced} compact={compact} />
      </Canvas>
    </SceneBoundary>
  );
}

export function NetworkCanvas({ progress }: { progress: ProgressRef }) {
  const { ref, visible } = useNearViewport<HTMLDivElement>();
  const [supported, setSupported] = useState<boolean | null>(null);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compact = window.matchMedia("(max-width: 767px)").matches;
  useEffect(() => setSupported(canUseWebGL()), []);
  return (
    <div className="network-canvas-shell" ref={ref}>
      {supported === false && <Fallback kind="network" />}
      {supported && visible && (
        <SceneBoundary fallback={<Fallback kind="network" />}>
          <Canvas
            className="experience-canvas"
            camera={{ position: [0, 0, 8.2], fov: 43 }}
            dpr={[1, 1.5]}
            frameloop={reduced ? "demand" : "always"}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          >
            <NetworkScene progress={progress} reduced={reduced} compact={compact} />
          </Canvas>
        </SceneBoundary>
      )}
      <div className="network-labels" aria-hidden="true">
        <span className="mono">COMMUNITY</span>
        <span className="mono">RESEARCH</span>
        <span className="mono">TECHNOLOGY</span>
        <span className="mono">INFRASTRUCTURE</span>
      </div>
    </div>
  );
}
