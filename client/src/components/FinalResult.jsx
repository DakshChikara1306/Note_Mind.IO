import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import MermaidSetup from './MermaidSetup';
import RechartSetUp from './RechartSetup';
import { downloadPDF } from '../services/api';

const markDownComponent = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-zinc-900 mt-8 mb-4 border-b border-zinc-100 pb-2 tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-zinc-800 mt-6 mb-3 tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-zinc-800 mt-4 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-zinc-600 leading-relaxed mb-4 text-sm font-normal">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ml-5 space-y-2 text-zinc-600 mb-4 text-sm">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="marker:text-indigo-600 pl-0.5">
      {children}
    </li>
  ),
};

function FinalResult({ result }) {
  const [quickRevision, setQuickRevision] = useState(false);
  if (!result ||
    !result.subTopics ||
    !result.questions ||
    !result.questions.short ||
    !result.questions.long
  ) {
    return null;
  }

  return (
    <div className='p-6 sm:p-8 space-y-10 bg-white rounded-2xl text-zinc-900'>
      
      {/* Document Action Top Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-6'>
        <div className="flex items-center gap-3">
          <h2 className='text-2xl font-black tracking-tight bg-linear-to-r from-zinc-900 to-zinc-700 bg-clip-text text-transparent'>
            Generated Documentation
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setQuickRevision(!quickRevision)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 active:scale-98 cursor-pointer ${
              quickRevision
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {quickRevision ? "📝 Exit Revision" : "⚡ Quick Revision"}
          </button>

          <button 
            onClick={() =>downloadPDF(result)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-200 active:scale-98 shadow-md shadow-zinc-950/10 cursor-pointer"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Sub Topics */}
      {!quickRevision && (
        <section className="space-y-4">
          <SectionHeader icon="⭐" title="Sub Topics Breakdown" color="indigo" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.subTopics).map(([star, topics]) => (
              <div key={star} className='p-4 rounded-xl border border-zinc-100 bg-zinc-50/50'>
                <p className='text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5'>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  {star} Priority Matrix
                </p>
                <ul className='space-y-1.5 text-zinc-600 text-sm'>
                  {topics.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-300">■</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Detailed Notes View */}
      {!quickRevision && (
        <section className="space-y-4">
          <SectionHeader icon="📄" title="Comprehensive Analysis" color="purple" />
          <div className='bg-zinc-50/30 border border-zinc-100 rounded-2xl p-6 sm:p-8 shadow-inner'>
            <ReactMarkdown components={markDownComponent}>
              {result.notes}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Quick Revision View */}
      {quickRevision && (
        <section className='rounded-2xl bg-emerald-50/50 border border-emerald-100 p-6 sm:p-8 space-y-4 shadow-sm'>
          <h3 className='font-bold text-emerald-800 text-base flex items-center gap-2'>
            <span>⚡</span> Exam Quick Revision Points
          </h3>
          <ul className="space-y-3 text-zinc-700 text-sm pl-1">
            {result.revisionPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Diagrams Section */}
      {result.diagram?.data && (
        <section className="space-y-3">
          <SectionHeader icon="📊" title="Schematic Diagram Map" color="cyan" />
          <div className="border border-zinc-100 rounded-2xl p-2 bg-zinc-50/50">
            <MermaidSetup diagram={result.diagram?.data} />
          </div>
          <p className='text-xs text-zinc-400 italic pl-1'>
            💡 Tip: You can right-click or screenshot this diagram to archive it locally.
          </p>
        </section>
      )}

      {/* Charts Module */}
      {result.charts?.length > 0 && (
        <section className="space-y-3">
          <SectionHeader icon="📈" title="Visual Data Distribution" color="blue" />
          <RechartSetUp charts={result.charts} />
          <p className='text-xs text-zinc-400 italic pl-1'>
            💡 Tip: Interactive hover metrics are supported on data coordinates.
          </p>
        </section>
      )}

      {result.charts && result.charts.length === 0 && (
        <p className='text-xs text-zinc-400 italic bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-center'>
          📉 Data distributions/charts are not explicitly requested or relevant for this structure.
        </p>
      )}

      {/* Question Assessment Area */}
      <section className="space-y-5 pt-4 border-t border-zinc-100">
        <SectionHeader icon="❓" title="Self Assessment Pool" color="rose" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className='text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5'>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Short Concept Questions
            </p>
            <ul className='space-y-2 text-sm text-zinc-600 pl-1'>
              {result.questions.short.map((q, i) => (
                <li key={i} className="border-l-2 border-zinc-100 pl-3 py-0.5 hover:border-rose-400 transition-colors">{q}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className='text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5'>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Complex Analytical Questions
            </p>
            <ul className='space-y-2 text-sm text-zinc-600 pl-1'>
              {result.questions.long.map((q, i) => (
                <li key={i} className="border-l-2 border-zinc-100 pl-3 py-0.5 hover:border-rose-400 transition-colors">{q}</li>
              ))}
            </ul>
          </div>
        </div>

        {result.questions.diagram && (
          <div className="pt-2">
            <p className='text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5 mb-2'>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Structural Diagram Prompt
            </p>
            <p className="text-sm text-zinc-600 bg-zinc-50 border border-zinc-100 p-3 rounded-xl italic">
              {result.questions.diagram}
            </p>
          </div>
        )}
      </section>

    </div>
  );
}

function SectionHeader({ icon, title, color }) {
  const colors = {
    indigo: "bg-indigo-50/60 text-indigo-800 border-indigo-100/50",
    purple: "bg-purple-50/60 text-purple-800 border-purple-100/50",
    blue: "bg-blue-50/60 text-blue-800 border-blue-100/50",
    green: "bg-green-50/60 text-green-800 border-green-100/50",
    cyan: "bg-cyan-50/60 text-cyan-800 border-cyan-100/50",
    rose: "bg-rose-50/60 text-rose-800 border-rose-100/50",
  };
  return (
    <div className={`px-4 py-2 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center gap-2 w-fit ${colors[color]}`}>
      <span>{icon}</span>
      <span>{title}</span>
    </div>
  );
}

export default FinalResult;