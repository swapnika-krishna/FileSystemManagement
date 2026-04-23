import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HardDrive, File, Database, Play, Disc } from 'lucide-react';

const icons = [HardDrive, File, Database, Play, Disc];

export const ParticleBackground = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 20,
      iconIndex: Math.floor(Math.random() * icons.length),
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] opacity-10 dark:opacity-20">
      {particles.map((p) => {
        const Icon = icons[p.iconIndex];
        return (
          <motion.div
            key={p.id}
            initial={{ scale: 0, x: `${p.x}%`, y: `${p.y}%` }}
            animate={{
              y: [`${p.y}%`, `${(p.y + 20) % 100}%`, `${p.y}%`],
              x: [`${p.x}%`, `${(p.x + 10) % 100}%`, `${p.x}%`],
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute"
            style={{ width: p.size, height: p.size }}
          >
            <Icon size={p.size} />
          </motion.div>
        );
      })}
    </div>
  );
};
