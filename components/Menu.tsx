'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
    name: string;
    href: string;
    icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
    { name: 'Inicio', href: '/', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { name: 'Dashboard', href: '/dashboard/professor', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'Estudiantes', href: '/dashboard/professor/students', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M12 12a4 4 0 100-8 4 4 0 000 8z" /></svg> },
    { name: 'Planes', href: '/dashboard/professor/plans', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg> },
    { name: 'Pagos', href: '/dashboard/professor/payments', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg> },
    { name: 'Ajustes', href: '/settings', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg> },
];

export default function Menu() {
    const pathname = usePathname();
    return (
        <nav className="bg-slate-800 border-b border-slate-700/50 glass">
            <ul className="max-w-7xl mx-auto flex items-center space-x-4 px-4 py-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
                            >
                                {item.icon}
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
