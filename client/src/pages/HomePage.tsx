import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Zap, Brain, Trophy, ChevronRight, Code2, BarChart2, GitBranch } from 'lucide-react';
import { modules } from '../data/exercises';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
};

const features = [
    {
        icon: Code2,
        color: 'blue',
        title: 'Editor SQL Interactivo',
        desc: 'Escribe y ejecuta consultas SQL en un editor Monaco con resaltado de sintaxis, igual que un IDE profesional.',
    },
    {
        icon: Brain,
        color: 'purple',
        title: 'Retroalimentación con IA',
        desc: 'Obtén feedback inteligente e instantáneo sobre tus consultas. La IA explica los errores y sugiere mejoras.',
    },
    {
        icon: BarChart2,
        color: 'emerald',
        title: 'Enfoque en Análisis de Datos',
        desc: 'Ejercicios diseñados específicamente para flujos de trabajo de análisis: agregaciones, funciones de ventana, CTEs y más.',
    },
    {
        icon: GitBranch,
        color: 'amber',
        title: 'Ruta de Aprendizaje Estructurada',
        desc: 'Progresa desde los fundamentos de SQL hasta análisis avanzado en un plan de estudios cuidadosamente diseñado.',
    },
];

const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
};

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

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#070b14] text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[80px]" />
                    <div className="absolute top-10 right-1/4 w-[250px] h-[250px] bg-purple-500/8 rounded-full blur-[80px]" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Plataforma de Aprendizaje SQL con IA
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
                    >
                        Dominá SQL para{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Análisis de Datos
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Aprendé SQL Server con ejercicios prácticos, un editor interactivo y retroalimentación instantánea con IA.
                        Desde consultas básicas hasta funciones de ventana avanzadas — todo en un solo lugar.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/modules"
                            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                        >
                            Comenzar a Aprender
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/modules"
                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 font-medium transition-all duration-300"
                        >
                            <Database className="w-4 h-4" />
                            Ver Módulos
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-16 flex items-center justify-center gap-12"
                    >
                        {[
                            { value: `${modules.length}`, label: 'Módulos' },
                            { value: `${modules.reduce((acc, m) => acc + m.exercises.length, 0)}+`, label: 'Ejercicios' },
                            { value: 'IA', label: 'Retroalimentación' },
                        ].map(({ value, label }) => (
                            <div key={label} className="text-center">
                                <div className="text-3xl font-bold text-white">{value}</div>
                                <div className="text-sm text-gray-500 mt-1">{label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <h2 className="text-3xl font-bold mb-3">Todo lo que necesitás para aprender SQL</h2>
                        <p className="text-gray-400">Un entorno de aprendizaje completo para futuros analistas de datos.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {features.map(({ icon: Icon, color, title, desc }, i) => (
                            <motion.div
                                key={title}
                                custom={i}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                className={`p-6 rounded-2xl bg-gradient-to-br border ${colorMap[color]} bg-[#0d1424]`}
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center mb-4`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modules Preview */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-end justify-between mb-10"
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Módulos de Aprendizaje</h2>
                            <p className="text-gray-400">Estructurado de principiante a análisis SQL avanzado.</p>
                        </div>
                        <Link
                            to="/modules"
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                            Ver todos <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modules.map((mod, i) => (
                            <motion.div
                                key={mod.id}
                                custom={i}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                variants={fadeUp}
                            >
                                <Link
                                    to={`/modules/${mod.id}`}
                                    className="block p-5 rounded-2xl bg-[#0d1424] border border-white/5 hover:border-blue-500/30 hover:bg-[#0f1830] transition-all duration-300 group h-full"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-3xl">{mod.icon}</span>
                                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${levelColor[mod.level]}`}>
                                            {levelLabel[mod.level]}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                                        {mod.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{mod.description}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                        <span>{mod.exercises.length} ejercicios</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-gray-500" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-6" />
                        <h2 className="text-4xl font-bold mb-4">¿Listo para llevar tu SQL al siguiente nivel?</h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Comenzá con los fundamentos y avanzá hasta consultas analíticas avanzadas usadas por analistas de datos profesionales.
                        </p>
                        <Link
                            to="/modules"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300"
                        >
                            Empezar Ahora
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 px-6 text-center text-gray-600 text-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-400">SQLLearn</span>
                </div>
                <p>Plataforma interactiva de aprendizaje SQL para analistas de datos.</p>
            </footer>
        </div>
    );
};

export default HomePage;
