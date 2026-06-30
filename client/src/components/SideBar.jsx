import React from 'react';
import { motion } from "framer-motion";

function Sidebar({ result }) {
  if (
    !result ||
    !result.subTopics ||
    !result.questions ||
    !result.questions.short ||
    !result.questions.long
  ) {
    return null;
  }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 space-y-6 shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
      
      {/* Header Widget */}
      <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/60">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-sm shadow-sm text-indigo-400">
          🎯
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200">
            Exam Insights
          </h3>
          <p className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase mt-0.5">
            Structured Blueprint
          </p>
        </div>
      </div>

      {/* Exam Importance Engine Status */}
      <div className="rounded-xl bg-linear-to-br from-zinc-950 to-zinc-900/80 border border-zinc-800/60 p-3 flex items-center justify-between shadow-inner">
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Weightage
          </p>
          <p className="text-[11px] text-zinc-500 font-normal mt-0.5">Appearance index</p>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-lg tracking-wider">
          {result.importance}
        </span>
      </div>

      {/* Core Material Sub-Topics */}
      <section className="space-y-3">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <span>⚡</span> Core Syllabus Units
        </p>

        <div className="space-y-3">
          {Object.entries(result.subTopics).map(([star, topics]) => (
            <div 
              key={star} 
              className="group rounded-xl bg-zinc-950/50 border border-zinc-800/40 hover:border-zinc-800 p-3 transition-all duration-200"
            >
              <div className="mb-2">
                <span className="text-[9px] font-bold tracking-widest uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/10">
                  {star} Priority
                </span>
              </div>

              <ul className="space-y-2 pl-0.5">
                {topics.map((topicItem, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed font-normal group-hover:text-zinc-300 transition-colors">
                    <span className="text-indigo-400 mt-1.5 shrink-0 text-[8px]">◆</span>
                    <span>{topicItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Key Examination Question Pipeline */}
      <section className="space-y-3 pt-4 border-t border-zinc-800/40">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <span>❓</span> Focus Assessment
        </p>

        <div className="space-y-3">
          {/* Short Questions Module */}
          {result.questions.short && result.questions.short.length > 0 && (
            <div className="rounded-xl bg-zinc-950/30 border border-zinc-800/40 p-3">
              <p className="text-[10px] font-bold tracking-wide uppercase text-indigo-400 mb-2">
                Conceptual short
              </p>
              <ul className="space-y-2">
                {result.questions.short.map((q, i) => (
                  <li key={i} className="text-xs text-zinc-400 font-normal leading-relaxed pl-2.5 border-l border-zinc-800 hover:border-indigo-500/50 transition-all">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Long Questions Module */}
          {result.questions.long && result.questions.long.length > 0 && (
            <div className="rounded-xl bg-zinc-950/30 border border-zinc-800/40 p-3">
              <p className="text-[10px] font-bold tracking-wide uppercase text-teal-400 mb-2">
                Analytical Long
              </p>
              <ul className="space-y-2">
                {result.questions.long.map((q, i) => (
                  <li key={i} className="text-xs text-zinc-400 font-normal leading-relaxed pl-2.5 border-l border-zinc-800 hover:border-teal-500/50 transition-all">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Diagram Target Module */}
          {result.questions.diagram && (
            <div className="rounded-xl bg-zinc-950/30 border border-zinc-800/40 p-3">
              <p className="text-[10px] font-bold tracking-wide uppercase text-purple-400 mb-2">
                Schematic Task
              </p>
              <p className="text-xs text-zinc-400 font-normal leading-relaxed pl-2.5 border-l border-purple-500/30">
                {result.questions.diagram}
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

export default Sidebar;