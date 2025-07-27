'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function LoadingSpinner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const duration = 2; // 2 seconds for bird animation
  const [showBird, setShowBird] = useState(true);
  const [showSquiggly, setShowSquiggly] = useState(true);

  useEffect(() => {
    // Check for theme on mount and listen for changes
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

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
      ctx.strokeStyle = isDark ? 'rgb(255, 144, 232)' : 'rgb(195, 11, 78)'; // dark-accent / light-accent
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
  
  const colors = {
    crest: theme === 'light' ? '#C30B4E' : '#D078C0',
    face: theme === 'light' ? '#fff2ff' : '#f5f5f5', 
    cheek: theme === 'light' ? '#e7e7e7' : '#d0d0d0',
    upperLip: theme === 'light' ? '#f7ce42' : '#ffd700',
    lowerLip: theme === 'light' ? '#f7a500' : '#ff8c00',
    eye: '#18233e'
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div className="relative">
        {/* Outer mathematical animation */}
        {showSquiggly && (
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
        )}
        
        {/* Inner bird animation - positioned absolutely in the center */}
        {showBird && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-24 h-24 overflow-hidden">
              {/* Crest - outer semicircle using accent color */}
              <motion.div
                className="absolute inset-0 m-auto w-full h-full rounded-full overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.crest} 50%, transparent 50%)`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat'
                }}
                animate={{ rotate: [0, 180, 180, 360, 360] }}
                transition={{
                  duration,
                  repeat: Infinity,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "linear"
                }}
              />

              {/* Face - theme-aware semicircle */}
              <motion.div
                className="absolute inset-0 m-auto rounded-full overflow-hidden"
                style={{
                  width: '65%',
                  height: '65%',
                  backgroundImage: `linear-gradient(to right, ${colors.face} 50%, transparent 50%)`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat'
                }}
                animate={{ rotate: [0, -180, -180, -360, -360] }}
                transition={{
                  duration,
                  repeat: Infinity,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "linear"
                }}
              />

              {/* Cheek - theme-aware quarter circle */}
              <motion.div
                className="absolute inset-0 m-auto rounded-full overflow-hidden"
                style={{
                  width: '65%',
                  height: '65%',
                  backgroundImage: `linear-gradient(to right, ${colors.cheek} 50%, transparent 50%, transparent 100%)`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  maskImage: 'linear-gradient(to bottom, transparent 50%, black 50%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 50%, black 50%)'
                }}
                animate={{ rotate: [90, -90, -90, -360, -360] }}
                transition={{
                  duration,
                  repeat: Infinity,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "linear"
                }}
              />

              {/* Upper Lip - enhanced for dark mode */}
              <motion.div
                className="absolute inset-0 m-auto rounded-full overflow-hidden"
                style={{
                  width: '65%',
                  height: '65%',
                  backgroundImage: `linear-gradient(to right, ${colors.upperLip} 50%, transparent 50%)`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  maskImage: 'linear-gradient(to bottom, black 50%, transparent 50%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 50%)'
                }}
                animate={{ rotate: [90, 0, 0, 90, 90] }}
                transition={{
                  duration,
                  repeat: Infinity,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "linear"
                }}
              />

              {/* Lower Lip - enhanced for dark mode */}
              <motion.div
                className="absolute inset-0 m-auto rounded-full overflow-hidden"
                style={{
                  width: '35%',
                  height: '35%',
                  backgroundImage: `linear-gradient(to right, ${colors.lowerLip} 50%, transparent 50%)`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  maskImage: 'linear-gradient(to bottom, black 50%, transparent 50%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 50%)'
                }}
                animate={{ rotate: [180, 270, 270, 180, 180] }}
                transition={{
                  duration,
                  repeat: Infinity,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "linear"
                }}
              />

              {/* Eye - theme-aware circle */}
              <motion.div
                className="absolute w-[15%] h-[15%] rounded-full"
                style={{
                  backgroundColor: colors.eye,
                  top: '50%',
                  left: '50%',
                  marginTop: '-7.5%',
                  marginLeft: '-7.5%'
                }}
                animate={{
                  x: ['-60%', '60%', '60%', '-60%', '-60%'],
                  y: ['-60%', '-60%', '-60%', '-60%', '-60%']
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "linear"
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}