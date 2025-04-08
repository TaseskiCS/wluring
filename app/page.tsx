"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {Plus, Loader, ArrowRight, Link as LinkIcon } from "lucide-react";
import { RingItem } from "./types/RingItem";
import NavBar from "./components/NavBar";

export default function Home() {
  const [ringItems, setRingItems] = useState<RingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fetch existing RingItems
  useEffect(() => {
    const fetchRingItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/RingItems.json");
        const data = await response.json();
        setRingItems(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching ring items", err);
        setError("Error fetching ring items.");
      } finally {
        setLoading(false);
      }
    };

    fetchRingItems();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      } 
    }
  };

  // Animated background gradient
  const gradientColors = [
    "from-indigo-400 via-purple-500 to-pink-500",
    "from-green-400 via-blue-500 to-purple-600",
    "from-yellow-400 via-red-500 to-pink-500",
    "from-blue-400 via-indigo-500 to-purple-600"
  ];

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8 md:px-8">
      <NavBar />
      
      {/* Background decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        <header className="text-center mb-16 pt-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { 
                duration: 0.6,
                ease: "easeOut"
              } 
            }}
            className="inline-flex items-center mb-4"
          >
           
            <h1 className="text-5xl font-bold ml-4 bg-clip-text p-2 text-transparent bg-gradient-to-r from-purple-500  to-yellow-500">
              <a href='https://laurier.ca' target="_blank" rel="noopener noreferrer">WLU</a> Webring
            </h1>
          </motion.div>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Join the webring of Laurier Students and Alumni, staying connected through our websites!
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { repeat: Infinity, duration: 1.5, ease: "linear" }
              }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-lg opacity-30"></div>
              <Loader className="text-white relative z-10" size={40} />
            </motion.div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/30 border border-red-800/50 text-red-300 p-6 rounded-lg mb-8 text-center"
          >
            {error}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-16 relative"
          >
            {/* Background decorative elements */}
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            
            {/* Webring table */}
            <div className="flex justify-center text-xl font-bold bg-clip-text p-2 text-transparent bg-gradient-to-r from-purple-500  to-yellow-500"><h2>Connected Personnel</h2></div>
            <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl overflow-hidden">
              <motion.div className="grid gap-px divide-y divide-white/10">
                {ringItems.map((item, index) => {
                  const gradientClass = gradientColors[index % gradientColors.length];
                  
                  return (
                    <motion.a
                      key={item.username}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={itemVariants}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="group relative overflow-hidden"
                    >
                      {/* Hover effect background */}
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      />
                      
                      <div className="grid grid-cols-12 p-6 relative z-10">
                        {/* Username badge */}
                        <div className="col-span-12 md:col-span-4 flex items-center mb-3 md:mb-0">
                          <motion.div 
                            variants={iconVariants}
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r ${gradientClass}`}
                          >
                            <LinkIcon size={14} className="text-white" />
                          </motion.div>
                          <div>
                            <h3 className="font-bold text-white text-lg">
                              {item.displayName}
                            </h3>
                            <div className="text-gray-400 text-xs">@{item.username}</div>
                          </div>
                        </div>
                        
                        {/* URL */}
                        <div className="col-span-8 md:col-span-6 flex items-center">
                          <div className="text-gray-300 font-mono text-sm truncate">
                            {item.url.replace(/(^\w+:|^)\/\//, '')}
                          </div>
                        </div>
                        
                        {/* Graduation */}
                        <div className="col-span-4 md:col-span-2 flex items-center justify-end">
                          <div className="bg-white/10 rounded-full px-3 py-1 text-xs text-white">
                            {item.grad_date}
                          </div>
                          
                          {/* Arrow icon */}
                          <motion.div
                            animate={hoveredIndex === index ? { 
                              x: [0, 5, 0],
                              transition: { 
                                repeat: Infinity, 
                                duration: 1.5 
                              }
                            } : {}}
                            className="text-white/40 group-hover:text-white transition-colors ml-3"
                          >
                            <ArrowRight size={18} />
                          </motion.div>
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center items-center flex-col"
        >
          <a href="/form">
            <button className="flex items-center bg-gradient-to-r mb-4 from-yellow-500  to-purple-500 text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
              <Plus size={18} className="mr-2" />
              Join the webring
            </button>
          </a>

        <div className="flex flex-col items-center text-gray-400 text-sm">
          <h2>
              <span className="text-gray-400 text-sm ml-4">
                * By joining, you agree to share your website with the webring.
              </span>
              
            </h2>

        </div>
        </motion.div>
      </motion.div>
    </div>
  );
}