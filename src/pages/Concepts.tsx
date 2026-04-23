import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { THEORY_TOPICS } from '../constants/theory';

export const Concepts = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Theory Master</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Explore the fundamental concepts of Secondary Storage Structure. Click on any topic to dive deeper into the detailed theory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEORY_TOPICS.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/concepts/${topic.id}`}
              className="group block h-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-brand transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand/20 dark:bg-brand/10 rounded-2xl text-brand-700 dark:text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                  <BookOpen size={24} />
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-brand-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                {topic.title}
              </h3>
              <p className="mt-3 text-sm text-slate-500 line-clamp-2">
                {topic.content[0].length > 100 ? topic.content[0].substring(0, 100) + '...' : topic.content[0]}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

