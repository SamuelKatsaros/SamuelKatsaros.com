import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  ease?: number;
  refresh?: boolean;
}

export function Particles({
  className,
  quantity = 50,
  color = "#6b7280",
  maxSize = 4,
  speed = 1,
  ease = 80,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      originX: number;
      originY: number;
    }> = [];

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < quantity; i++) {
        const size = Math.random() * maxSize + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        particles.push({
          x,
          y,
          size,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          opacity: Math.random() * 0.7 + 0.3,
          originX: x,
          originY: y,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        // Draw the particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(")", `,${particle.opacity})`).replace("rgb", "rgba");
        ctx.fill();
        
        // Update position based on speed
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // If mouse is active, particles are drawn to cursor
        if (mouseActiveRef.current) {
          // Calculate direction to mouse
          const dx = mousePositionRef.current.x - particle.x;
          const dy = mousePositionRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If particle is within influence range of mouse
          if (distance < 120) {
            const influenceFactor = (1 - distance / 120) * 0.5;
            particle.x += (dx / distance) * influenceFactor;
            particle.y += (dy / distance) * influenceFactor;
          }
        } else {
          // If mouse is not active, gradually return to origin position
          particle.x += (particle.originX - particle.x) / ease;
          particle.y += (particle.originY - particle.y) / ease;
        }
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
          // Reset to edge to prevent getting stuck
          particle.x = particle.x < 0 ? 0 : canvas.width;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
          // Reset to edge to prevent getting stuck
          particle.y = particle.y < 0 ? 0 : canvas.height;
        }
      });
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    // Handle mouse events for particle interaction
    const handleMouseMove = (event: CustomEvent) => {
      mousePositionRef.current = { 
        x: event.detail.x, 
        y: event.detail.y 
      };
      mouseActiveRef.current = true;
      
      // Reset mouse active after a delay
      setTimeout(() => {
        mouseActiveRef.current = false;
      }, 2000);
    };

    // Add mousemove event listener for particle interaction
    document.addEventListener('particle-mousemove', handleMouseMove as EventListener);

    // Initialize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    drawParticles();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener('particle-mousemove', handleMouseMove as EventListener);
    };
  }, [quantity, color, maxSize, speed, ease, refresh]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 -z-10", className)}
    />
  );
}

export default Particles; 