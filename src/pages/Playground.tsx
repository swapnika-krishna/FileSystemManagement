import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Play, Trash2, HelpCircle, Code2, Database, ChevronRight, Loader2, RotateCcw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const LANGUAGE_SAMPLES: Record<string, string> = {
  javascript: `// Disk Scheduling (JS)
function fcfs(head, queue) {
    let totalSeek = 0;
    let current = head;
    console.log("Path:");
    for(let req of queue) {
        totalSeek += Math.abs(req - current);
        console.log(\`Move to \${req}\`);
        current = req;
    }
    console.log("Total Seek:", totalSeek);
}
fcfs(50, [98, 183, 37, 122, 14, 124, 65, 67]);`,
  python: `# Disk Scheduling (Python)
def fcfs(head, queue):
    total_seek = 0
    current = head
    for req in queue:
        total_seek += abs(req - current)
        print(f"Move to {req}")
        current = req
    print(f"Total Seek: {total_seek}")

fcfs(50, [98, 183, 37, 122, 14, 124, 65, 67])`,
  java: `// Disk Scheduling (Java)
public class Main {
    public static void main(String[] args) {
        int head = 50;
        int[] queue = {98, 183, 37, 122, 14, 124, 65, 67};
        int totalSeek = 0;
        int current = head;
        for(int req : queue) {
            totalSeek += Math.abs(req - current);
            System.out.println("Move to " + req);
            current = req;
        }
        System.out.println("Total Seek: " + totalSeek);
    }
}`,
  cpp: `// Disk Scheduling (C++)
#include <iostream>
#include <vector>
#include <cmath>

int main() {
    int head = 50;
    std::vector<int> queue = {98, 183, 37, 122, 14, 124, 65, 67};
    int total_seek = 0;
    int current = head;
    for(int req : queue) {
        total_seek += std::abs(req - current);
        std::cout << "Move to " << req << std::endl;
        current = req;
    }
    std::cout << "Total Seek: " << total_seek << std::endl;
    return 0;
}`,
  c: `/* Disk Scheduling (C) */
#include <stdio.h>
#include <stdlib.h>

int main() {
    int head = 50;
    int queue[] = {98, 183, 37, 122, 14, 124, 65, 67};
    int total_seek = 0;
    int current = head;
    for(int i = 0; i < 8; i++) {
        total_seek += abs(queue[i] - current);
        printf("Move to %d\\n", queue[i]);
        current = queue[i];
    }
    printf("Total Seek: %d\\n", total_seek);
    return 0;
}`
};

