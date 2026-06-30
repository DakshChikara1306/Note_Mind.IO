import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"; // Changed to standard framer-motion import name
import axios from 'axios';
import { serverUrl } from '../App';

function Pricing() {
  const navigate = useNavigate();
  const [selectedPrice, setSelectedPrice] = useState(200); // Defaulting to popular plan is a standard conversion practice
  const [paying, setPaying] = useState(false);
  const [payingAmount, setPayingAmount] = useState(null);

  const handlePaying = async (amount) => {
    try {
      setPayingAmount(amount);
      setPaying(true);

      const result = await axios.post(serverUrl + "/api/credit/order", { amount }, { withCredentials: true });

      if (result.data.url) {
        window.location.href = result.data.url;
      }
      setPaying(false);
    } catch (error) {
      setPaying(false); // Fixed typo: 'fale' -> 'false'
      console.error(error);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px] px-6 py-12 relative font-sans antialiased'>
      
      {/* Top Navigation */}
      <div className="max-w-5xl mx-auto mb-8">
        <button 
          onClick={() => navigate("/")} 
          className='group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200'
        >
          <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span> Back to Dashboard
        </button>
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">
          Pricing Plans
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-3 tracking-tight">
          Boost Your Study Power
        </h1>
        <p className="text-lg text-slate-600 mt-3 max-w-md mx-auto">
          Unlock premium AI-powered tools. Choose a plan tailored to your study goals.
        </p>
      </motion.div>

      {/* Pricing Cards Grid */}
      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch'>
        <PricingCard
          title="Starter"
          price="₹100"
          amount={100}
          credits="50 Credits"
          description="Perfect for quick revisions and occasional assignments."
          features={[
            "Generate AI notes",
            "Exam-focused answers",
            "Diagram & charts support",
            "Fast generation speeds"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />

        <PricingCard
          popular
          title="Popular"
          price="₹200"
          amount={200}
          credits="120 Credits"
          description="Best value for regular students hitting the books."
          features={[
            "Everything in Starter",
            "Bonus credits included",
            "Full Revision mode access",
            "Priority AI queue response"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />
        
        <PricingCard
          title="Pro Learner"
          price="₹500"
          amount={500}
          credits="300 Credits"
          description="For heavy exam seasons and mastering whole syllabi."
          features={[
            "Maximum credit discount",
            "Unlimited workspace history",
            "Advanced charts & diagrams",
            "Ideal for comprehensive finals"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />
      </div>

      {/* Global Loading Overlay */}
      {paying && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-4">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
            <p className="text-sm font-medium text-slate-800">Securely routing to payment gateway...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PricingCard({
  title,
  price,
  amount,
  credits,
  description,
  features,
  popular,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount
}) {
  const isSelected = selectedPrice === amount;
  const isPayingThisCard = paying && payingAmount === amount;

  return (
    <motion.div
      onClick={() => setSelectedPrice(amount)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative cursor-pointer rounded-2xl p-8 bg-white flex flex-col justify-between
        border-2 transition-all duration-300 shadow-sm hover:shadow-md
        ${isSelected 
          ? "border-indigo-600 ring-4 ring-indigo-50" 
          : popular 
            ? "border-slate-200" 
            : "border-slate-100"}
      `}
    >
      {/* Decorative Badges */}
      {popular && (
        <span className='absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-sm'>
          Best Value
        </span>
      )}

      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className='text-xl font-bold text-slate-900'>{title}</h2>
          {isSelected && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
          )}
        </div>
        <p className='text-xs leading-relaxed text-slate-500 min-h-8'>{description}</p>

        {/* Pricing Layout */}
        <div className='my-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between'>
          <div>
            <span className="text-3xl font-black text-slate-900">{price}</span>
            <span className="text-xs text-slate-400 font-medium ml-1">one-time</span>
          </div>
          <span className="text-xs font-bold tracking-wide px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 uppercase">
            {credits}
          </span>
        </div>

        {/* Feature List */}
        <ul className='space-y-3 text-sm text-slate-600 mt-6'>
          {features.map((feature, i) => (
            <li key={i} className='flex items-start gap-3'>
              <svg className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button Action */}
      <div className="mt-8">
        <button
          disabled={paying}
          onClick={(e) => {
            e.stopPropagation();
            onBuy(amount);
          }}
          className={`
            w-full py-3 rounded-xl font-semibold tracking-wide transition-all duration-200 text-sm shadow-sm
            ${isPayingThisCard
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : isSelected
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-100 hover:shadow-lg"
                : "bg-slate-900 text-white hover:bg-slate-800"}
          `}
        >
          {isPayingThisCard ? "Processing..." : `Buy ${title}`}
        </button>
      </div>
    </motion.div>
  );
}

export default Pricing;