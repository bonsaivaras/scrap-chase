import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'button';
  const variantClass = `button--${variant}`;
  const classes = [baseClass, variantClass, className].filter(Boolean).join(' ');

  return (
    <button 
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
