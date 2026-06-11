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
            label: 'Total Murid', 
            value: realStats.total_murid, 
            icon: <GraduationCap className="w-8 h-8" />, 
            colorClass: 'text-slate-600', 
            bgClass: 'bg-slate-100',
            subtext: 'Data murid aktif'
        },
        { 
            label: 'Total Guru', 
            value: realStats.total_guru, 
            icon: <Users className="w-8 h-8" />, 
            colorClass: 'text-slate-600', 
            bgClass: 'bg-slate-100',
            subtext: 'Tenaga pengajar'
        },
        { 
            label: 'Total Kelas', 
            value: realStats.total_kelas, 
            icon: <BookOpen className="w-8 h-8" />, 
            colorClass: 'text-slate-600', 
            bgClass: 'bg-slate-100',
            subtext: 'Rombongan belajar'
        },
        { 
            label: 'Mata Pelajaran', 
            value: realStats.total_mapel, 
            icon: <ClipboardList className="w-8 h-8" />, 
            colorClass: 'text-slate-600', 
            bgClass: 'bg-slate-100',
            subtext: 'Kurikulum berjalan'
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
            {/* Wrapper utama dengan Flexbox dan gap-10 (40px) untuk vertical rhythm yang lega */}
            <div className="p-6 max-w-7xl mx-auto font-sans pb-16 flex flex-col gap-10">
                
                {/* WELCOME SECTION (HERO) */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white shadow-sm relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight mb-2">Selamat Datang, Admin 👋</h1>
                            <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
                                Berikut adalah ringkasan aktivitas dan data terkini pada sistem hari ini.
                            </p>
                        </div>
                    </div>
                    {/* Decorative overlay */}
                    <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none transform translate-x-12 -translate-y-8">
                        <BookOpenCheck className="w-full h-full" />
                    </div>
                </div>

                {/* 1. STATISTIK CARDS - Menggunakan gap-8 (32px) agar lebar menyamping tidak sesak */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group cursor-default">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 mb-2">{stat.label}</p>
                                    <h3 className="text-4xl font-bold text-slate-800 tracking-tight">
                                        {isLoading ? (
                                            <div className="w-8 h-8 border-4 border-slate-100 border-t-slate-500 rounded-full animate-spin my-1"></div>
                                        ) : (
                                            stat.value || 0
                                        )}
                                    </h3>
                                </div>
                                <div className={`p-4 rounded-xl ${stat.bgClass} ${stat.colorClass} group-hover:scale-110 transition-transform duration-300 ease-out`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="flex items-center text-sm font-medium text-slate-400 pt-5 border-t border-slate-50">
                                {stat.subtext}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. MIDDLE SECTION: CHART & AGENDA - Menggunakan gap-10 antar kolom */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Chart Section */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Tren Pendaftaran Siswa Baru</h2>
                                <p className="text-sm text-slate-500 mt-1.5">Statistik pendaftaran 6 bulan terakhir</p>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-xl">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>
                        
                        {/* Mock Chart Visualization */}
                        <div className="mt-10 flex flex-col justify-end h-56 border-l border-b border-slate-100 pl-4 pb-2 relative">
                            {/* Grid lines */}
                            <div className="absolute w-full border-t border-slate-100 border-dashed top-0 left-0"></div>
                            <div className="absolute w-full border-t border-slate-100 border-dashed top-1/3 left-0"></div>
                            <div className="absolute w-full border-t border-slate-100 border-dashed top-2/3 left-0"></div>
                            
                            <div className="flex items-end justify-between gap-6 h-full w-full z-10 px-4">
                                {[35, 45, 60, 50, 85, 100].map((val, i) => {
                                    const count = val * 12;
                                    return (
                                        <div key={i} className="w-full bg-emerald-100 hover:bg-emerald-200 rounded-t-lg relative group transition-colors duration-300 flex justify-center" style={{ height: `${val}%` }}>
                                            {/* Number above bar */}
                                            <div className="absolute -top-7 text-xs font-bold text-slate-600">
                                                {count}
                                            </div>
                                            <div className="w-full bg-emerald-500 rounded-t-lg absolute bottom-0 transition-all duration-500" style={{ height: '4px' }}></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex justify-between mt-4 text-sm font-medium text-slate-400 px-8">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
                        </div>
                    </div>

                    {/* Agenda Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Agenda Hari Ini</h2>
                                <p className="text-sm text-slate-500 mt-1 font-medium bg-blue-50 text-blue-600 inline-block px-2.5 py-1 rounded mt-2">Total agenda: 3 kegiatan</p>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-xl">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>

                        <div className="space-y-6 flex-grow">
                            {mockAgenda.map((agenda) => (
                                <div key={agenda.id} className="flex gap-5 group cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3.5 h-3.5 rounded-full ${agenda.color} ring-4 ring-blue-50 mt-1`}></div>
                                        <div className="w-0.5 h-full bg-slate-100 mt-2 group-last:hidden"></div>
                                    </div>
                                    <div className="pb-5 group-last:pb-0">
                                        <h4 className="text-sm font-bold text-slate-800 mb-1.5 group-hover:text-blue-600 transition-colors">{agenda.title}</h4>
                                        <div className="flex items-center text-xs font-medium text-slate-500">
                                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                                            {agenda.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button className="w-full mt-8 py-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-sm font-bold transition-colors flex items-center justify-center gap-2">
                            Lihat Semua Kalender
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 3. AUDIT LOG (TIMELINE ACTIVITY FEED) */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center bg-slate-50/30 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1.5">
                                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Aktivitas Sistem Terbaru</h2>
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Pantau riwayat tindakan dan interaksi pengguna secara aktual</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400">
                            <History className="w-5 h-5" />
                        </div>
                    </div>
                    
                    <div className="p-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-500 rounded-full animate-spin"></div>
                                <span className="text-slate-500 font-medium">Memuat data aktivitas...</span>
                            </div>
                        ) : auditLogs.length > 0 ? (
                            <div className="relative px-2">
                                <div className="space-y-8">
                                    {auditLogs.map((log, index) => {
                                        const formattedTime = formatDate(log.waktu || log.created_at);
                                        const actorName = log.aktor || log.user_name || log.user || 'Admin System';
                                        
                                        // Tentukan warna dan ikon berdasarkan aksi
                                        const act = (log.aksi || log.action || '').toLowerCase();
                                        let IconObj = Activity;
                                        let colorClass = 'bg-slate-100 text-slate-600';
                                        
                                        if (act.includes('create') || act.includes('tambah') || act.includes('insert')) {
                                            IconObj = Plus;
                                            colorClass = 'bg-emerald-100 text-emerald-600';
                                        } else if (act.includes('update') || act.includes('ubah') || act.includes('edit')) {
                                            IconObj = Edit2;
                                            colorClass = 'bg-blue-100 text-blue-600';
                                        } else if (act.includes('delete') || act.includes('hapus')) {
                                            IconObj = Trash2;
                                            colorClass = 'bg-red-100 text-red-600';
                                        } else if (act.includes('login') || act.includes('akses')) {
                                            IconObj = LogIn;
                                            colorClass = 'bg-purple-100 text-purple-600';
                                        }

                                        return (
                                            <div key={index} className="flex gap-5 relative group">
                                                {/* Garis Vertikal Timeline (hanya jika bukan item terakhir) */}
                                                {index !== auditLogs.length - 1 && (
                                                    <div className="absolute left-[1.2rem] top-10 bottom-[-2.5rem] w-0.5 bg-slate-100 z-0"></div>
                                                )}

                                                {/* Node pada Timeline */}
                                                <div className="relative z-10 flex-shrink-0 mt-0.5">
                                                    <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center ring-4 ring-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                                        <IconObj className="w-4 h-4" strokeWidth={2.5} />
                                                    </div>
                                                </div>
                                                
                                                {/* Konten Aktivitas */}
                                                <div className="flex-grow pt-1.5">
                                                    <p className="text-[15px] font-bold text-slate-800 leading-snug">
                                                        {formatActionTitle(log.aksi || log.action, log.subjek || log.description || log.subject)}
                                                    </p>
                                                    <p className="text-sm font-medium text-slate-500 mt-1.5 flex items-center gap-2">
                                                        <span className="text-slate-700 font-semibold">{actorName}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        <span>{formattedTime}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                                    <FileText className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">Belum ada aktivitas terbaru</h3>
                                <p className="text-slate-500 max-w-sm text-center">
                                    Aktivitas pengguna seperti penambahan murid, pengubahan jadwal, atau aksi sistem lainnya akan muncul di sini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminPageShell>
    );
}
