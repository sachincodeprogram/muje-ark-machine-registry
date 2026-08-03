function Alert({ variant = 'error', children }) {
  return (
    <div className={`alert alert--${variant}`} role="alert">
      {children}
    </div>
  );
}

export default Alert;
