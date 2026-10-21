import React from 'react';
import {
  CalendarDays,
  UsersRound,
  HeartPulse,
  Stethoscope,
  Flame,
  ClipboardList,
} from 'lucide-react';

interface PanelNavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  appointmentsCount?: number;
  emergencyCount?: number;
}

/** Dashboard navigation built with Tailwind CSS instead of Material UI. */
export const PanelNavbar: React.FC<PanelNavbarProps> = ({
  currentPage,
  onNavigate,
  appointmentsCount = 3,
  emergencyCount = 1,
}) => {
  const navItems = [
    { id: 'appointments', label: 'OPD Appointments', icon: CalendarDays, badge: appointmentsCount > 0 ? String(appointmentsCount) : undefined, badgeColor: 'bg-[#b70302]' },
    { id: 'doctors', label: 'Doctors & Sitting Timings', icon: UsersRound },
    { id: 'specialties', label: 'Specialties & Departments', icon: Stethoscope },
    { id: 'form-builder', label: 'Dynamic Intake Form', icon: ClipboardList, badge: 'FORM', badgeColor: 'bg-sky-600' },
    { id: 'vitals', label: 'Patient Vitals', icon: HeartPulse },
    { id: 'emergency', label: 'Emergency ER', icon: Flame, badge: 'URGENT', badgeColor: 'bg-red-600' },
  ];

  return (
    <nav
      id="panel-sub-navbar"
      aria-label="Dashboard sections"
      className="sticky top-[70px] z-[1100] flex items-center overflow-x-auto whitespace-nowrap border-b border-slate-200 bg-white px-3 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.02)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 md:px-8"
    >
      <div className="flex w-full items-center gap-2 sm:gap-3">
        {navItems.map((item) => {
          const active = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              id={`panel-nav-btn-${item.id}`}
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 sm:px-[18px] ${
                active
                  ? 'border-[#b70302] bg-[#b70302]/[0.08] text-[#b70302] hover:bg-[#b70302]/[0.12]'
                  : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={18} aria-hidden="true" className={active ? 'text-[#b70302]' : 'text-slate-500'} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ${item.badgeColor || 'bg-[#b70302]'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
