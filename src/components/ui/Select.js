import React from 'react';

const Select = ({ 
  label, 
  error, 
  options = [], 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3 border border-gray-200 rounded-xl 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-300 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
