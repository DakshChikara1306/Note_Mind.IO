import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { generateNotes } from '../services/api';

const TopicForm = ({ setResult, setLoading, loading, setError }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.userData || state.user?.user);

  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
  
  const [progress, setProgress] = useState(0); 
  const [progressText, setProgressText] = useState("Analyzing input semantics..."); 

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(5);
      setProgressText("Analyzing input semantics...");

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) {
            setProgressText("Structuring framework parameters...");
            return prev + Math.floor(Math.random() * 5) + 2;
          }
          if (prev < 65) {
            setProgressText("Querying model nodes...");
            return prev + Math.floor(Math.random() * 3) + 1;
          }
          if (prev < 88) {
            setProgressText("Synthesizing technical documentation modules...");
            return prev + 1;
          }
          if (prev < 97) {
            setProgressText("Finalizing document formatting...");
            return prev + 0.5;
          }
          return prev;
        });
      }, 800);
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please specify a core target topic before triggering pipeline generation.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    
    try {
      const responseData = await generateNotes({topic, classLevel, examType, revisionMode, includeDiagram, includeChart});
      setResult(responseData.data);

      if (user && responseData.creditsLeft !== undefined) {
        dispatch(setUserData({
          ...user,
          credits: responseData.creditsLeft
        }));
      }

      setLoading(false);
      setTopic("");
      setClassLevel("");
      setExamType("");
      setRevisionMode(false);
      setIncludeDiagram(false);
      setIncludeChart(false);

    } catch (err) {
      const serverMessage = err.response?.data?.error || "An error occurred while processing your request. Please try again.";
      setError(serverMessage);
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-[0_30px_80px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden"
    >
      {/* Parameter Control Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Primary Material Topic</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all text-sm shadow-inner" 
            placeholder="e.g. Quantum Mechanics, Web Development Basics"
            onChange={(e) => setTopic(e.target.value)}
            value={topic}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Target Grade / Level</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all text-sm shadow-inner" 
              placeholder="e.g. Undergraduate, Class 12"
              onChange={(e) => setClassLevel(e.target.value)}
              value={classLevel}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Examination System Blueprint</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all text-sm shadow-inner" 
              placeholder="e.g. AP Exams, CBSE, JEE"
              onChange={(e) => setExamType(e.target.value)}
              value={examType}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Structural Toggle Switches */}
      <div className="pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap bg-zinc-950/20 p-3 rounded-xl">
        <Toggle label="Revision Matrix" checked={revisionMode} onChange={() => !loading && setRevisionMode(!revisionMode)} />
        <Toggle label="Embed Diagrams" checked={includeDiagram} onChange={() => !loading && setIncludeDiagram(!includeDiagram)} />
        <Toggle label="Synthesize Charts" checked={includeChart} onChange={() => !loading && setIncludeChart(!includeChart)} />
      </div>

      {/* Invocation Action CTA Wrapper */}
      <div className="pt-2">
        <motion.button
          onClick={handleSubmit}
          type="submit"
          whileHover={!loading ? { y: -1, scale: 1.005 } : {}}
          whileTap={!loading ? { scale: 0.995 } : {}}
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
            loading
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/30"
              : "bg-white text-zinc-950 hover:bg-zinc-100 cursor-pointer shadow-lg shadow-white/5"
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2.5">
              <svg className="animate-spin h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Compiling Document Models...</span>
            </div>
          ) : (
            <span>Invoke Note Generation Pipeline</span>
          )}
        </motion.button>
      </div>

      {/* Inline Render Pipeline Status Bar */}
      {loading && (
        <div className="mt-4 pt-4 border-t border-zinc-800/40 space-y-2.5">
          <div className="w-full h-1.5 rounded-full bg-zinc-950 overflow-hidden border border-zinc-900">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(progress)}%` }} 
              transition={{ ease: "easeOut", duration: 0.5 }}
              className='h-full bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-500'
            />
          </div>

          <div className='flex justify-between text-[11px] font-semibold tracking-wide text-zinc-400'>
            <span>{progressText}</span> 
            <span className="font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{Math.round(progress)}%</span>
          </div>
          <p className='text-[10px] text-zinc-500 text-center pt-1 leading-relaxed font-normal'>
            Deep synthesis pipelines may take up to 2-3 minutes. Please do not close or refresh this view.
          </p>
        </div>
      )}
    </motion.form>
  );
};

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center gap-2.5 cursor-pointer select-none py-1 group" onClick={onChange}>
      <div className="relative w-8 h-4.5 rounded-full bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
        <motion.div
          animate={{
            x: checked ? 14 : 2,
            backgroundColor: checked ? "#10b981" : "#52525b"
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.75 h-2.5 w-2.5 rounded-full shadow-md"
        />
      </div>
      <span className={`text-xs font-semibold transition-colors duration-200 ${
        checked ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-300"
      }`}>
        {label}
      </span>
    </div>
  );
}

export default TopicForm;