import React, { useState, useEffect } from 'react';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import { 
    Users, GraduationCap, ClipboardList, BookOpen, 
    History, Clock, Calendar, TrendingUp,
    ChevronRight, BookOpenCheck,
    Plus, Edit2, Trash2, LogIn, Activity, FileText, User
} from 'lucide-react';
import { fetchAdminDashboardStats } from '@app/shared/services/dashboard.service';

export default function AdminDashboard() {
    const [realStats, setRealStats] = useState({
        total_guru: 0,
        total_murid: 0,
        total_mapel: 0,
        total_kelas: 0,
    });
    const [auditLogs, setAuditLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const data = await fetchAdminDashboardStats();
                if (data) {
                    setRealStats(data.stats || {
                        total_guru: 0,
                        total_murid: 0,
                        total_mapel: 0,
                        total_kelas: 0,
                    });
                    setAuditLogs(data.audit_logs || []);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const stats = [
        { 
            label: 'TOTAL MURID', 
            value: realStats.total_murid, 
            icon: <GraduationCap className="w-6 h-6" />, 
        },
        { 
            label: 'TOTAL GURU', 
            value: realStats.total_guru, 
            icon: <Users className="w-6 h-6" />, 
        },
        { 
            label: 'MATA PELAJARAN', 
            value: realStats.total_mapel, 
            icon: <ClipboardList className="w-6 h-6" />, 
        },
        { 
            label: 'TOTAL KELAS', 
            value: realStats.total_kelas, 
            icon: <BookOpen className="w-6 h-6" />, 
        },
    ];

    const mockAgenda = [
        { id: 1, title: 'Rapat Evaluasi Guru Bulanan', time: '10:00 WIB', type: 'internal', color: 'bg-blue-500' },
        { id: 2, title: 'Batas Akhir PPDB Gelombang 1', time: '15:00 WIB', type: 'urgent', color: 'bg-blue-400' },
        { id: 3, title: 'Persiapan Ujian Tengah Semester', time: 'Besok', type: 'info', color: 'bg-blue-300' }
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'Hari ini • 14:30 WIB'; // Default mock fallback
        const date = new Date(dateString);
        
        const today = new Date();
        const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        
        const timeString = new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date) + ' WIB';

        if (isToday) return `Hari ini • ${timeString}`;
        
        const dateStr = new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
        
        return `${dateStr} • ${timeString}`;
    };

    const formatActionTitle = (action, subject) => {
        if (!action) return 'Aktivitas sistem';
        const act = action.toLowerCase();
        
        let prefix = 'Memperbarui data';
        
        if (act.includes('create') || act.includes('insert') || act.includes('tambah')) prefix = 'Menambahkan data';
        else if (act.includes('update') || act.includes('edit') || act.includes('ubah')) prefix = 'Memperbarui data';
        else if (act.includes('delete') || act.includes('hapus')) prefix = 'Menghapus data';
        else if (act.includes('login') || act.includes('masuk')) return `Berhasil login ke sistem`;
        else if (act.includes('logout') || act.includes('keluar')) return `Keluar dari sistem`;
        
        let entity = '';
        if (act.includes('.')) {
            entity = act.split('.')[0];
        }

        const subjectDesc = subject ? subject : '';
        const entityDesc = entity ? entity : 'sistem';
        
        const result = `${prefix} ${entityDesc} ${subjectDesc}`.trim();
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    const renderTimelineIcon = (action) => {
        const act = (action || '').toLowerCase();
        if (act.includes('create') || act.includes('tambah') || act.includes('insert')) {
            return <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shadow-sm relative z-10"><Plus className="w-5 h-5" strokeWidth={2.5} /></div>;
        } else if (act.includes('update') || act.includes('ubah') || act.includes('edit')) {
            return <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shadow-sm relative z-10"><Edit2 className="w-5 h-5" strokeWidth={2.5} /></div>;
        } else if (act.includes('delete') || act.includes('hapus')) {
            return <div className="p-3 bg-red-100 text-red-600 rounded-xl shadow-sm relative z-10"><Trash2 className="w-5 h-5" strokeWidth={2.5} /></div>;
        } else if (act.includes('login') || act.includes('akses')) {
            return <div className="p-3 bg-purple-100 text-purple-600 rounded-xl shadow-sm relative z-10"><LogIn className="w-5 h-5" strokeWidth={2.5} /></div>;
        }
        return <div className="p-3 bg-slate-100 text-slate-600 rounded-xl shadow-sm relative z-10"><Activity className="w-5 h-5" strokeWidth={2.5} /></div>;
    };

    return (
        <AdminPageShell>
            <div className="p-6 max-w-7xl mx-auto font-sans pb-16 flex flex-col gap-8">
                
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>

                {/* 1. STATISTIK CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-2">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-3xl font-medium text-slate-800 tracking-tight mb-3">
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-4 border-slate-100 border-t-slate-500 rounded-full animate-spin"></div>
                                        ) : (
                                            stat.value || 0
                                        )}
                                    </h3>
                                    <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">{stat.label}</p>
                                </div>
                                <div className="p-2.5 border border-slate-200 rounded-lg text-slate-600">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. AUDIT LOG (TABLE) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800">Audit Log</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-100 text-[11px] uppercase font-bold text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">WAKTU</th>
                                    <th className="px-6 py-4 whitespace-nowrap">AKTOR</th>
                                    <th className="px-6 py-4 whitespace-nowrap">AKSI</th>
                                    <th className="px-6 py-4 whitespace-nowrap">SUBJEK</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex justify-center mb-2">
                                                <div className="w-6 h-6 border-4 border-slate-100 border-t-slate-500 rounded-full animate-spin"></div>
                                            </div>
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : auditLogs.length > 0 ? (
                                    auditLogs.map((log, index) => {
                                        const formattedTime = formatDate(log.waktu || log.created_at);
                                        const actorName = log.aktor || log.user_name || log.user || 'Admin System';
                                        const actionTitle = formatActionTitle(log.aksi || log.action, log.subjek || log.description || log.subject);
                                        
                                        return (
                                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">{formattedTime}</td>
                                                <td className="px-6 py-4 font-medium text-slate-800">{actorName}</td>
                                                <td className="px-6 py-4">{actionTitle}</td>
                                                <td className="px-6 py-4">{(log.subjek || log.description || log.subject) || '-'}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            Belum ada entri audit log
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-6 py-4 bg-white text-xs text-slate-500">
                        Total {auditLogs.length} entri
                    </div>
                </div>

            </div>
        </AdminPageShell>
    );
}
