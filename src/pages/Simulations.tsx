import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play, RotateCcw, Plus, Trash2, Cpu, Database, Shield, Zap, HardDrive, Disc, Info, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export const Simulations = () => {
  const [activeTab, setActiveTab] = useState<'scheduling' | 'allocation' | 'raid' | 'storage'>('scheduling');

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
        {(['scheduling', 'allocation', 'raid', 'storage'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2 rounded-xl font-bold transition-all",
              activeTab === tab 
                ? "bg-brand text-white shadow-lg shadow-brand/20" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'scheduling' && <DiskSchedulingSim />}
          {activeTab === 'allocation' && <FileAllocationSim />}
          {activeTab === 'raid' && <RAIDSim />}
          {activeTab === 'storage' && <HDDvsSSDSim />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const DiskSchedulingSim = () => {
  const [queue, setQueue] = useState<number[]>([98, 183, 37, 122, 14, 124, 65, 67]);
  const [head, setHead] = useState(53);
  const [algorithm, setAlgorithm] = useState<'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK'>('FCFS');
  const [results, setResults] = useState<any[]>([]);
  const [totalMovement, setTotalMovement] = useState(0);

  const calculate = () => {
    let order: number[] = [head];
    let tempQueue = [...queue];
    let currentHead = head;
    let max = 199;

    if (algorithm === 'FCFS') {
      order = [head, ...queue];
    } else if (algorithm === 'SSTF') {
      while (tempQueue.length > 0) {
        let closest = tempQueue.reduce((prev, curr) => 
          Math.abs(curr - currentHead) < Math.abs(prev - currentHead) ? curr : prev
        );
        order.push(closest);
        tempQueue = tempQueue.filter(q => q !== closest);
        currentHead = closest;
      }
    } else if (algorithm === 'SCAN') {
      const left = tempQueue.filter(x => x < head).sort((a, b) => b - a);
      const right = tempQueue.filter(x => x >= head).sort((a, b) => a - b);
      order = [head, ...right, max, ...left];
    } else if (algorithm === 'C-SCAN') {
      const left = tempQueue.filter(x => x < head).sort((a, b) => a - b);
      const right = tempQueue.filter(x => x >= head).sort((a, b) => a - b);
      order = [head, ...right, max, 0, ...left];
    } else if (algorithm === 'LOOK') {
       const left = tempQueue.filter(x => x < head).sort((a, b) => b - a);
       const right = tempQueue.filter(x => x >= head).sort((a, b) => a - b);
       order = [head, ...right, ...left];
    } else if (algorithm === 'C-LOOK') {
       const left = tempQueue.filter(x => x < head).sort((a, b) => a - b);
       const right = tempQueue.filter(x => x >= head).sort((a, b) => a - b);
       order = [head, ...right, ...left];
    }

    const data = order.map((pos, index) => ({
      request: index,
      position: pos,
    }));

    let movement = 0;
    for (let i = 1; i < order.length; i++) {
      movement += Math.abs(order[i] - order[i-1]);
    }

    setResults(data);
    setTotalMovement(movement);
  };

  useEffect(() => {
    calculate();
  }, [queue, head, algorithm]);

  const addRequest = (val: number) => {
    if (val >= 0 && val <= 199) setQueue([...queue, val]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="text-brand dark:text-brand-light" /> Controls
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Algorithm</label>
              <select 
                value={algorithm} 
                onChange={(e: any) => setAlgorithm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-slate-900 dark:text-slate-100"
              >
                {['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Initial Head (0-199)</label>
              <input 
                type="number" 
                value={head} 
                onChange={(e) => setHead(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Add Request</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="e.g. 150"
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-slate-900 dark:text-slate-100"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addRequest(Number((e.target as any).value));
                      (e.target as any).value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold mb-4">Queue</h3>
          <div className="flex flex-wrap gap-2">
            {queue.map((q, i) => (
              <span key={i} className="px-3 py-1 bg-brand/30 dark:bg-brand/10 text-brand-dark dark:text-brand rounded-lg flex items-center gap-2">
                {q}
                <button onClick={() => setQueue(queue.filter((_, idx) => idx !== i))}>
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="text-sm text-slate-500 uppercase font-bold mb-1">Total Head Movement</div>
            <div className="text-3xl font-black text-brand-600 dark:text-brand">{totalMovement}</div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[400px]">
        <h3 className="text-xl font-bold mb-6">Movement Visualization</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={results} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis type="number" domain={[0, 199]} />
            <YAxis type="number" dataKey="request" reversed hide />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="position" 
              stroke="#A19864" 
              strokeWidth={3} 
              dot={{ r: 6, fill: '#A19864', strokeWidth: 2, stroke: '#1e293b' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="lg:col-span-3 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                  <Info size={18} /> What are scheduling algorithms?
              </h5>
              <p className="text-sm text-slate-500 leading-relaxed">
                  Disk scheduling algorithms are strategies used by the Operating System to manage the order of pending disk I/O requests. Since disk heads must physically move, efficient order determines performance.
              </p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                  <Cpu size={18} /> Why use them?
              </h5>
              <p className="text-sm text-slate-500 leading-relaxed">
                  The goal is to minimize <b>Seek Time</b> (the time taken for the head to find a track). Optimized algorithms reduce mechanical wear and prevent the CPU from waiting too long for data.
              </p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h5 className="font-bold text-brand-600 dark:text-brand mb-2 flex items-center gap-2">
                  <Play size={18} /> How to use this simulator
              </h5>
              <ol className="text-sm text-slate-500 list-decimal ml-4 space-y-1">
                  <li>Pick an <b>Algorithm</b> (e.g., FCFS or SSTF).</li>
                  <li>Enter an <b>Initial Head</b> position.</li>
                  <li><b>Add/Remove</b> requests to the queue.</li>
                  <li>Compare the <b>Total Head Movement</b> results.</li>
              </ol>
          </div>
      </div>
    </div>
  );
};

const FileAllocationSim = () => {
  const [method, setMethod] = useState<'Contiguous' | 'Linked' | 'Indexed'>('Contiguous');
  const [blockSize] = useState(24);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [files, setFiles] = useState<{ name: string; color: string; blocks: number[] }[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: blockSize }).map((_, i) => ({ id: i, usedBy: null }));
    setBlocks(initial);
  }, []);

  const allocate = () => {
    const size = Math.floor(Math.random() * 4) + 2;
    const name = `File${files.length + 1}`;
    const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    let allocated: number[] = [];

    const freeIndices = blocks.map((b, i) => b.usedBy === null ? i : -1).filter(i => i !== -1);
    
    if (freeIndices.length < size) {
      alert("No space!");
      return;
    }

    if (method === 'Contiguous') {
      for (let i = 0; i <= blockSize - size; i++) {
        const span = blocks.slice(i, i + size);
        if (span.every(s => s.usedBy === null)) {
          allocated = Array.from({ length: size }).map((_, idx) => i + idx);
          break;
        }
      }
    } else {
      allocated = freeIndices.sort(() => Math.random() - 0.5).slice(0, size);
    }

    if (allocated.length > 0) {
      const newBlocks = [...blocks];
      allocated.forEach(idx => newBlocks[idx].usedBy = name);
      setBlocks(newBlocks);
      setFiles([...files, { name, color, blocks: allocated }]);
    } else {
      alert("Could not find continuous block!");
    }
  };

  const reset = () => {
    setBlocks(blocks.map(b => ({ ...b, usedBy: null })));
    setFiles([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex gap-4">
          <select 
            value={method} 
            onChange={(e: any) => setMethod(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 font-bold"
          >
            <option value="Contiguous">Contiguous</option>
            <option value="Linked">Linked</option>
            <option value="Indexed">Indexed</option>
          </select>
          <button 
            onClick={allocate}
            className="px-6 py-2 bg-brand-600 dark:bg-brand text-white rounded-xl font-bold flex items-center gap-2 hover:brightness-110"
          >
            <Plus size={18} /> Allocate File
          </button>
          <button 
            onClick={reset}
            className="px-6 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl font-bold flex items-center gap-2"
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase font-bold">Files Active</div>
          <div className="text-xl font-black">{files.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {blocks.map((block, i) => {
          const file = files.find(f => f.name === block.usedBy);
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "aspect-square rounded-2xl flex items-center justify-center font-bold text-lg border-2 transition-all",
                block.usedBy 
                  ? "border-transparent text-white" 
                  : "bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 text-slate-300"
              )}
              style={file ? { backgroundColor: file.color } : {}}
            >
              {i}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold mb-4">File Details</h4>
          <div className="space-y-4">
            {files.map(f => (
              <div key={f.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: f.color }} />
                  <span className="font-bold">{f.name}</span>
                </div>
                <div className="text-sm font-mono opacity-60">
                   {method === 'Linked' 
                     ? f.blocks.join(' → ') 
                     : method === 'Indexed' 
                       ? `Index ${f.blocks[0]} [${f.blocks.slice(1).join(', ')}]`
                       : `Blocks [${f.blocks.join(', ')}]`}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center">
          <Database size={48} className="text-brand-dark dark:text-brand mb-4" />
          <h4 className="font-bold text-xl mb-2">{method} Logic</h4>
          <p className="text-slate-500 max-w-xs">
            {method === 'Contiguous' && "Files must occupy a continuous set of blocks. Fast, but hard to grow files."}
            {method === 'Linked' && "Each block contains a pointer to the next block. No fragmentation, but slow direct access."}
            {method === 'Indexed' && "An index block holds pointers to all data blocks. Efficient direct access with no fragmentation."}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                  <Info size={18} /> What is file allocation?
              </h5>
              <p className="text-sm text-slate-500 leading-relaxed">
                  File allocation methods determine how the operating system stores file data in disk blocks. It defines the mapping between a logical file and the physical storage units (blocks).
              </p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                  <Database size={18} /> Why use it?
              </h5>
              <p className="text-sm text-slate-500 leading-relaxed">
                  Proper allocation ensures <b>efficient disk space usage</b> and <b>fast access speeds</b>. Different methods balance the trade-offs between fragmentation, access speed, and ease of file growth.
              </p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h5 className="font-bold text-brand-600 dark:text-brand mb-2 flex items-center gap-2">
                  <Play size={18} /> How to use this simulator
              </h5>
              <ol className="text-sm text-slate-500 list-decimal ml-4 space-y-1">
                  <li>Select an **Allocation Method** from the dropdown.</li>
                  <li>Click **Allocate File** to simulate saving a new file.</li>
                  <li>Observe how blocks are colored and linked in the grid.</li>
                  <li>Use **Reset** to start fresh with a different method.</li>
              </ol>
          </div>
      </div>
    </div>
  );
};

const RAIDSim = () => {
    const [level, setLevel] = React.useState<'0' | '1' | '5'>('0');
    const [drives, setDrives] = React.useState<any[][]>([[], [], []]);
    const [isWriting, setIsWriting] = React.useState(false);

    const reset = () => setDrives([[], [], []]);

    const writeData = async () => {
        if (isWriting) return;
        setIsWriting(true);
        
        const newDrives = [...drives];
        const dataCount = level === '5' ? 4 : 4;

        for (let i = 0; i < dataCount; i++) {
            await new Promise(r => setTimeout(r, 600));
            
            if (level === '0') {
                const driveIdx = i % 2;
                newDrives[driveIdx] = [...newDrives[driveIdx], { type: 'data', id: i }];
            } else if (level === '1') {
                newDrives[0] = [...newDrives[0], { type: 'data', id: i }];
                newDrives[1] = [...newDrives[1], { type: 'data', id: i }];
            } else if (level === '5') {
                const parityIdx = i % 3;
                const dataIndices = [0, 1, 2].filter(idx => idx !== parityIdx);
                newDrives[parityIdx] = [...newDrives[parityIdx], { type: 'parity', id: i }];
                dataIndices.forEach(idx => {
                    newDrives[idx] = [...newDrives[idx], { type: 'data', id: i }];
                });
            }
            setDrives([...newDrives]);
        }
        setIsWriting(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap gap-4 justify-between items-end">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="text-brand-dark dark:text-brand" />
                        RAID Simulator
                    </h3>
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                        {(['0', '1', '5'] as const).map(l => (
                            <button
                                key={l}
                                onClick={() => { setLevel(l); reset(); }}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    level === l 
                                    ? 'bg-brand text-white shadow-lg' 
                                    : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                RAID {l}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={reset}
                        className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={writeData}
                        disabled={isWriting}
                        className="px-6 py-2 rounded-xl bg-brand text-white font-bold hover:brightness-110 disabled:opacity-50"
                    >
                        {isWriting ? 'Writing...' : 'Write Data'}
                    </button>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[400px]">
                <div className="grid grid-cols-3 gap-8">
                    {[0, 1, 2].map(driveIdx => {
                        if (level !== '5' && driveIdx === 2) return null;
                        return (
                            <div key={driveIdx} className="flex flex-col items-center">
                                <div className="mb-4 text-slate-500 flex flex-col items-center">
                                    <Database size={32} className="mb-2" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Drive {String.fromCharCode(65 + driveIdx)}</span>
                                </div>
                                <div className="w-full h-64 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-2 flex flex-col-reverse gap-2 overflow-hidden shadow-inner">
                                    <AnimatePresence>
                                        {drives[driveIdx].map((block, i) => (
                                            <motion.div
                                                key={`${block.id}-${block.type}-${i}`}
                                                initial={{ scale: 0, y: -50 }}
                                                animate={{ scale: 1, y: 0 }}
                                                className={`h-12 rounded-lg flex items-center justify-center text-xs font-bold border-b-4 ${
                                                    block.type === 'parity'
                                                    ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-500 text-amber-700 dark:text-amber-300'
                                                    : 'bg-brand/30 dark:bg-brand/20 border-brand-dark text-slate-700 dark:text-brand'
                                                }`}
                                            >
                                                {block.type.toUpperCase()} {block.id}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 p-6 bg-brand text-white rounded-2xl">
                    <h4 className="font-black text-lg mb-2">
                        {level === '0' && "RAID 0: Striping"}
                        {level === '1' && "RAID 1: Mirroring"}
                        {level === '5' && "RAID 5: Distributed Parity"}
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed">
                        {level === '0' && "Data is split across drives for maximum performance. If one drive fails, ALL data is lost."}
                        {level === '1' && "Data is copied identically to both drives. If one fails, the other keeps everything safe."}
                        {level === '5' && "Data is split across 3+ drives with parity (checksums). Can survive 1 drive failure with optimal capacity."}
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h5 className="font-bold text-brand-600 dark:text-brand mb-2 flex items-center gap-2">
                            <Info size={18} /> What it's doing
                        </h5>
                        <p className="text-sm text-slate-500 italic">
                            This simulator visualizes how different RAID levels distribute data across multiple physical disks to achieve either speed or safety.
                        </p>
                    </div>
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h5 className="font-bold text-brand-600 dark:text-brand mb-2 flex items-center gap-2">
                            <Play size={18} /> How to execute
                        </h5>
                        <ol className="text-sm text-slate-500 list-decimal ml-4 space-y-1">
                            <li>Select a <b>RAID Level</b> (0, 1, or 5)</li>
                            <li>Click <b>Write Data</b> to start simulation</li>
                            <li>Watch how blocks and parity are placed</li>
                            <li>Use <b>Reset</b> to try a different level</li>
                        </ol>
                    </div>
                    <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h5 className="font-bold text-brand-600 dark:text-brand mb-2 flex items-center gap-2">
                            <BookOpen size={18} /> Real-world use
                        </h5>
                        <p className="text-sm text-slate-500">
                            RAID is used in servers and NAS devices to protect against hard drive failures and speed up data processing in large databases.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HDDvsSSDSim = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <HardDrive size={32} className="text-brand-dark dark:text-brand mb-4" />
                <h3 className="text-2xl font-bold mb-4">HDD Mechanism</h3>
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-full border-4 border-slate-300 dark:border-slate-700 relative overflow-hidden animate-spin-slow">
                   <div className="absolute inset-x-1/2 top-4 bottom-1/2 w-1 bg-slate-400 dark:bg-slate-600 origin-bottom" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-20">
                       <Disc size={200} />
                   </div>
                </div>
                <p className="mt-4 text-slate-500">Relies on moving arm and spinning disk. Slower access times (~4-15ms).</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Cpu size={32} className="text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4">SSD Mechanism</h3>
                <div className="aspect-square grid grid-cols-4 grid-rows-4 gap-2 p-8">
                   {Array.from({length: 16}).map((_, i) => (
                       <motion.div 
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
                        className="bg-purple-500/20 rounded-lg border border-purple-500/40"
                       />
                   ))}
                </div>
                <p className="mt-4 text-slate-500">Flash memory based. No moving parts. Near-instant access (&lt;0.1ms).</p>
            </div>

            <div className="md:col-span-2 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h5 className="font-bold mb-2 flex items-center gap-2">
                        <Info size={18} /> What it's doing
                    </h5>
                    <p className="text-sm text-slate-500 italic">
                        This comparison visualizes the fundamental difference between mechanical spinning disks (HDD) and electronic flash memory (SSD).
                    </p>
                </div>
                <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h5 className="font-bold mb-2 flex items-center gap-2">
                        <Play size={18} /> How to use it
                    </h5>
                    <ul className="text-sm text-slate-500 list-disc ml-4 space-y-1">
                        <li>Observe the <b>spinning disk</b> and moving arm in the HDD section.</li>
                        <li>Notice the <b>pulsing chips</b> in the SSD section representing electrical signals.</li>
                        <li>Compare the access speeds mentioned below each visual.</li>
                    </ul>
                </div>
                <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h5 className="font-bold mb-2 flex items-center gap-2">
                        <BookOpen size={18} /> Real-world use
                    </h5>
                    <p className="text-sm text-slate-500">
                        SSDs are used for fast booting and gaming, while HDDs are used in bulk storage servers where cost-per-GB is more important than speed.
                    </p>
                </div>
            </div>
        </div>
    );
}

const AnimatePresence = ({ children, mode }: any) => {
    // Basic implementation since we're using motion/react
    return <>{children}</>;
}
