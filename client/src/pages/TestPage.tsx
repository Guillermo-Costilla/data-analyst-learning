import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, ClipboardList, Trophy, RotateCcw } from 'lucide-react';
import { getModuleById } from '../data/exercises';

const TestPage: React.FC = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const mod = getModuleById(moduleId || '');

    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [finished, setFinished] = useState(false);

    if (!mod || !mod.test) return <Navigate to="/modules" replace />;

    const test = mod.test;
    const question = test.questions[current];
    const isAnswered = selected !== null;
    const isCorrect = selected === question.correctIndex;

    const handleSelect = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        setShowResult(true);
    };

    const handleNext = () => {
        const newAnswers = [...answers, selected];
        if (current + 1 >= test.questions.length) {
            setAnswers(newAnswers);
            setFinished(true);
        } else {
            setAnswers(newAnswers);
            setCurrent(current + 1);
            setSelected(null);
            setShowResult(false);
        }
    };

    const handleReset = () => {
        setCurrent(0);
        setSelected(null);
        setAnswers([]);
        setShowResult(false);
        setFinished(false);
    };

    const score = finished
        ? answers.filter((a, i) => a === test.questions[i].correctIndex).length
        : 0;
    const pct = finished ? Math.round((score / test.questions.length) * 100) : 0;

    if (finished) {
        return (
            <div className="min-h-screen bg-[#070b14] text-white pt-24 pb-16 px-6 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full text-center"
                >
                    <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl ${pct >= 70 ? 'bg-emerald-500/15 border-2 border-emerald-500/30' : 'bg-red-500/15 border-2 border-red-500/30'
                        }`}>
                        {pct >= 70 ? '🏆' : '📚'}
                    </div>
                    <h1 className="text-3xl font-extrabold mb-2">
                        {pct >= 70 ? '¡Excelente trabajo!' : 'Seguí practicando'}
                    </h1>
                    <p className="text-gray-400 mb-8">
                        {pct >= 70
                            ? 'Demostraste un buen dominio del tema.'
                            : 'Revisá la teoría del módulo e intentalo de nuevo.'}
                    </p>

                    <div className={`text-6xl font-black mb-2 ${pct >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {score}/{test.questions.length}
                    </div>
                    <div className="text-gray-500 mb-8">{pct}% correcto</div>

                    {/* Answer review */}
                    <div className="text-left space-y-3 mb-8">
                        {test.questions.map((q, i) => {
                            const correct = answers[i] === q.correctIndex;
                            return (
                                <div key={q.id} className={`p-4 rounded-xl border text-sm ${correct ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                    <div className="flex items-start gap-2 mb-1">
                                        {correct
                                            ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                            : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                                        <span className="text-gray-300 font-medium">{q.question}</span>
                                    </div>
                                    {!correct && (
                                        <p className="text-gray-500 text-xs ml-6 mt-1">
                                            ✓ Correcta: <span className="text-emerald-400">{q.options[q.correctIndex]}</span>
                                        </p>
                                    )}
                                    <p className="text-gray-600 text-xs ml-6 mt-1 italic">{q.explanation}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all text-sm"
                        >
                            <RotateCcw className="w-4 h-4" /> Reintentar
                        </button>
                        <Link
                            to={`/modules/${mod.id}`}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all"
                        >
                            Volver al Módulo <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070b14] text-white pt-24 pb-16 px-6">
            <div className="max-w-2xl mx-auto">
                {/* Back */}
                <Link to={`/modules/${mod.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Volver al módulo
                </Link>

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{test.title}</h1>
                        <p className="text-gray-500 text-sm">{test.description}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Pregunta {current + 1} de {test.questions.length}</span>
                        <span>{Math.round(((current) / test.questions.length) * 100)}% completado</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                            animate={{ width: `${(current / test.questions.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="p-6 rounded-2xl bg-[#0d1424] border border-white/5 mb-4">
                            <p className="text-white font-medium text-lg leading-relaxed">{question.question}</p>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-6">
                            {question.options.map((opt, idx) => {
                                let style = 'border-white/10 bg-[#0d1424] hover:border-blue-500/30 hover:bg-[#0f1830]';
                                if (isAnswered) {
                                    if (idx === question.correctIndex) style = 'border-emerald-500/50 bg-emerald-500/10';
                                    else if (idx === selected) style = 'border-red-500/50 bg-red-500/10';
                                    else style = 'border-white/5 bg-[#0d1424] opacity-50';
                                }
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(idx)}
                                        disabled={isAnswered}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${style}`}
                                    >
                                        <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${isAnswered && idx === question.correctIndex ? 'border-emerald-400 text-emerald-400' :
                                                isAnswered && idx === selected ? 'border-red-400 text-red-400' :
                                                    'border-gray-600 text-gray-400'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="text-gray-200 text-sm">{opt}</span>
                                        {isAnswered && idx === question.correctIndex && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />}
                                        {isAnswered && idx === selected && idx !== question.correctIndex && <XCircle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl border mb-6 ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}
                                >
                                    <p className={`font-semibold text-sm mb-1 ${isCorrect ? 'text-emerald-400' : 'text-blue-400'}`}>
                                        {isCorrect ? '✓ ¡Correcto!' : '✗ Incorrecto'}
                                    </p>
                                    <p className="text-gray-400 text-sm">{question.explanation}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isAnswered && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20"
                                >
                                    {current + 1 >= test.questions.length ? (
                                        <><Trophy className="w-4 h-4" /> Ver resultados</>
                                    ) : (
                                        <>Siguiente <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TestPage;
