import React, { useRef, useState, Component, type ErrorInfo, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Wrench, Zap, Hammer, MapPin } from 'lucide-react';

// WebGL Fallback Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL / R3F Canvas Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/80 border border-cyan-500/20 rounded-2xl p-6 text-center">
          <MapPin className="w-12 h-12 text-cyan-400 mb-3 animate-pulse" />
          <h4 className="text-lg font-semibold text-white">Interactive 3D Map View</h4>
          <p className="text-sm text-gray-400 max-w-md mt-1">Connecting Jaipur customers with 140+ verified local workers in real-time.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Low-poly City Building Component
const Building = ({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
    </mesh>
  );
};

// Animated Pulse Ping Ring
const PulseRing = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = (clock.getElapsedTime() * 1.5) % 2;
      meshRef.current.scale.set(1 + t * 0.8, 1 + t * 0.8, 1);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - t / 2);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.4, 0.55, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Interactive Node Marker
const NodeMarker = ({
  position,
  title,
  subtitle,
  icon: Icon,
  color,
  isCustomer = false
}: {
  position: [number, number, number];
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  isCustomer?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.4} />
        </mesh>
        
        {/* Floating HTML Card */}
        <Html position={[0, 0.7, 0]} center distanceFactor={12}>
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap backdrop-blur-md border shadow-lg transition-all duration-300 flex items-center gap-2 ${
              isCustomer
                ? 'bg-blue-900/90 border-blue-400/50 text-blue-200'
                : 'bg-gray-900/90 border-cyan-500/50 text-cyan-200'
            } ${hovered ? 'scale-110 shadow-cyan-500/30' : ''}`}
          >
            <div className={`p-1 rounded-lg ${isCustomer ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-white leading-tight">{title}</div>
              <div className="text-[10px] text-gray-300 font-normal">{subtitle}</div>
            </div>
          </div>
        </Html>
      </Float>
      <PulseRing position={[0, -position[1] + 0.05, 0]} color={color} />
    </group>
  );
};

// City Grid Floor & Roads
const CityGround = () => {
  return (
    <group>
      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0b1120" roughness={0.8} />
      </mesh>
      
      {/* Grid Lines */}
      <gridHelper args={[20, 20, '#06b6d4', '#1e293b']} position={[0, 0.01, 0]} />
    </group>
  );
};

// Scene Content
const CityScene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  // Coordinates
  const customerPos: [number, number, number] = [0, 1.2, 0];
  const worker1Pos: [number, number, number] = [-2.8, 1.4, -2.2];
  const worker2Pos: [number, number, number] = [2.5, 1.2, 2.0];
  const worker3Pos: [number, number, number] = [-2.2, 1.5, 2.4];

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[0, 5, 0]} intensity={2} color="#06b6d4" distance={10} />

      <CityGround />

      {/* Buildings */}
      <Building position={[-1.5, 0.8, -1.2]} size={[1.2, 1.6, 1.2]} color="#1e293b" />
      <Building position={[1.8, 1.2, -1.8]} size={[1.4, 2.4, 1.4]} color="#0f172a" />
      <Building position={[-3.5, 0.7, 0.5]} size={[1.5, 1.4, 1.5]} color="#111827" />
      <Building position={[3.2, 0.9, 0.2]} size={[1.2, 1.8, 1.2]} color="#1e293b" />
      <Building position={[0.5, 0.6, -3.2]} size={[1.8, 1.2, 1.6]} color="#0f172a" />
      <Building position={[-1.0, 1.0, 3.2]} size={[1.4, 2.0, 1.2]} color="#111827" />

      {/* Customer Node */}
      <NodeMarker
        position={customerPos}
        title="Your Location"
        subtitle="Malviya Nagar, Jaipur"
        icon={MapPin}
        color="#3b82f6"
        isCustomer
      />

      {/* Nearby Worker Nodes */}
      <NodeMarker
        position={worker1Pos}
        title="Rajesh K. (4.9★)"
        subtitle="Electrician • 1.4 km"
        icon={Zap}
        color="#06b6d4"
      />
      <NodeMarker
        position={worker2Pos}
        title="Suresh P. (4.8★)"
        subtitle="Plumber • 2.1 km"
        icon={Wrench}
        color="#10b981"
      />
      <NodeMarker
        position={worker3Pos}
        title="Manoj V. (4.7★)"
        subtitle="Carpenter • 3.2 km"
        icon={Hammer}
        color="#f59e0b"
      />

      {/* Connection Ray Lines from Customer to Workers */}
      <Line
        points={[customerPos, worker1Pos]}
        color="#06b6d4"
        lineWidth={2}
        dashed
        dashScale={2}
      />
      <Line
        points={[customerPos, worker2Pos]}
        color="#10b981"
        lineWidth={2}
        dashed
        dashScale={2}
      />
      <Line
        points={[customerPos, worker3Pos]}
        color="#f59e0b"
        lineWidth={2}
        dashed
        dashScale={2}
      />
    </group>
  );
};

export const Hero3DScene: React.FC = () => {
  return (
    <div className="relative w-full h-[480px] lg:h-[560px] rounded-3xl overflow-hidden border border-cyan-500/20 bg-slate-950/80 shadow-2xl shadow-cyan-500/10">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      {/* Header Overlay Pill */}
      <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-cyan-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Hyper-Local Mesh • Jaipur Live</span>
      </div>

      <WebGLErrorBoundary>
        <Canvas camera={{ position: [0, 6, 9], fov: 45 }}>
          <CityScene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            autoRotate
            autoRotateSpeed={0.8}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