export const Playground = () => {
  const [lang, setLang] = useState('c');
  const [code, setCode] = useState(LANGUAGE_SAMPLES.c);
  const [isExecuting, setIsExecuting] = useState(false);
  const [labOutput, setLabOutput] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);

  const resetCode = () => {
    setCode(LANGUAGE_SAMPLES[lang]);
    setLabOutput([]);
    setShowOutput(false);
  };

  const executeAlgorithm = async () => {
    setIsExecuting(true);
    setShowOutput(true);
    setLabOutput(["[System] Initializing Peterson Hypervisor...", "[System] Compiling source code..."]);
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Language: ${lang}\n\nCode:\n${code}`,
            config: {
                systemInstruction: `You are the Peterson Hypervisor, a specialized OS simulation environment.
Your task is to execute and simulate code provided in C, C++, Python, or Java.

Focus: Disk Scheduling Algorithms.
Response format:
- Start with [Hypervisor Status: OK]
- Provide step-by-step trace of disk head movement.
- End with Total Seek Count and Average Time.
- Keep it concise and technical.`
            }
        });

        const lines = response.text?.split('\n').filter(l => l.trim() !== '') || ["Error: Simulator timed out."];
        setLabOutput(prev => [...prev, "[Run] Starting execution...", ...lines, "[Status] ready_"]);
    } catch (error) {
        setLabOutput(prev => [...prev, "[Fatal] Hypervisor crash.", error instanceof Error ? error.message : String(error)]);
    } finally {
        setIsExecuting(false);
    }
  };

  return (
    <div className="font-sans selection:bg-brand/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-sm font-black tracking-widest uppercase flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                Switch Sandbox
            </h1>
            
            <div className="flex items-center gap-2 bg-[#161b22] p-1 rounded-xl border border-slate-800">
                {['c', 'cpp', 'python', 'java'].map((l) => (
                    <button
                        key={l}
                        onClick={() => {
                            setLang(l);
                            setCode(LANGUAGE_SAMPLES[l]);
                        }}
                        className={cn(
                            "px-6 py-2 rounded-lg text-xs font-black transition-all uppercase tracking-widest",
                            lang === l 
                                ? "bg-brand text-white shadow-lg" 
                                : "text-slate-500 hover:text-slate-200"
                        )}
                    >
                        {l === 'cpp' ? 'c++' : l}
                    </button>
                ))}
            </div>
        </div>

        {/* Main Editor Frame */}
        <div className="relative group">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative bg-[#0d1117] border border-[#30363d] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
                {/* Editor Header */}
                <div className="bg-[#161b22] px-8 py-4 border-b border-[#30363d] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-[#8b949e] font-mono text-xs flex items-center gap-2">
                            <ChevronRight size={14} className="text-pink-500" />
                            PETERSON_HYPERVISOR_ACTIVE
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#30363d]" />
                        <div className="w-3 h-3 rounded-full bg-[#30363d]" />
                        <div className="w-3 h-3 rounded-full bg-[#30363d]" />
                    </div>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 flex flex-col relative">
                    <textarea 
                        className="flex-1 bg-transparent p-10 font-mono text-lg text-[#ff7b72] focus:outline-none resize-none leading-relaxed overflow-y-auto"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                    />

                    {/* Output Overlay (Optional) */}
                    <AnimatePresence>
                        {showOutput && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-x-8 bottom-24 bg-[#161b22]/95 backdrop-blur border border-pink-500/30 rounded-2xl p-6 shadow-2xl max-h-[300px] overflow-y-auto font-mono text-sm z-20"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-pink-500 font-bold uppercase tracking-tighter text-xs">Terminal Output</span>
                                    <button onClick={() => setShowOutput(false)} className="text-slate-500 hover:text-white">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {labOutput.map((line, i) => (
                                        <div key={i} className={cn(
                                            line.startsWith("[System]") ? "text-slate-500" : 
                                            line.startsWith("[Fatal]") ? "text-red-400" : "text-green-400"
                                        )}>
                                            {line}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Editor Footer Actions */}
                <div className="bg-[#161b22]/50 px-8 py-6 border-t border-[#30363d] flex items-center justify-between">
                    <button 
                        onClick={resetCode}
                        className="flex items-center gap-2 text-[#8b949e] hover:text-[#c9d1d9] text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        <RotateCcw size={14} />
                        Reset
                    </button>

                    <button 
                        onClick={executeAlgorithm}
                        disabled={isExecuting}
                        className="flex items-center gap-3 bg-brand hover:brightness-110 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-tighter transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                        {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                        Execute
                    </button>
                </div>

                {/* Ready Status Bar */}
                <div className="bg-[#0d1117] px-8 py-3 border-t border-[#30363d] flex items-center gap-2">
                    <span className="text-[#8b949e] font-mono text-[10px]">&gt; ready_</span>
                </div>
            </div>
        </div>

        {/* Additional Info (Optional) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-500">
            <div className="p-6 rounded-2xl border border-slate-800/50">
                <h4 className="font-bold mb-2 uppercase tracking-wide">Virtual Core</h4>
                <p>Execution is simulated in a sandboxed hypervisor environment optimized for disk scheduling trace analysis.</p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800/50">
                <h4 className="font-bold mb-2 uppercase tracking-wide">Disk Geometry</h4>
                <p>Default range 0-199. You can override head position and queue parameters directly in your script.</p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-800/50">
                <h4 className="font-bold mb-2 uppercase tracking-wide">Output Logs</h4>
                <p>Includes total seek count and step-by-step movement path for accurate performance benchmarking.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
