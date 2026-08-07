import React from 'react';

const COLOR_MAPS = {
  blue: {
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xs shadow-blue-500/20',
    valueText: 'text-blue-600',
    topBar: 'bg-blue-500',
  },
  orange: {
    iconBg: 'bg-gradient-to-br from-orange-400 to-amber-600 text-white shadow-xs shadow-orange-500/20',
    valueText: 'text-orange-600',
    topBar: 'bg-orange-500',
  },
  green: {
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-xs shadow-emerald-500/20',
    valueText: 'text-emerald-600',
    topBar: 'bg-emerald-500',
  },
  red: {
    iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-xs shadow-rose-500/20',
    valueText: 'text-rose-600',
    topBar: 'bg-rose-500',
  },
  gray: {
    iconBg: 'bg-gradient-to-br from-slate-500 to-gray-600 text-white shadow-xs shadow-slate-500/20',
    valueText: 'text-slate-800',
    topBar: 'bg-slate-400',
  },
  violet: {
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-xs shadow-violet-500/20',
    valueText: 'text-violet-600',
    topBar: 'bg-violet-500',
  },
};

const StatCard = ({
  title,
  value,
  icon,
  color = 'blue',
  subtitle,
  trend,
  className = '',
  layout = 'default',
}) => {
  const c = COLOR_MAPS[color] || COLOR_MAPS.blue;

  if (layout === 'horizontal') {
    return (
      <div className={`bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 hover:shadow-md hover:border-blue-300 transition-all duration-200 flex items-center gap-3 h-[72px] ${className}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs flex-shrink-0 ${c.iconBg}`}>
          {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'w-4.5 h-4.5 text-white' }) : icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-lg md:text-xl font-extrabold tracking-tight leading-none ${c.valueText}`}>
            {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
          </p>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1 truncate">
            {title}
          </p>
          {subtitle && <div className="mt-0.5 text-[10px] leading-tight truncate">{subtitle}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between h-[78px] ${className}`}>
      {/* Accent top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.topBar} opacity-80 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate">
          {title}
        </span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform ${c.iconBg}`}>
          {React.isValidElement(icon) ? React.cloneElement(icon, { className: 'w-3.5 h-3.5 text-white' }) : icon}
        </div>
      </div>

      <div className="mt-0.5">
        <p className={`text-xl font-black tracking-tight leading-none ${c.valueText}`}>
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </p>
        {(subtitle || trend) && (
          <div className="mt-0.5 text-[10px] font-medium leading-tight truncate">
            {subtitle}
            {trend && <span className="text-slate-500 ml-1">{trend}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;