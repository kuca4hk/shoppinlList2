import './Button.css';

function Button({ text, color = 'primary', action, type = 'button', size = 'normal', disabled = false, active = false }) {
  const className = `btn btn-${color} btn-${size} ${active ? 'active' : ''}`;

  return (
    <button
      type={type}
      className={className}
      onClick={action}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;