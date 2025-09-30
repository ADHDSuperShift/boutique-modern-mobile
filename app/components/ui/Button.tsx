'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl',
  {
    variants: {
      variant: {
  primary: 'bg-gradient-to-r from-[#D4AF37] via-[#E6C85C] to-[#F0D77B] text-slate-900 hover:from-[#C6A02E] hover:via-[#DBBF57] hover:to-[#EBD06F] shadow-[rgba(212,175,55,0.35)] disabled:hover:from-[#D4AF37] disabled:hover:via-[#E6C85C] disabled:hover:to-[#F0D77B] font-semibold',
  secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600 shadow-slate-500/20 disabled:hover:from-slate-600 disabled:hover:to-slate-700',
        outline: 'border-2 border-amber-400 text-amber-400 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-slate-900 bg-transparent hover:border-transparent disabled:hover:bg-transparent disabled:hover:text-amber-400 disabled:hover:border-amber-400',
  ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-300',
        link: 'text-amber-600 underline-offset-4 hover:underline'
      },
      size: {
        default: 'px-6 py-3',
        sm: 'px-3 py-2 text-sm',
        lg: 'px-8 py-4 text-lg',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

export { buttonVariants };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    onClick, 
    variant = 'primary',
    size = 'default',
    className = '',
    type = 'button',
    disabled = false,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
