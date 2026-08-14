import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const inputClass =
  'w-full bg-[#f9f9f7] border border-gray-200 text-gray-900 px-4 py-3 pr-11 text-sm focus:outline-none focus:border-black transition-colors rounded-none placeholder-gray-400';

function PasswordInput({
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  disabled = false,
  minLength,
  id,
  autoComplete = 'current-password',
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className={inputClass}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        minLength={minLength}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-800 transition-colors touch-manipulation"
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default PasswordInput;
