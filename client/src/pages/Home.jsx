import React from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import img from '../assets/img1.png'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden selection:bg-zinc-800 selection:text-white antialiased">
      <Navbar />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-36 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center z-10">
        
        {/* Subtle background glow effect */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Hero Left Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full mb-6 shadow-sm">
              ✨ Introducing Next-Gen Note Generation
            </span>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] bg-linear-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Create Smart <br /> AI Notes in Seconds
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
            >
              Generate exam-focused notes, project documentation, flow diagrams, 
              and revision-ready content using advanced AI—faster, cleaner, and smarter.
            </motion.p>
          </motion.div>

          {/* Call to Action Button */}
          <motion.button
          onClick={()=>navigate("/notes")}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group mt-10 px-8 py-3.5 rounded-xl flex items-center gap-2 bg-zinc-50 text-zinc-950 font-semibold text-base shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.15)] transition-all duration-300 border border-zinc-200 cursor-pointer"
          >
            Get Started Free
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Hero Right Visuals */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          whileHover={{
            y: -8,
            rotateX: 4,
            rotateY: -4,
          }}
          className="relative transform-gpu flex justify-center items-center lg:justify-end"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Ambient glow behind image */}
          <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/5 to-purple-500/5 blur-2xl rounded-3xl" />
          
          <div className="relative border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl bg-zinc-900/40 backdrop-blur-md p-2 max-w-125 lg:max-w-full">
            <img
              src={img}
              alt="AI Dashboard Mockup"
              className="rounded-xl w-full object-cover shadow-inner"
              style={{ transform: "translateZ(20px)" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-6 sm:px-8 py-24 z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">Engineered for ultimate productivity</h2>
          <p className="text-zinc-500 mt-2">Everything you need to master your workflow and scale your learning curve.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature
            icon="📘"
            title="Exam Notes"
            des="High-yield, exam-oriented frameworks packaged cleanly with concise rapid-revision points."
          />
          <Feature
            icon="📁"
            title="Project Notes"
            des="Well-structured, comprehensive content customized precisely for production assignments."
          />
          <Feature
            icon="📊"
            title="Diagrams"
            des="Auto-generated, semantic structural visuals built on-the-fly to clarify nested concepts."
          />
          <Feature
            icon="⬇️"
            title="PDF Download"
            des="Download optimized, cleanly stylized, and highly shareable printable vectors instantly."
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}

function Feature({ icon, title, des }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative rounded-2xl p-6 bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 backdrop-blur-xl shadow-xl transition-colors duration-300 flex flex-col justify-between"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Light sweep effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-zinc-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        <div className="w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center text-2xl mb-5 shadow-inner">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-zinc-100 mb-2 tracking-tight">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed font-normal">{des}</p>
      </div>
    </motion.div>
  );
}

export default Home