import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { serverUrl } from '../App';
import { AnimatePresence, motion } from "framer-motion"; 
import { useNavigate } from 'react-router-dom';
import FinalResult from '../components/FinalResult';
import Navbar from '../components/Navbar';
import { FiMenu, FiX, FiPlus, FiBook, FiLayout, FiPieChart, FiZap } from "react-icons/fi";

function History() {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all notes on mount
  useEffect(() => {
    const myNotes = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/notes/getnotes", { withCredentials: true });
        if (res.data && Array.isArray(res.data.notes)) {
          setTopics(res.data.notes);
        } else {
          setTopics([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    myNotes();
  }, []);

  // Fetch individual note content
  const openNotes = async (noteId) => {
    setLoading(true);
    setActiveNoteId(noteId);
    if (window.innerWidth < 1024) setIsSidebarOpen(false); 

    try {
      const res = await axios.get(serverUrl + `/api/notes/${noteId}`, { withCredentials: true });
      setSelectedNote(res.data.content);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Handle desktop sidebar visibility on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-screen bg-zinc-950 text-zinc-100 font-sans relative overflow-hidden flex flex-col">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Integrated Navbar */}
      <div className="relative z-20 shrink-0">
        <Navbar />
      </div>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-400 w-full mx-auto px-4 md:px-6 py-4 relative z-10 flex flex-col min-h-0">
        
        {/* Mobile Top Header */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-zinc-900/50 border border-white/10 rounded-2xl p-4 backdrop-blur-md shrink-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiBook className="text-indigo-400" /> My Library
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            <FiMenu className="text-xl" />
          </button>
        </div>

        {/* Workspace Layout Content Wrapper */}
        <div className="flex-1 flex gap-6 min-h-0 relative">
          
          {/* Sidebar Area */}
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <>
                {/* Mobile Overlay Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                />

                {/* Actual Sidebar Container */}
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed lg:static top-0 left-0 bottom-0 z-50 lg:z-auto w-70 md:w-[320px] lg:w-80 h-full bg-zinc-900/95 lg:bg-zinc-900/60 backdrop-blur-xl border-r lg:border border-white/10 lg:rounded-3xl shadow-2xl flex flex-col shrink-0 min-h-0"
                >
                  <div className="p-5 flex flex-col h-full min-h-0">
                    
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between mb-6 shrink-0">
                      <h2 className="text-lg font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                        <FiBook className="text-indigo-400" /> History
                      </h2>
                      <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <FiX />
                      </button>
                    </div>

                    {/* Generate Action Button */}
                    <button 
                      onClick={() => navigate("/notes")} 
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-lg transition-all active:scale-[0.98] mb-4 shrink-0"
                    >
                      <FiPlus className="text-lg" /> Generate New Notes
                    </button>
                    
                    {/* Topics List Container */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar min-h-0">
                      {topics.length === 0 ? (
                        <div className="text-center py-10 text-zinc-500 text-sm">
                          <p>No notes created yet.</p>
                          <p className="mt-1 text-xs text-zinc-600">Start generating!</p>
                        </div>
                      ) : (
                        topics.map((t, i) => (
                          <motion.div 
                            key={t._id || i}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => openNotes(t._id)} 
                            className={`cursor-pointer rounded-xl p-4 border transition-all ${
                              activeNoteId === t._id
                                ? "bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                                : "bg-white/5 border-white/5 hover:bg-white/10"
                            }`}
                          >
                            <h3 className="text-sm font-semibold text-zinc-100 leading-snug line-clamp-2 mb-3">
                              {t.topic}
                            </h3>
                            
                            <div className="flex flex-wrap gap-2 text-[10px] font-medium tracking-wide">
                              {t.classLevel && (
                                <span className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300">
                                  Lvl: {t.classLevel}
                                </span>
                              )}
                              {t.examType && (
                                <span className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300">
                                  {t.examType}
                                </span>
                              )}
                            </div>

                            {(t.revisionMode || t.includeDiagram || t.includeChart) && (
                              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5 text-[11px] text-zinc-400">
                                {t.revisionMode && <span className="flex items-center gap-1"><FiZap className="text-yellow-400" /> Rev</span>}
                                {t.includeDiagram && <span className="flex items-center gap-1"><FiLayout className="text-blue-400" /> Diag</span>}
                                {t.includeChart && <span className="flex items-center gap-1"><FiPieChart className="text-purple-400" /> Chart</span>}
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Document Viewer Container */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 flex flex-col min-h-0 overflow-hidden relative"
          >
            {loading ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <p className="animate-pulse text-sm">Retrieving your notes...</p>
              </div>
            ) : !selectedNote ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-zinc-500 p-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <FiBook className="text-3xl text-zinc-600" />
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-2 text-center">No Document Selected</h3>
                <p className="text-xs md:text-sm text-center max-w-sm text-zinc-500">
                  Select a topic from your library in the sidebar to view, read, and revise your AI-generated notes.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                 <FinalResult result={selectedNote} />
              </div>
            )}
          </motion.div>

        </div>
      </main>

      {/* Embedded Customized Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}} />
    </div>
  );
}

export default History;