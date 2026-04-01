import { useState } from 'react';
import { Eye, EyeOff, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

interface AccountCardProps {
  title: string;
  fields: { label: string; value?: string | null }[];
  password: string;
  icon?: string;
  profileUrl?: string | null;
  badges?: React.ReactNode;
  extraActions?: React.ReactNode;
  hideDelete?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const AccountCard = ({ title, fields, password, icon, profileUrl, badges, extraActions, hideDelete, onEdit, onDelete }: AccountCardProps) => {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border group hover:bg-muted/20 transition-colors">
      {icon && <img src={icon} alt="" className="w-8 h-8 object-contain flex-shrink-0 mt-0.5" />}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="font-medium text-sm">{title}</p>
        {fields.map(({ label, value }) =>
          value ? (
            <div key={label} className="flex gap-2 text-xs">
              <span className="text-muted-foreground">{label}:</span>
              <span>{value}</span>
            </div>
          ) : null
        )}
        {password && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Pass:</span>
            <span className="font-mono">{showPw ? password : '••••••••'}</span>
            <button onClick={() => setShowPw(!showPw)} className="text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
        )}
        {badges}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {extraActions}
        {profileUrl && (
          <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
          </Button>
        )}
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onEdit}><Pencil className="w-3.5 h-3.5" /></Button>
        {!hideDelete && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onDelete}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>}
      </div>
    </div>
  );
};
