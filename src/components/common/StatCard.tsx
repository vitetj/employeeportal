import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  subtitle,
  trend
}) => {
  return (
    <div className="card h-100 fade-in border-0">
      <div className="card-body">
        <div className="d-flex align-items-center mb-4">
          {icon && (
            <div className={`me-4 text-${color}`}>
              {icon}
            </div>
          )}
          <div>
            <h6 className="mb-1 text-muted fw-normal">{title}</h6>
            <h3 className="mb-0 fw-bold">{value}</h3>
          </div>
        </div>
        
        {(subtitle || trend) && (
          <div className="mt-4 d-flex align-items-center">
            {subtitle && <small className="text-muted">{subtitle}</small>}
            
            {trend && (
              <div className={`ms-auto badge ${trend.isPositive ? 'bg-success' : 'bg-danger'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;