import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TopicForm from '../components/TopicForm';
import logo from "../assets/logo.png";
import Sidebar from '../components/SideBar';
import FinalResult from '../components/FinalResult';

const Notes = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user || {});
  const credits = userData?.credits || 0;
  
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden antialiased selection:bg-indigo-500/30 selection:text-indigo-200 relative">
      
      {/* Decorative ambient blurred lights */}
      <div className="absolute top-0 right-1/4 w-125 h-125 bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-10 w-100 h-100 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Header Bar */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto mb-10 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 px-6 py-4 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-20"
      >
        <div onClick={() => navigate("/")} className="cursor-pointer group select-none flex flex-col items-start">
          <div className="flex items-center gap-3">
            <img src={logo} alt="examnotes" className="w-8 h-8 object-contain group-hover:rotate-6 transition-transform duration-300" />
            <span className="text-xl font-bold tracking-tight text-white">
              Note_Mind<span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">.IO</span>
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium tracking-wide uppercase">
            Automated production engines for high-yield structures
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-stretch sm:justify-end">
          {/* Credits Widget */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 text-xs font-semibold hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200 cursor-pointer shadow-inner"
            onClick={() => navigate("/pricing")}
          >
            <span className="text-indigo-400 text-sm">💠</span>
            <span className="tracking-wide">{credits} Credits</span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="ml-1 h-5 w-5 flex items-center justify-center rounded-md bg-zinc-100 text-zinc-950 font-bold shadow-sm"
            >
              ＋
            </motion.span>
          </button>

          {/* Action Dashboard Links */}
          <button
            onClick={() => navigate("/history")}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-950 hover:bg-white active:scale-98 transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/20"
          >
            📚 Library Workspace
          </button>
        </div>
      </motion.header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto relative z-10 space-y-10 pb-20">
        
        {/* Setup Panel Wrapper */}
        <div className="max-w-3xl mx-auto w-full">
          <TopicForm 
            setResult={setResult} 
            setLoading={setLoading} 
            loading={loading} 
            setError={setError} 
          />
        </div>

        

        {/* Global Error Container */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-red-400 text-xs font-semibold tracking-wide shadow-lg max-w-2xl mx-auto backdrop-blur-md"
            >
              🚨 {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Context Empty Workspace Block */}
        {!result && !loading && (
          <motion.div 
            whileHover={{ y: -2, border: "1px dashed #3f3f46" }}
            className="max-w-3xl mx-auto h-64 rounded-2xl flex flex-col items-center justify-center bg-zinc-900/10 border border-dashed border-zinc-800/80 backdrop-blur-sm text-zinc-500 shadow-[inset_0_4px_30px_rgba(0,0,0,0.2)] p-6 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl mb-4 shadow-md text-zinc-400">
              📘
            </div>
            <p className="text-sm font-semibold text-zinc-300 tracking-tight">Generated Workspace Display Area</p>
            <p className="text-xs text-zinc-500 mt-1.5 max-w-xs text-center font-normal leading-relaxed">
              Configure parameters using the setup panel above to invoke generation routines.
            </p>
          </motion.div>
        )}

        {/* Output Area Split Layout */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-4"
          >
            {/* Sidebar Sticky Panel */}
            <div className="lg:col-span-1 lg:sticky lg:top-6 order-2 lg:order-1">
              <Sidebar result={result} />
            </div>

            {/* Core Output Notes Document Canvas */}
            <div className="lg:col-span-3 rounded-2xl bg-white border border-gray-100 shadow-[0_30px_70px_rgba(0,0,0,0.25)] overflow-hidden order-1 lg:order-2">
              <FinalResult result={result} />
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
};

export default Notes;