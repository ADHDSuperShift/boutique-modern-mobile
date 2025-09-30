'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-500 hover:to-yellow-600 shadow-amber-500/25 disabled:hover:from-amber-400 disabled:hover:to-yellow-500 font-semibold',
        secondary: 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-100 hover:from-slate-600 hover:to-slate-700 shadow-slate-500/25 disabled:hover:from-slate-700 disabled:hover:to-slate-800',
        outline: 'border-2 border-amber-400 text-amber-400 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-slate-900 bg-transparent hover:border-transparent disabled:hover:bg-transparent disabled:hover:text-amber-400 disabled:hover:border-amber-400',
        ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-600',
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
