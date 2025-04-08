"use client"

import React, {use, useState} from 'react'
import { RingItem } from "../types/RingItem";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Send, Check, User, Globe, Calendar, Loader, ArrowRight } from "lucide-react";
import { AuthOTP } from '../types/auth';

const FormPage = () => {
  const [ringItem, setRingItem] = useState<RingItem>({
    username: "",
    displayName: "",
    url: "",
    grad_date: "",
  });

  const [authOTP, setAuthOTP] = useState<AuthOTP>({
    otp: "",
    email: "",
  });
  
    
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const emailRegex = /^[a-z]{4}\d{4}@mylaurier\.ca$/i;



  const handleSubmit = async () => {
    if (!ringItem.displayName || !ringItem.url || !ringItem.grad_date) {
      toast("Please fill in all fields!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send the new data to the endpoint
      const response = await fetch("/api/createPR", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ringItem),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to submit the data.");
      }
      setSubmitted(true);
    } catch (err) {
      setError("An error occurred while submitting the ring item.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const sendOTP = async () => {
    setLoading(true);
    setError(null);
    const emailRegex = /^[a-z]{4}\d{4}@mylaurier\.ca$/i;  // check laurier email format

    if (!emailRegex.test(authOTP.email)) {
        setError("Put in a Laurier email");
        setLoading(false);
        return;
    }
    try {
      const response = await fetch("/api/sendOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authOTP.email }),
      });
      const data = await response.json();
      if (data.success) {
        toast("OTP sent to your email!");
        setPendingVerification(true);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while sending the OTP.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authOTP.email,
          otp: authOTP.otp.toString(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowForm(true);
        setPendingVerification(false);
        toast("OTP verified successfully!");
        setAuthOTP({ ...authOTP, otp: "" });
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while verifying the OTP.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setAuthOTP({ ...authOTP, email });

    // realtime error checking
    if (!emailRegex.test(email)) {
      setError("Email must be in the format abcd1234@mylaurier.ca");
      setEmailValid(false);
    } else {
      setError(null); 
      setEmailValid(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10 md:px-8">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
            Join the wluring
          </h1>
          <p className="text-gray-400">
            Connect your website to Laurier's community webring
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-6 md:p-8 relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl"></div>

          {/* Email verification step */}
          {!showForm && !pendingVerification && (
            <motion.div
              variants={containerVariants}
              className="relative z-10 space-y-6"
            >
              <motion.div variants={itemVariants} className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
                  <Mail size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Verify Your Laurier Email</h2>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="name####@mylaurier.ca" 
                    value={authOTP.email}
                    onChange={handleEmailChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
                
                {emailValid && (
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={sendOTP} 
                    className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                  >
                    <Send size={18} className="mr-2" />
                    Send Verification Code
                  </motion.button>
                )}
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm flex items-center"
                  >
                    <span className="bg-red-400/10 p-1 rounded-full mr-2">
                      <ArrowRight size={12} className="text-red-400" />
                    </span>
                    {error}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* OTP verification step */}
          {!showForm && pendingVerification && (
            <motion.div
              variants={containerVariants}
              className="relative z-10 space-y-6"
            >
              <motion.div variants={itemVariants} className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
                  <Check size={24} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Enter Verification Code</h2>
                <p className="text-gray-400 text-sm mt-2">We've sent a code to {authOTP.email}</p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Enter verification code" 
                  value={authOTP.otp} 
                  onChange={(e) => setAuthOTP({ ...authOTP, otp: e.target.value })} 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-center text-lg font-mono tracking-wide text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                
                <motion.button 
                  onClick={handleVerify} 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  Verify Code
                </motion.button>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm flex items-center"
                  >
                    <span className="bg-red-400/10 p-1 rounded-full mr-2">
                      <ArrowRight size={12} className="text-red-400" />
                    </span>
                    {error}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Main form */}
          {!pendingVerification && showForm && !submitted && (
            <motion.div
              variants={containerVariants}
              className="relative z-10 space-y-5"
            >
              <motion.div variants={itemVariants} className="text-center mb-6">
                <h2 className="text-xl font-bold text-white">Add Your Website</h2>
                <p className="text-gray-400 text-sm mt-1">Fill in your details to join the webring</p>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={ringItem.username}
                  onChange={(e) => setRingItem({ ...ringItem, username: e.target.value })}
                  placeholder="Username"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={ringItem.displayName}
                  onChange={(e) => setRingItem({ ...ringItem, displayName: e.target.value })}
                  placeholder="Display Name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <Globe size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={ringItem.url}
                  onChange={(e) => setRingItem({ ...ringItem, url: e.target.value })}
                  placeholder="Website URL (https://...)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <Calendar size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={ringItem.grad_date}
                  onChange={(e) => setRingItem({ ...ringItem, grad_date: e.target.value })}
                  placeholder="Graduation Year"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </motion.div>

              <motion.button
                variants={itemVariants}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Loader size={18} className="mr-2" />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Join Webring
                  </>
                )}
              </motion.button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm flex items-center"
                >
                  <span className="bg-red-400/10 p-1 rounded-full mr-2">
                    <ArrowRight size={12} className="text-red-400" />
                  </span>
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Success message */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 relative z-10"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check size={40} className="text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-6">Successfully Submitted!</h2>
              
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-5 mb-6">
                <div className="grid gap-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Username:</span>
                    <span className="text-white font-medium">{ringItem.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Display Name:</span>
                    <span className="text-white font-medium">{ringItem.displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Website:</span>
                    <span className="text-white font-medium truncate max-w-xs">{ringItem.url}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Graduation Year:</span>
                    <span className="text-white font-medium">{ringItem.grad_date}</span>
                  </div>
                </div>
              </div>
              
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                Back to Webring
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FormPage;
    