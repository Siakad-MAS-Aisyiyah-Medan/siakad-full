import { Lightbulb, CheckCircle2, Clock, Phone } from 'lucide-react';
import Card from '../portal/Card';

const TIPS = [
  { icon: CheckCircle2, text: 'Pastikan data sudah benar sebelum submit final.', tone: 'green' },
  { icon: Clock, text: 'Cek status pendaftaran secara berkala di halaman ini.', tone: 'blue' },
  { icon: Phone, text: 'Hubungi admin jika ada kesalahan data atau dokumen.', tone: 'amber' },
];

export default function StatusInfoTips() {
  return (
    <Card padding="p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Lightbulb size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Informasi Penting</h2>
      </div>
      <ul className="space-y-3">
        {TIPS.map(({ icon: Icon, text, tone }) => (
          <li key={text} className={`cm-tip-item cm-tip-item--${tone}`}>
            <div className={`cm-tip-item__icon cm-tip-item__icon--${tone}`}>
              <Icon size={15} />
            </div>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
