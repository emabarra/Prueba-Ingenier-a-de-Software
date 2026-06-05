import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import { useEffect } from 'react';

const icons = {
  success: FiCheckCircle,
  error: FiXCircle,
  warning: FiAlertCircle,
  info: FiInfo,
};

export default function AlertMessage({ type = 'info', message, onClose, autoClose = 5000 }) {
  const Icon = icons[type] || icons.info;

  useEffect(() => {
    if (onClose && autoClose > 0) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [onClose, autoClose]);

  if (!message) return null;

  return (
    <div className={`alert alert--${type}`}>
      <Icon size={20} />
      <span>{message}</span>
      {onClose && (
        <button className="alert__close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
}
