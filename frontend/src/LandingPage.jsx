// LandingPage.jsx
import { useEffect, useRef, useState, useMemo, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Optimized 3D Cloud Model ──────────────────────────────────────
const Cloud = memo(() => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  const cloudParts = useMemo(() => {
    const parts = [];
    const baseLayer = [
      [-2.2, -0.3, 0.1, 0.65],
      [-1.5, -0.4, -0.3, 0.75],
      [-0.7, -0.35, 0.2, 0.8],
      [0.1, -0.4, -0.1, 0.85],
      [0.9, -0.35, 0.15, 0.78],
      [1.7, -0.3, -0.2, 0.7],
      [2.3, -0.25, 0.1, 0.55],
    ];
    const midLayer = [
      [-1.8, 0.15, 0, 0.6],
      [-1.1, 0.35, 0.3, 0.75],
      [-0.4, 0.45, -0.2, 0.85],
      [0.3, 0.5, 0.25, 0.9],
      [1.0, 0.4, -0.15, 0.8],
      [1.6, 0.25, 0.1, 0.65],
      [-0.2, 0.1, 0.5, 0.6],
      [0.6, 0.15, -0.4, 0.55],
    ];
    const topLayer = [
      [-1.0, 0.75, 0.1, 0.45],
      [-0.3, 0.9, -0.1, 0.55],
      [0.4, 0.85, 0.2, 0.5],
      [1.1, 0.65, 0, 0.4],
      [0.0, 1.05, 0.05, 0.4],
    ];

    [...baseLayer, ...midLayer, ...topLayer].forEach(([x, y, z, r]) => {
      const jitter = () => (Math.random() - 0.5) * 0.15;
      parts.push({
        x: x + jitter(),
        y: y + jitter() * 0.5,
        z: z + jitter(),
        r: r * (0.9 + Math.random() * 0.2),
        colorMix: Math.random(),
      });
    });

    return parts;
  }, []);

  return (
    <group ref={groupRef} scale={0.85}>
      <Float speed={0.4} rotationIntensity={0.15} floatIntensity={0.25}>
        {cloudParts.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.r, 20, 20]} />
            <meshPhysicalMaterial
              color={p.colorMix > 0.5 ? '#eef1ff' : '#dde3fb'}
              emissive="#818cf8"
              emissiveIntensity={0.12}
              metalness={0.05}
              roughness={0.35}
              transparent
              opacity={0.9}
              clearcoat={0.15}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.1, 0]} scale={[1.8, 1.1, 1.2]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.05} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.1, 0]} scale={[2.3, 1.4, 1.6]}>
          <sphereGeometry args={[1.2, 12, 12]} />
          <meshBasicMaterial color="#a5b4fc" transparent opacity={0.025} depthWrite={false} />
        </mesh>
      </Float>
    </group>
  );
});

const Scene3D = memo(() => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={80} depth={40} count={1500} factor={3} saturation={0} fade speed={0.5} />
      <Cloud />
    </group>
  );
});

const plans = [
  {
    name: 'Free',
    price: '₹0',
    features: ['1 GB Storage', 'Basic sharing', 'Access on all devices'],
    button: 'Get Started',
  },
  {
    name: 'Pro',
    price: '₹199',
    popular: true,
    features: ['2 + 2 GB Storage', 'Advanced sharing', 'Version history', 'Priority support'],
    button: 'Start Pro Trial',
  },
  {
    name: 'Team',
    price: '₹399',
    features: ['5 GB Storage', 'Team collaboration', 'Admin controls', 'Priority support'],
    button: 'Start Team Trial',
  },
];


