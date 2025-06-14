'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function LoadingSpinner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get device pixel ratio for high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const size = 300;
    
    // Set canvas size accounting for device pixel ratio
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    
    // Scale the canvas back down using CSS
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    
    // Scale the drawing context so everything draws at the higher resolution
    ctx.scale(dpr, dpr);

    // Animation parameters
    const N = 360;
    const n = 7;
    const R = 95;
    let t = 0;

    const drawCircle = (q: number) => {
      ctx.beginPath();
      
      for (let i = 0; i < N; i++) {
        const th = (i * 2 * Math.PI) / N;
        const os = Math.cos(th - 2 * Math.PI * t);
        const osNormalized = (os + 1) / 2; // map from [-1,1] to [0,1]
        const osEased = 0.125 * Math.pow(osNormalized, 2.75);
        const r = R * (1 + osEased * Math.cos(n * th + 1.5 * 2 * Math.PI * t + q));
        
        const x = r * Math.sin(th);
        const y = -r * Math.cos(th);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
    };

    const drawCircles = () => {
      drawCircle(0);
      drawCircle(Math.PI);
    };

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Center the drawing
      ctx.save();
      ctx.translate(size / 2, size / 2);
      
      // Check if dark mode
      const isDark = document.documentElement.classList.contains('dark');
      
      // Draw main circles with accent colors
      ctx.strokeStyle = isDark ? 'rgb(255, 144, 232)' : 'rgb(195, 11, 78)'; // gumroad-pink / light-accent
      ctx.lineWidth = 4;
      drawCircles();
      
      ctx.restore();
      
      // Update time
      t += 0.008; // Slower animation
      if (t > 1) t = 0;
      
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function
    return () => {
      // Animation will stop when component unmounts
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <canvas
          ref={canvasRef}
          className="w-[200px] h-[200px]"
          style={{ imageRendering: 'auto' }}
        />
      </motion.div>
    </div>
  );
}