const variants = {
  primary:
    'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/40 focus:ring-emerald-500 active:translate-y-0 active:shadow-md transition-all duration-200',
  secondary:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md focus:ring-slate-300 active:translate-y-0 active:shadow-sm transition-all duration-200',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200',
};

const sizes = {
  md: 'h-11 px-5 text-sm font-medium',
  lg: 'h-12 px-6 text-sm font-medium',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'lg',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
