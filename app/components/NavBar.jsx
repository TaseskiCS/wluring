import React from 'react'
import { motion } from 'framer-motion'
import { GithubIcon } from "lucide-react";

const NavBar = () => {
  return (
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
        className="flex justify-between items-center px-2"
        >
        <motion.div
            animate={{ 
            rotate: [0, 360],
            transition: { 
                repeat: Infinity, 
                duration: 20, 
                ease: "linear" 
            } 
            }}
            className="relative"
        >
            <a href='/'>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500  to-purple-500 blur-xl opacity-30"></div>
                <img src='/wluring_white.png' className="w-20 relative z-10"  />

            </a>
            
        </motion.div>
        
        <a href='https://github.com/taseskics/wluring' target="_blank" rel="noopener noreferrer">
            <GithubIcon className="text-white ml-4" size={30} />
        </a>
    </motion.div>
  )
}

export default NavBar