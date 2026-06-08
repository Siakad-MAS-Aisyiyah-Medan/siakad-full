export default function Card({ children, className = '', padding = 'p-7 sm:p-9' }) {
  return (
    <div
      className={`rounded-[24px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50 ${padding} ${className}`}
    >
      {children}
    </div>
  );
}
