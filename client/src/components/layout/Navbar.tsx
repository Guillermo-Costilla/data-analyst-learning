import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, BookOpen, Home, BarChart2 } from 'lucide-react';

const Navbar: React.FC = () => {
    const location = useLocation();

    const links = [
        { to: '/', label: 'Inicio', icon: Home },
        { to: '/modules', label: 'Módulos', icon: BookOpen },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                        <Database className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white tracking-tight">
                        SQL<span className="text-blue-400">Learn</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    {links.map(({ to, label, icon: Icon }) => {
                        const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">Ruta Analista de Datos</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
