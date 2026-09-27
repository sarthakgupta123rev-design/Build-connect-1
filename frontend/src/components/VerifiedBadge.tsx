import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'sm', showText = true }) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm font-medium'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-medium ${textSizes[size]}`}
      title="Background & Identity Verified by BuildConnect Trust Engine"
    >
      <ShieldCheck className={`${iconSizes[size]} text-cyan-400`} />
      {showText && <span>Verified</span>}
    </span>
  );
};
