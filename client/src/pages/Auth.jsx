import React from 'react'
import { motion } from "framer-motion"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../utils/firebase';
import logo from '../assets/logo.png'
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setUserData } from "../redux/userSlice";

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;

      const name = User.displayName;
      const email = User.email;

      const result = await axios.post(
        serverUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data.user));
      navigate("/");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  };

  const featureHighlights = [
    { icon: "📘", text: "High-yield Exam Notes" },
    { icon: "📁", text: "Structured Project Docs" },
    { icon: "📊", text: "AI Diagrams & Charts" },
    { icon: "⬇️", text: "Instant PDF Downloads" },
    { icon: "🚀", text: "Generate in Seconds" },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-zinc-950 text-zinc-50 antialiased selection:bg-zinc-800">
      
      {/* --- LEFT SIDE: Authentication Form --- */}
      <main className="flex items-center justify-center p-6 sm:p-12 md:p-16 relative z-10">
        
        {/* Ambient background glow behind the login card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md p-8 sm:p-10 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-20"
        >
          {/* Logo & Brand */}
          <div className="flex flex-col items-center text-center mb-10">
            <img 
              src={logo} 
              alt="Note_Mind.io Logo" 
              className="w-16 h-16 object-contain mb-5 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <h1 className="text-3xl font-extrabold tracking-tighter text-white">
              Welcome to Note_Mind
            </h1>
            <p className="text-base text-zinc-400 mt-2 font-normal">
              Sign in or create your account to unlock AI notes.
            </p>
          </div>

          {/* Google Sign-In Button */}
          <motion.button
            onClick={handleGoogleSignAuth}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3.5 px-6 py-4 bg-black border border-zinc-800 hover:border-zinc-700 rounded-2xl text-base font-semibold text-zinc-100 shadow-md transition-all duration-200 cursor-pointer group"
          >
            <FcGoogle className="text-2xl transition-transform group-hover:scale-110" />
            Continue with Google
          </motion.button>

          {/* Footer of the card */}
          <div className="mt-10 text-center border-t border-zinc-800 pt-6">
            <p className="text-sm text-zinc-500 font-normal">
              By continuing, you agree to our{' '}
              <Link to="/" className="text-zinc-300 hover:text-white underline underline-offset-2">Terms</Link> and{' '}
              <Link to="/" className="text-zinc-300 hover:text-white underline underline-offset-2">Privacy Policy</Link>.
            </p>
            <p className="mt-3 text-xs text-zinc-600">
              Need help? Contact <a href="mailto:support@note-mind.io" className="hover:text-zinc-400">support</a>
            </p>
          </div>
        </motion.div>
      </main>

      {/* --- RIGHT SIDE: Marketing Showcase --- */}
      <aside className="hidden lg:flex flex-col justify-between p-16 xl:p-20 relative overflow-hidden bg-zinc-900 border-l border-zinc-800">
        
        {/* Subtle background gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black to-zinc-900/50 opacity-90" />
        <div className="absolute -top-10 -right-10 w-100 h-100 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400">NOTE_MIND.IO</h2>
            <div className="h-px w-20 bg-zinc-800"></div>
          </div>

          {/* Content Middle */}
          <div className="my-auto">
            <h3 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] bg-linear-to-b from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
              Elevate Your Learning.<br />
              Generated by AI.
            </h3>
            <p className="mt-6 text-xl text-zinc-300 leading-relaxed max-w-lg font-normal">
              Stop summarizing. Note_Mind uses advanced models to synthesize your materials into perfect, revision-ready study guides instantly.
            </p>

            {/* Icon Feature List */}
            <ul className="mt-12 space-y-5">
              {featureHighlights.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  className="flex items-center gap-4 text-lg font-medium text-zinc-100"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700/60 shadow-inner">
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  {feature.text}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Footer - Social Proof */}
          <div className="border-t border-zinc-800 pt-8 mt-auto">
            <div className="flex items-center gap-4">
              {/* Fake user avatars for social proof */}
              <div className="flex -space-x-4">
                <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=Felix" alt="" className="w-10 h-10 rounded-full border-2 border-zinc-900 shadow-lg"/>
                <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=Anya" alt="" className="w-10 h-10 rounded-full border-2 border-zinc-900 shadow-lg"/>
                <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=Eric" alt="" className="w-10 h-10 rounded-full border-2 border-zinc-900 shadow-lg"/>
              </div>
              <div>
                <p className="text-base font-semibold text-white">Join 500+ Students</p>
                <p className="text-sm text-zinc-400 font-normal">Generating smarter notes every day.</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  )
}

export default Auth;