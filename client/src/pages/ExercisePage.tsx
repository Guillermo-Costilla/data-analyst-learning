import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader, CheckCircle, AlertTriangle, Lightbulb, ArrowLeft, ArrowRight, BookOpen, ChevronRight, Image } from 'lucide-react';
import SqlEditor from '../components/editor/SqlEditor';
import { aiApi } from '../api/ai.api';
import type { AIAnalysisResponse } from '../types';
import { getExerciseById, modules } from '../data/exercises';

const levelColor: Record<string, string> = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const levelLabel: Record<string, string> = {
    Beginner: 'Principiante',
    Intermediate: 'Intermedio',
    Advanced: 'Avanzado',
};

const ExercisePage: React.FC = () => {
    const { exerciseId } = useParams<{ exerciseId: string }>();
    const exercise = getExerciseById(exerciseId || '');

    const [code, setCode] = useState<string>(exercise?.initialCode || '');
    const [feedback, setFeedback] = useState<AIAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [showImage, setShowImage] = useState(false);

    if (!exercise) return <Navigate to="/modules" replace />;

    // Find prev/next exercise
    const allExercises = modules.flatMap((m) => m.exercises);
    const currentIndex = allExercises.findIndex((e) => e.id === exercise.id);
    const prevExercise = currentIndex > 0 ? allExercises[currentIndex - 1] : null;
    const nextExercise = currentIndex < allExercises.length - 1 ? allExercises[currentIndex + 1] : null;

    // Find parent module
    const parentModule = modules.find((m) => m.exercises.some((e) => e.id === exercise.id));

    const handleRun = async () => {
        setLoading(true);
        setError(null);
        setFeedback(null);
        try {
            const result = await aiApi.analyzeSql({
                userSql: code,
                exercisePrompt: exercise.description,
                exerciseLevel: exercise.level,
                schema: exercise.schema,
            });
            setFeedback(result);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al analizar tu consulta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#070b14] text-white overflow-hidden pt-16">
            {/* Left Panel */}
            <div className="w-[400px] flex-shrink-0 flex flex-col border-r border-white/5 bg-[#0a0f1e]">
                {/* Breadcrumb */}
                <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2 text-xs text-gray-500">
                    <Link to="/modules" className="hover:text-gray-300 transition-colors">Módulos</Link>
                    <ChevronRight className="w-3 h-3" />
                    {parentModule && (
                        <>
                            <Link to={`/modules/${parentModule.id}`} className="hover:text-gray-300 transition-colors truncate max-w-[100px]">
                                {parentModule.title}
                            </Link>
                            <ChevronRight className="w-3 h-3" />
                        </>
                    )}
                    <span className="text-gray-400 truncate">{exercise.title}</span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Title & Level */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${levelColor[exercise.level]}`}>
                                {levelLabel[exercise.level]}
                            </span>
                        </div>
                        <h1 className="text-xl font-bold text-white">{exercise.title}</h1>
                    </div>

                    {/* Instructions */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Instrucciones</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{exercise.description}</p>
                    </div>

                    {/* Theory Image */}
                    {exercise.imageUrl && (
                        <div>
                            <button
                                onClick={() => setShowImage(!showImage)}
                                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                            >
                                <Image className="w-4 h-4" />
                                {showImage ? 'Ocultar diagrama' : 'Ver diagrama explicativo'}
                            </button>
                            <AnimatePresence>
                                {showImage && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 overflow-hidden rounded-xl border border-white/10"
                                    >
                                        <img
                                            src={exercise.imageUrl}
                                            alt={`Diagrama: ${exercise.title}`}
                                            className="w-full object-cover rounded-xl"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Schema */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Esquema</span>
                        </div>
                        <div className="bg-[#0d1424] border border-white/5 rounded-xl p-4 font-mono text-xs text-gray-300 whitespace-pre leading-relaxed">
                            {exercise.schema}
                        </div>
                    </div>

                    {/* Hint */}
                    {exercise.hint && (
                        <div>
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                            >
                                <Lightbulb className="w-4 h-4" />
                                {showHint ? 'Ocultar pista' : 'Ver pista'}
                            </button>
                            <AnimatePresence>
                                {showHint && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-amber-200/80 text-sm"
                                    >
                                        💡 {exercise.hint}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Prev / Next Navigation */}
                <div className="border-t border-white/5 p-4 flex gap-2">
                    {prevExercise ? (
                        <Link
                            to={`/exercise/${prevExercise.id}`}
                            onClick={() => { setFeedback(null); setError(null); setShowHint(false); setShowImage(false); }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm transition-all"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Anterior
                        </Link>
                    ) : <div className="flex-1" />}
                    {nextExercise ? (
                        <Link
                            to={`/exercise/${nextExercise.id}`}
                            onClick={() => { setFeedback(null); setError(null); setShowHint(false); setShowImage(false); }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 text-sm transition-all"
                        >
                            Siguiente <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    ) : (
                        <Link
                            to="/modules"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-sm transition-all"
                        >
                            <CheckCircle className="w-3.5 h-3.5" /> Finalizar
                        </Link>
                    )}
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0a0f1e]">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Consulta SQL</span>
                    <button
                        id="run-query-btn"
                        onClick={handleRun}
                        disabled={loading}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${loading
                                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'
                            }`}
                    >
                        {loading ? (
                            <><Loader className="w-4 h-4 animate-spin" /> Analizando...</>
                        ) : (
                            <><Play className="w-4 h-4" /> Ejecutar y Analizar</>
                        )}
                    </button>
                </div>

                {/* Editor */}
                <div className="flex-1 overflow-hidden">
                    <SqlEditor
                        value={code}
                        onChange={(val) => setCode(val || '')}
                        height="100%"
                    />
                </div>

                {/* Feedback Panel */}
                <div className="h-[220px] border-t border-white/5 bg-[#0a0f1e] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {!feedback && !error && !loading && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex items-center justify-center text-gray-600 text-sm"
                            >
                                <div className="text-center">
                                    <Play className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p>Hacé clic en <strong className="text-gray-500">Ejecutar y Analizar</strong> para recibir retroalimentación de la IA</p>
                                </div>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                                    <p className="text-gray-400 text-sm">La IA está analizando tu SQL...</p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-5"
                            >
                                <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-red-400 font-medium text-sm mb-1">Error</p>
                                        <p className="text-red-300/70 text-sm">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {feedback && (
                            <motion.div
                                key="feedback"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-5"
                            >
                                <div className={`flex items-start gap-4 p-4 rounded-xl border ${feedback.isCorrect
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : 'bg-orange-500/5 border-orange-500/20'
                                    }`}>
                                    {feedback.isCorrect ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold mb-1 ${feedback.isCorrect ? 'text-emerald-400' : 'text-orange-400'}`}>
                                            {feedback.isCorrect ? '✓ ¡Correcto!' : 'Necesita mejoras'}
                                        </h3>
                                        <p className="text-gray-300 text-sm mb-2">{feedback.feedback}</p>
                                        {feedback.explanation && (
                                            <p className="text-gray-500 text-xs italic border-l-2 border-gray-700 pl-3">{feedback.explanation}</p>
                                        )}
                                        {feedback.hints && feedback.hints.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {feedback.hints.map((h, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-md">
                                                        💡 {h}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ExercisePage;
