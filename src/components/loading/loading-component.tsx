"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div
        className="relative w-20 h-20"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Outer circle */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/20"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner circle with gradient */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary border-r-primary"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="w-3 h-3 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
      
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <p className="text-lg font-semibold text-foreground">Memuat...</p>
        <p className="mt-1 text-sm text-muted-foreground">Menyiapkan data Anda</p>
      </motion.div>
    </div>
  )
}
