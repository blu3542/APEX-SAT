export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...rest
}) => {
  const base = "px-4 py-2 rounded font-medium transition";
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-emerald-500 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
