import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HardDrive, Server, ShieldCheck, Zap } from 'lucide-react';

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none">
          Master Secondary Storage Structures Like Never Before
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 font-medium">
          The ultimate interactive platform for learning OS Mass-Storage, Disk Scheduling, and File Systems.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/concepts"
            className="px-8 py-4 bg-brand text-white rounded-2xl font-bold text-lg hover:brightness-110 transition-all hover:scale-105 shadow-xl shadow-brand/20"
            id="start-learning-btn"
          >
            Start Learning
          </Link>
          <Link
            to="/simulations"
            className="px-8 py-4 bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-light border-2 border-brand-600 dark:border-brand-light/40 rounded-2xl font-bold text-lg hover:bg-brand/5 dark:hover:bg-slate-700 transition-all hover:scale-105"
            id="simulations-btn"
          >
            Simulations
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-24 w-full">
        <FeatureCard 
          icon={HardDrive} 
          title="Deep Theory" 
          desc="Comprehensive guides on HDD, SSD, and Disk Structures."
          delay={0.1}
        />
        <FeatureCard 
          icon={Zap} 
          title="Live Simulations" 
          desc="Visualize Disk Scheduling algorithms in real-time."
          delay={0.2}
        />
        <FeatureCard 
          icon={ShieldCheck} 
          title="RAID & Protection" 
          desc="Understand how data stays safe and redundant."
          delay={0.3}
        />
        <FeatureCard 
          icon={Server} 
          title="Playground" 
          desc="Experiment with file system commands in our terminal."
          delay={0.4}
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-brand transition-colors group"
  >
    <div className="w-12 h-12 rounded-2xl bg-brand/20 dark:bg-brand/10 flex items-center justify-center text-brand-dark dark:text-brand mb-4 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400">{desc}</p>
  </motion.div>
);
