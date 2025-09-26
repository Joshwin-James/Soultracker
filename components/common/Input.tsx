import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-warm-purple-500 focus:border-warm-purple-500 sm:text-sm transition-shadow duration-200 bg-white text-gray-900"
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;