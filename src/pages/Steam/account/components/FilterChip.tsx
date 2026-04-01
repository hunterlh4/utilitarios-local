interface FilterChipProps {
  label: string;
  icon?: string;
  active: boolean;
  onChange: (v: boolean) => void;
}

export const FilterChip = ({ label, icon, active, onChange }: FilterChipProps) => (
  <button
    onClick={() => onChange(!active)}
    title={label}
    className={`flex items-center justify-center w-12 h-12 rounded-lg border transition-all ${
      active
        ? 'border-primary/0 bg-primary/0'
        : 'border-transparent opacity-30 grayscale hover:opacity-60'
    }`}
  >
    {icon
      ? <img src={icon} alt={label} className="w-12 h-12 object-contain" />
      : <span className="text-xs font-medium px-1">{label}</span>
    }
  </button>
);
