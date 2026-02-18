import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, CheckCircle, BookOpen, Code2, ClipboardList, ChevronDown } from 'lucide-react';
import { getModuleById } from '../data/exercises';

const levelColor: Record<string, string> = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};
const levelLabel: Record<string, string> = {
    Beginner: 'Principiante', Intermediate: 'Intermedio', Advanced: 'Avanzado',
};

const ModuleDetailPage: React.FC = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const mod = getModuleById(moduleId || '');
    const [openTheory, setOpenTheory] = useState<number | null>(0);

    if (!mod) return <Navigate to="/modules" replace />;

    return (
        <div className="min-h-screen bg-[#070b14] text-white pt-24 pb-16 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Back */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Link to="/modules" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Todos los Módulos
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{mod.icon}</span>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-extrabold">{mod.title}</h1>
                                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${levelColor[mod.level]}`}>
                                    {levelLabel[mod.level]}
                                </span>
                            </div>
                            <p className="text-gray-400">{mod.description}</p>
                        </div>
                    </div>

                    {/* Stats bar */}
                    <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/15 text-blue-400 text-xs">
                            <BookOpen className="w-3.5 h-3.5" />
                            {mod.theory.length} secciones de teoría
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs">
                            <Code2 className="w-3.5 h-3.5" />
                            {mod.exercises.length} ejercicios prácticos
                        </div>
                        {mod.test && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15 text-amber-400 text-xs">
                                <ClipboardList className="w-3.5 h-3.5" />
                                Prueba técnica
                            </div>
                        )}
                    </div>
                    <div className="h-px bg-white/5 mt-6" />
                </motion.div>

                {/* ── TEORÍA ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <h2 className="text-lg font-bold text-white">Teoría</h2>
                    </div>
                    <div className="space-y-3">
                        {mod.theory.map((section, i) => (
                            <div key={i} className="rounded-xl border border-white/5 bg-[#0d1424] overflow-hidden">
                                <button
                                    onClick={() => setOpenTheory(openTheory === i ? null : i)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
                                >
                                    <span className="font-medium text-white">{section.title}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openTheory === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openTheory === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 border-t border-white/5">
                                                {/* Content text */}
                                                <div className="mt-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                                    {section.content.split('\n').map((line, li) => {
                                                        if (line.startsWith('**') && line.endsWith('**')) {
                                                            return <p key={li} className="font-semibold text-white mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
                                                        }
                                                        if (line.startsWith('- ')) {
                                                            return <p key={li} className="ml-3 text-gray-400">• {line.slice(2)}</p>;
                                                        }
                                                        if (line === '') return <br key={li} />;
                                                        // inline bold
                                                        const parts = line.split(/(\*\*[^*]+\*\*)/g);
                                                        return (
                                                            <p key={li} className="mb-1">
                                                                {parts.map((p, pi) =>
                                                                    p.startsWith('**') ? <strong key={pi} className="text-white font-semibold">{p.replace(/\*\*/g, '')}</strong> : p
                                                                )}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                                {/* Code example */}
                                                {section.codeExample && (
                                                    <div className="mt-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                                                            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Ejemplo de código</span>
                                                        </div>
                                                        <pre className="bg-[#070b14] border border-white/5 rounded-xl p-4 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
                                                            <code>{section.codeExample}</code>
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── EJERCICIOS ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Code2 className="w-4 h-4 text-emerald-400" />
                        <h2 className="text-lg font-bold text-white">Ejercicios Prácticos</h2>
                    </div>
                    <div className="space-y-3">
                        {mod.exercises.map((ex, i) => (
                            <motion.div key={ex.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                                <Link
                                    to={`/exercise/${ex.id}`}
                                    className="flex items-center gap-5 p-5 rounded-xl bg-[#0d1424] border border-white/5 hover:border-emerald-500/25 hover:bg-[#0f1a14] transition-all duration-300 group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-mono text-emerald-400">{i + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{ex.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${levelColor[ex.level]}`}>{levelLabel[ex.level]}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm truncate">{ex.description}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── PRUEBA TÉCNICA ── */}
                {mod.test && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <ClipboardList className="w-4 h-4 text-amber-400" />
                            <h2 className="text-lg font-bold text-white">Prueba Técnica</h2>
                        </div>
                        <Link
                            to={`/test/${mod.id}`}
                            className="flex items-center gap-5 p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/40 hover:from-amber-500/15 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0 text-2xl">
                                📝
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors mb-0.5">{mod.test.title}</h3>
                                <p className="text-gray-500 text-sm">{mod.test.questions.length} preguntas de opción múltiple</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-amber-500/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </motion.div>
                )}

                {/* Start button */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 text-center">
                    <Link
                        to={`/exercise/${mod.exercises[0].id}`}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Comenzar Ejercicios
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default ModuleDetailPage;
