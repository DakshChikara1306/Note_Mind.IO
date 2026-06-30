import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function Footer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="z-10 mx-4 sm:mx-6 mb-6 mt-28 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 px-6 sm:px-10 py-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
    >
      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 items-start">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4 sm:col-span-2">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group w-fit"
          >
            <img src={logo} alt="logo" className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="text-lg font-bold tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Note_Mind <span className="text-zinc-500 font-medium">.IO</span>
            </span>
          </div>
          <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-normal">
            Empolying intelligent automated frameworks to generate highly optimized, 
            exam-focused notes, structured revision modules, and visual architecture mappings instantly.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col items-start text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">Product Links</h2>
          <ul className="space-y-3 text-sm font-medium">
            <li
              onClick={() => navigate("/notes")}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer hover:underline underline-offset-4"
            >
              Notes Dashboard
            </li>
            <li
              onClick={() => navigate("/history")}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer hover:underline underline-offset-4"
            >
              History Logs
            </li>
            <li
              onClick={() => navigate("/pricing")}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer hover:underline underline-offset-4"
            >
              Add Credits
            </li>
          </ul>
        </div>

        {/* Support/Account Column */}
        <div className="flex flex-col items-start text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">Support & Account</h2>
          <ul className="space-y-3 text-sm font-medium">
            <li
              onClick={() => navigate("/auth")}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer hover:underline underline-offset-4"
            >
              Sign In
            </li>
            <li
              onClick={handleSignOut}
              className="text-red-400/90 hover:text-red-400 transition-colors cursor-pointer hover:underline underline-offset-4"
            >
              Sign Out
            </li>
            <li>
              <a 
                href="mailto:support@examnotes.com" 
                className="text-zinc-300 hover:text-white transition-colors hover:underline underline-offset-4"
              >
                support@examnotes.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 h-px bg-zinc-800/60" />
      
      {/* Footer Bottom copyright note */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500 font-normal">
          &copy; {new Date().getFullYear()} Note_Mind .IO. All rights reserved.
        </p>
        <p className="text-xs text-zinc-600 font-normal">
          Engineered for rapid workflow mastery.
        </p>
      </div>
    </motion.footer>
  );
}

export default Footer;