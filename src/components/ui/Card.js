import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  headerAction,
  padding = 'p-6',
  hover = false
}) => {
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200' : '';
  
  return (
    <div className={`bg-white rounded-2xl shadow-md ${hoverClasses} ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      <div className={padding}>
        {children}
      </div>
    </div>
  );
};

export default Card;
