import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: 'default' | 'strong' | 'agent' | 'warning';
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
};

const variantClass = {
  default: 'border-white/12 bg-white/[0.075]',
  strong: 'border-white/18 bg-white/[0.11]',
  agent: 'border-cyan-300/20 bg-cyan-300/[0.08]',
  warning: 'border-amber-300/25 bg-amber-300/[0.08]',
};

const paddingClass = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function GlassCard({
  children,
  className,
  variant = 'default',
  padding = 'md',
  interactive,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-[28px] border shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl',
        'relative overflow-hidden',
        variantClass[variant],
        paddingClass[padding],
        interactive && 'transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.105]',
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      {children}
    </div>
  );
}

