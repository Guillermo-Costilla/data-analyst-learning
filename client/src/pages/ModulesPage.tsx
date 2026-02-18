import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';
import { modules } from '../data/exercises';

const levelColor: Record<string, string> = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const levelBg: Record<string, string> = {
    Beginner: 'from-emerald-500/5',
    Intermediate: 'from-blue-500/5',
    Advanced: 'from-purple-500/5',
};

const levelLabel: Record<string, string> = {
    Beginner: 'Principiante',
    Intermediate: 'Intermedio',
    Advanced: 'Avanzado',
};

const ModulesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#070b14] text-white pt-24 pb-16 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-3">
                        <BookOpen className="w-4 h-4" />
                        Ruta de Aprendizaje
                    </div>
                    <h1 className="text-4xl font-extrabold mb-3">Módulos SQL</h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Un plan de estudios estructurado desde los fundamentos de SQL hasta análisis avanzado. Completá los ejercicios en orden para una mejor experiencia de aprendizaje.
                    </p>
                </motion.div>

                {/* Module List */}
                <div className="space-y-4">
                    {modules.map((mod, i) => (
                        <motion.div
                            key={mod.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                        >
                            <Link
                                to={`/modules/${mod.id}`}
                                className={`flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r ${levelBg[mod.level]} to-transparent bg-[#0d1424] border border-white/5 hover:border-blue-500/25 hover:bg-[#0f1830] transition-all duration-300 group`}
                            >
                                {/* Number + Icon */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                                    <span className="text-xs text-gray-600 font-mono">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-4xl">{mod.icon}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                            {mod.title}
                                        </h2>
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${levelColor[mod.level]}`}>
                                            {levelLabel[mod.level]}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{mod.description}</p>
                                </div>

                                {/* Right side */}
                                <div className="flex-shrink-0 flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{mod.exercises.length}</div>
                                        <div className="text-xs text-gray-500">ejercicios</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Total count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center text-gray-600 text-sm"
                >
                    {modules.reduce((acc: number, m) => acc + m.exercises.length, 0)} ejercicios en total en {modules.length} módulos
                </motion.div>
            </div>
        </div>
    );
};

export default ModulesPage;
