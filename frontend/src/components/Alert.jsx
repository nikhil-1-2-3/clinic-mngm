import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  const style = {
    padding: '0.85rem 1.25rem',
    borderRadius: '10px',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: isSuccess ? '#ecfdf5' : '#fef2f2',
    color: isSuccess ? '#047857' : '#991b1b',
    border: `1px solid ${isSuccess ? '#a7f3d0' : '#fecaca'}`
  };

  return (
    <div style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
