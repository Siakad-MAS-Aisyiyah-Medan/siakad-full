import React from 'react';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import { 
    Users, GraduationCap, ClipboardList, BookOpen, 
    Bell, Star, History, AlertCircle 
} from 'lucide-react';

export default function AdminDashboard() {
    // Mock Stats for the Info Boxes
    const stats = [
        { label: 'Total Guru', value: '16', icon: <Users />, color: 'blue' },
        { label: 'Total Murid', value: '122', icon: <GraduationCap />, color: 'green' },
        { label: 'Mata Pelajaran', value: '18', icon: <ClipboardList />, color: 'purple' },
        { label: 'Total Kelas', value: '5', icon: <BookOpen />, color: 'orange' },
    ];

    // Mock Audit Log (Recent Activities)
    const auditLogs = [
        { id: 1, action: 'Verifikasi Pendaftaran', user: 'Admin', target: 'M. Rizky (Calon Siswa)', time: '10 menit yang lalu' },
        { id: 2, action: 'Update Profil Sekolah', user: 'Admin', target: 'Banner Hero', time: '1 jam yang lalu' },
        { id: 3, action: 'Tambah Berita Baru', user: 'Admin', target: 'Juara MTK Nasional', time: '3 jam yang lalu' },
        { id: 4, action: 'Login Berhasil', user: 'Admin', target: '-', time: '5 jam yang lalu' },
    ];

    return (
        <AdminPageShell>
            <div className="admin-dashboard-wrapper animate-fade-in">
                {/* 1. STATISTIK ATAU INFO BOX */}
                <div className="stats-info-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className={`stat-box glass border-${stat.color}`}>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                            <div className={`stat-icon bg-${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. NOTIFIKASI AUDIT LOG BERUPA ALERT */}
                <div className="audit-log-section glass">
                    <div className="section-title">
                        <History size={20} />
                        <h3>Notifikasi Audit Log (Aktivitas Akun)</h3>
                    </div>
                    <div className="logs-list">
                        {auditLogs.map((log) => (
                            <div key={log.id} className="log-item glass">
                                <AlertCircle size={18} className="text-secondary" />
                                <div className="log-text">
                                    <strong>{log.user}</strong> melakukan <span>{log.action}</span> pada <em>{log.target}</em>
                                </div>
                                <span className="log-time">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Quick Actions / Layout conforme Picture */}
                <div className="quick-info-footer glass">
                    <p>Hanya notifikasi yang termasuk kedalam hak akses role ini yang akan ditampilkan, kecuali Murid/Wali Murid yang tidak memiliki dashboard ini.</p>
                </div>
            </div>
        </AdminPageShell>
    );
}