// ─── Main Component ──────────────────────────────────────────────────
export default function LandingPage() {
  const targetRef = useRef(null);
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  return (
    <div ref={targetRef} className="bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
      {/* ─── Fixed 3D Canvas ────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <Scene3D />
        </Canvas>
      </div>

      {/* ─── Overlay Content ────────────────────── */}
      <div className="relative z-10">
        {/* Navbar */}
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/30 backdrop-blur-xl border-b border-white/5 "
        >
          <div className="flex items-center gap-2">
              
            <div >
              <img
            src="/cloudlogo.svg" // <-- Replace with your screenshot
            alt="Dashboard Preview"
            className="w-10 h-10 flex-shrink-0"
          />
            
            </div>
            <a href="#" className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              ClouDisk
            </a>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition">FEATURES</a>
            <a href="#AI" className="hover:text-white transition">AI</a>
            <a href="#UI" className="hover:text-white transition">UI</a>
            <a href="#PLANS" className="hover:text-white transition">PLANS</a>
          </div>
          <div className="flex items-center gap-3">
            <button  className="hidden sm:inline-block text-sm font-medium text-white/70 hover:text-white transition px-4 py-2 rounded-full hover:bg-white/5"
            onClick={()=> navigate("/login")}>
              Log In
            </button>
            <button onClick={()=> navigate("/login")} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition transform hover:-translate-y-0.5">
              Get Started
            </button>
          </div>
        </motion.nav>

        {/* Hero */}
        <motion.section
          style={{ opacity, scale }}
          className="min-h-screen flex items-center justify-center px-6 pt-24 pb-20"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wider">
                ✦ NEXT‑GEN CLOUD STORAGE
              </span>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-[1.05] tracking-tight">
                Cloud Storage <br />
                 <span className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-[1.05] tracking-tight">
                   Platform
                </span><br />
                <span className="bg-[linear-gradient(135deg,_#68638f_0%,_#7f86b1_30%,_#9fc7e8_60%,_#d8bfd3_85%,_#eddbe5_100%)] bg-clip-text text-transparent">
                  Store. Access. Share
                </span>
              </h1>
              <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto">
                ClouDisk a cloud storage platform that allows you to store, access, and share your files with ease.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <button onClick={()=> navigate("/login")} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-8 py-3.5 rounded-full shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition transform hover:-translate-y-1 flex items-center gap-2">
                  Start free 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
              </div>
              
            </motion.div>
          </div>
        </motion.section>

        {/* Features */}
        <section id="features" className="py-24 px-6 bg-black/40 backdrop-blur-sm border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <span className="inline-block bg-white/5 border border-white/10 text-white/60 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wider">
                Features
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">speed</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">simplicity</span>
              </h2>
              <p className="mt-4 text-white/60 text-lg">
                Everything you need to manage your digital life.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {[
                { icon: '📂', title: 'Smart Folders', desc: 'Nested folders, starring, and instant search.' },
                { icon: '🔗', title: 'Secure Sharing', desc: 'Share with anyone via encrypted links.' },
                { icon: '⭐', title: 'Starred Items', desc: 'Quick access to your most important files.' },
                { icon: '🖼️', title: 'Media Preview', desc: 'View images and videos without download.' },
                { icon: '📊', title: 'Usage Insights', desc: 'Beautiful storage analytics at a glance.' },
                { icon: '🔒', title: 'Privacy First', desc: 'End‑to‑end encryption by default.' },
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition group"
                >
                  <div className="text-4xl mb-4">{feat.icon}</div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-white/50 text-sm mt-2">{feat.desc}</p>
                  <div className="mt-4 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                    Learn more →
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        

        {/* ai assistant */}
        
      <section id="AI" className="mx-auto grid max-w-7xl items-center gap-20 px-6 py-24 lg:grid-cols-2">
  {/* Left Side */}
  <div>
    <div className="mb-4 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-xl">
      AI  Assistant
    </div>

    <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
      Your personal{" "}
      <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
        AI companion
      </span>{" "}
      inside your cloud drive.
    </h2>

    <p className="mt-8 max-w-lg text-lg leading-8 text-white/70">
      Forget endless clicking. Simply ask your AI assistant to find files,
      organize folders, generate share links, answer questions, and help manage
      your entire workspace in seconds.
    </p>

    <div className="mt-10 space-y-5 text-white/80">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-cyan-400" />
        Find any file using natural language
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-violet-400" />
        Create folders & organize your workspace instantly
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-pink-400" />
        Share files and perform actions without navigating menus
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
        Get intelligent suggestions based on your files
      </div>
    </div>
  </div>

  {/* Right Side */}
  <div className="relative rounded-[40px] border border-white/10 bg-[#0a1024]/90 p-8 backdrop-blur-2xl">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          🤖 AI Assistant
        </h3>
        <p className="text-sm text-white/50">
          Try asking anything...
        </p>
      </div>

      <div className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
        Online
      </div>
    </div>

    <div className="space-y-4">
      {[
        {
          user: "Find my React project files",
          ai: "I found 12 matching files in Development/React.",
        },
        {
          user: "Create a folder named Portfolio",
          ai: "Done! 'Portfolio' has been created successfully.",
        },
        {
          user: "Share Resume.pdf",
          ai: "Secure sharing link generated successfully.",
        },
        {
          user: "How much storage have I used?",
          ai: "You've used 12.4 GB of your 50 GB plan.",
        },
      ].map((chat, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
        >
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20">
              👤
            </div>

            <div>
              <p className="text-sm text-white/60">You</p>
              <p className="font-medium text-white">{chat.user}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20">
              🤖
            </div>

            <div>
              <p className="text-sm text-cyan-300">AI Assistant</p>
              <p className="text-white/80">{chat.ai}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* UI INTERFACCE  */}

<section id="UI" className="py-28 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-[#080b14]/80">
  <div className="max-w-7xl mx-auto">

    
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center max-w-3xl mx-auto"
    >
      <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
        UI
      </span>

      <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-white">
        Everything you need in
        <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          {" "}one beautiful workspace
        </span>
      </h2>

      <p className="mt-5 text-lg text-white/60">
        Designed for speed, simplicity and productivity. Every element is crafted
        to make managing your files feel effortless.
      </p>
    </motion.div>

    {/* Content */}
    <div className="mt-20 grid gap-14 lg:grid-cols-[1.35fr_0.65fr] items-center">

      {/* Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="absolute -inset-5 rounded-[40px] bg-gradient-to-r from-cyan-500/20 via-indigo-500/10 to-purple-500/20 blur-3xl" />

        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0B1020] shadow-2xl">

          <img
            src="/ui.png" // <-- Replace with your screenshot
            alt="Dashboard Preview"
            className="w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </motion.div>

      {/* Feature List */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        {[
          {
            icon: "🔍",
            title: "Lightning Fast Search",
            desc: "Locate files and folders instantly with intelligent search.",
          },
          {
            icon: "📂",
            title: "Modern File Explorer",
            desc: "Clean folder navigation with multiple view modes and breadcrumbs.",
          },
          {
            icon: "🤖",
            title: "Integrated AI Assistant",
            desc: "Ask AI to search, organize, share and manage your workspace.",
          },
          {
            icon: "☁️",
            title: "Secure Cloud Storage",
            desc: "Upload, preview and share files with encrypted links.",
          },
          {
            icon: "📊",
            title: "Storage Analytics",
            desc: "Monitor storage usage, plans and account activity in real time.",
          },
          {
            icon: "✨",
            title: "Premium User Experience",
            desc: "Glassmorphism, smooth animations and responsive layouts.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ x: 8 }}
            className="flex gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-2xl">
              {item.icon}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-7 text-white/60">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  </div>
</section>

        {/* plans */}

        <section id="PLANS" className="px-6 py-24 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
         <span className="inline-block bg-white/5 border border-white/10 text-white/60 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wider">
                PLANS
              </span>
        <h2 className="text-4xl font-bold mb-3">
          Simple, transparent{' '}
          <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            pricing.
          </span>
        </h2>
        <p className="text-white/60 text-lg">Pick a plan that grows with your storage needs.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
            whileHover={{ y: -6 }}
            className={`relative rounded-2xl p-8 border backdrop-blur-xl transition-colors duration-300 ${
              plan.popular
                ? 'bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-indigo-400/40 shadow-lg shadow-purple-500/20'
                : 'bg-white/[0.03] border-white/10 hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wide px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-purple-500/40">
                MOST POPULAR
              </span>
            )}

            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className="text-white/50 text-sm">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2.5 rounded-full text-sm font-semibold transition transform hover:-translate-y-0.5 ${
                plan.popular
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
              }`}
            >
              {plan.button}
            </button>
          </motion.div>
        ))}
      </div>
    </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">drive</span> your files?
            </h2>
            <p className="mt-3 text-white/50 max-w-md mx-auto">
              Join thousands of users and experience cloud storage redefined.
            </p>
            <button onClick={()=> navigate("/login")} className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-10 py-3.5 rounded-full shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition transform hover:-translate-y-1">
              Create free account
            </button>
            
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-10 px-6 text-sm text-white/30 bg-black/40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div>
                <img
            src="/cloudlogo.svg" // <-- Replace with your screenshot
            alt="Dashboard Preview"
            className="w-10 h-10 flex-shrink-0"
          />
              </div>
              <span className="font-semibold text-white/70">ClouDisk</span>
            </div>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Support</a>
            </div>
            <p className="text-xs">© 2026 My Drive. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}