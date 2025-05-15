import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Clock, 
  AlertTriangle,
  Car,
  Receipt,
  Calendar, 
  RefreshCcw, 
  TicketCheck, 
  Wrench,
  Laptop,
  Smartphone,
  ShieldCheck,
  FileText,
  User,
  Users
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { t } = useTranslation();

  return (
    <div className={`sidebar ${isOpen ? 'show' : ''}`}>
      <div className="sidebar-header">
        <h5>{t('common.navigation.menu')}</h5>
      </div>

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link d-flex align-items-center">
            <Home size={18} className="me-2" />
            {t('common.navigation.dashboard')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/time-tracking" className="nav-link d-flex align-items-center">
            <Clock size={18} className="me-2" />
            {t('common.navigation.timeTracking')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/leave-management" className="nav-link d-flex align-items-center">
            <Calendar size={18} className="me-2" />
            {t('common.navigation.leaveManagement')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/recuperation" className="nav-link d-flex align-items-center">
            <RefreshCcw size={18} className="me-2" />
            {t('common.navigation.recuperation')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/bookings" className="nav-link d-flex align-items-center">
            <Car size={18} className="me-2" />
            {t('common.navigation.bookings')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/expenses" className="nav-link d-flex align-items-center">
            <Receipt size={18} className="me-2" />
            {t('common.navigation.expenses')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/tickets" className="nav-link d-flex align-items-center">
            <TicketCheck size={18} className="me-2" />
            {t('common.navigation.tickets')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/tools" className="nav-link d-flex align-items-center">
            <Wrench size={18} className="me-2" />
            {t('common.navigation.tools')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/equipment" className="nav-link d-flex align-items-center">
            <Laptop size={18} className="me-2" />
            {t('common.navigation.equipment')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/mobile" className="nav-link d-flex align-items-center">
            <Smartphone size={18} className="me-2" />
            {t('common.navigation.mobile')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/antispam" className="nav-link d-flex align-items-center">
            <ShieldCheck size={18} className="me-2" />
            {t('common.navigation.antispam')}
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/documents" className="nav-link d-flex align-items-center">
            <FileText size={18} className="me-2" />
            {t('common.navigation.documents')}
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/directory" className="nav-link d-flex align-items-center">
            <Users size={18} className="me-2" />
            {t('common.navigation.directory')}
          </NavLink>
        </li>

        <li className="nav-item mt-auto">
          <NavLink to="/profile" className="nav-link d-flex align-items-center">
            <User size={18} className="me-2" />
            {t('common.navigation.profile')}
          </NavLink>
        </li>
      </ul>
      
      <div className="mt-auto p-3">
        <div className="card p-3 bg-light">
          <small className="text-muted">{t('common.help.title')}</small>
          <p className="small mb-0">{t('common.help.message')}</p>
        </div>

        <a href="/tickets?action=incident" className="btn btn-danger btn-sm d-flex align-items-center justify-content-center mt-2">
          <AlertTriangle size={14} className="me-1" />
          {t('common.help.reportIssue')}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;