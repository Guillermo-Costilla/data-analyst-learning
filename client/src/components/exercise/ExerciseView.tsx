import React, { useState } from 'react';
import SqlEditor from '../editor/SqlEditor';
import { aiApi } from '../../api/ai.api';
import type { AIAnalysisResponse } from '../../types';
import { Play, Loader, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExerciseView: React.FC = () => {
    const [code, setCode] = useState<string>('SELECT * FROM users;');
    const [feedback, setFeedback] = useState<AIAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock Exercise Data
    const exercise = {
        id: '1',
        title: 'Basic Selection',
        description: 'Retrieve all columns from the users table.',
        level: 'Beginner',
        schema: `
      Table: users
      - id (INTEGER, PK)
      - email (TEXT)
      - name (TEXT)
      - created_at (DATETIME)
    `
    };

    const handleRun = async () => {
        setLoading(true);
        setError(null);
        setFeedback(null);
        try {
            const result = await aiApi.analyzeSql({
                userSql: code,
                exercisePrompt: exercise.description,
                exerciseLevel: exercise.level,
                schema: exercise.schema
            });
            setFeedback(result);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Left Panel: Exercise & Schema */}
            <div className="w-1/3 p-6 border-r border-gray-800 overflow-y-auto">
                <h1 className="text-2xl font-bold text-blue-400 mb-2">{exercise.title}</h1>
                <span className="inline-block px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full mb-4 border border-blue-800">
                    {exercise.level}
                </span>

                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Instructions</h2>
                    <p className="text-gray-200 leading-relaxed">{exercise.description}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Schema</h2>
                    <div className="bg-gray-800 p-4 rounded-lg font-mono text-xs text-gray-300 whitespace-pre-wrap border border-gray-700">
                        {exercise.schema}
                    </div>
                </div>
            </div>

            {/* Right Panel: Editor & Feedback */}
            <div className="w-2/3 flex flex-col h-full">
                <div className="flex-1 p-6 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">SQL Query</h2>
                        <button
                            onClick={handleRun}
                            disabled={loading}
                            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${loading
                                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" /> Run Query
                                </>
                            )}
                        </button>
                    </div>

                    <div className="h-[400px]">
                        <SqlEditor
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            height="100%"
                        />
                    </div>

                    {/* Feedback Section */}
                    <div className="mt-6 flex-1 overflow-y-auto">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-6 rounded-lg border ${feedback.isCorrect
                                        ? 'bg-green-900/10 border-green-800'
                                        : 'bg-orange-900/10 border-orange-800'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {feedback.isCorrect ? (
                                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                        ) : (
                                            <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                                        )}
                                        <div>
                                            <h3 className={`text-lg font-semibold mb-2 ${feedback.isCorrect ? 'text-green-400' : 'text-orange-400'
                                                }`}>
                                                {feedback.isCorrect ? 'Correct!' : 'Needs Improvement'}
                                            </h3>
                                            <p className="text-gray-300 mb-4">{feedback.feedback}</p>

                                            {feedback.hints && feedback.hints.length > 0 && (
                                                <div className="mt-4 bg-gray-800/50 p-4 rounded border border-gray-700">
                                                    <div className="flex items-center gap-2 mb-2 text-yellow-400">
                                                        <Lightbulb className="w-4 h-4" />
                                                        <span className="text-sm font-semibold">Hint</span>
                                                    </div>
                                                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                                        {feedback.hints.map((hint, i) => (
                                                            <li key={i}>{hint}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {feedback.explanation && (
                                                <div className="mt-4 text-sm text-gray-400 italic border-l-2 border-gray-700 pl-4">
                                                    {feedback.explanation}
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
        </div>
    );
};

export default ExerciseView;
