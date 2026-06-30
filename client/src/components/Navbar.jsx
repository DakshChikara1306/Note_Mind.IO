import React, { useState } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { serverUrl } from '../App';

const Navbar = () => {
    // Fallback safe data extraction
    const { userData } = useSelector((state) => state.user || {});
    const credits = userData?.credits || 0;
    const userInitial = userData?.name?.charAt(0)?.toUpperCase() || "U";
    
    const [showCredits, setShowCredits] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Placeholder for your logout logic
    const handleSignOut = async () => {
        try{
            await axios.get(serverUrl + "/api/auth/logout", {withCredentials: true});
            dispatch(setUserData(null)); // Clear user data from Redux store
            navigate("/auth"); // Redirect to login page
        }catch(err){
                console.error("Sign Out Error:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-50 mx-4 md:mx-6 mt-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between px-6 py-4"
        >
            {/* Logo Section */}
            <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer select-none">
                <img src={logo} alt="examnotes" className="w-9 h-9 object-contain" />
                <span className="text-xl hidden md:block font-bold tracking-tight text-white">
                    Note_Mind <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">.IO</span>
                </span>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-4">
                
                {/* Credits Widget */}
                <div className="relative">
                    <motion.div 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setShowCredits(!showCredits);
                            setShowProfile(false); // Close other dropdown
                        }}
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/6 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors cursor-pointer select-none"
                    >
                        <span className="text-base text-cyan-400">💠</span>
                        <span>{credits} <span className="text-xs text-gray-400 font-normal">credits</span></span>
                        <motion.span
                            whileHover={{ scale: 1.15 }}
                            className="ml-1 h-5 w-5 flex items-center justify-center rounded-md bg-white text-black text-[10px] font-black"
                        >
                            ➕
                        </motion.span>
                    </motion.div>

                    {/* Credits Dropdown */}
                    <AnimatePresence>
                        {showCredits && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-3 w-72 rounded-2xl bg-zinc-950 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.7)] p-5 text-white z-50"
                            >
                                <h4 className="font-semibold text-base mb-1.5 flex items-center gap-2">
                                    <span>💎</span> Buy Credits
                                </h4>
                                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                                    Power up your workspace. Use credits to generate automated AI notes, instant diagrams, and flawless PDFs.
                                </p>
                                <button
                                    onClick={() => navigate("/pricing")}
                                    className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all shadow-md active:scale-[0.99]"
                                >
                                    Buy More Credits
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Avatar Widget */}
                <div className="relative">
                    <motion.div  
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowCredits(false); // Close other dropdown
                        }}
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-inner cursor-pointer select-none"
                    >
                        <span>{userInitial}</span>
                    </motion.div>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-3 w-64 rounded-2xl bg-zinc-950 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.7)] p-3 text-white z-50"
                            >
                                <div className="px-3 py-2.5">
                                    <p className="text-xs text-zinc-400 font-medium">Signed in as</p>
                                    <p className="text-sm font-semibold truncate text-zinc-100">{userData?.name || "User Name"}</p>
                                </div>
                                
                                <div className="h-px bg-white/10 my-1.5" />
                                <button onClick={() =>{setShowProfile(false); navigate("/history")}} className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-white-bold-400 hover:bg-green-500/10 transition-colors flex items-center gap-2">
                                    <span>📚</span> History
                                </button>
                                
                                <button 
                                    onClick={handleSignOut}
                                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                >
                                    <span>🚪</span> Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </motion.div>
    );
};

export default Navbar;