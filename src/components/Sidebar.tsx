import { NavLink } from 'react-router-dom';
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
  return (
    <div className={`sidebar ${isOpen ? 'show' : ''}`}>
      <div className="sidebar-header">
        <h5>Menu</h5>
      </div>

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link d-flex align-items-center">
            <Home size={18} className="me-2" />
            Dashboard
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/time-tracking" className="nav-link d-flex align-items-center">
            <Clock size={18} className="me-2" />
            Time Tracking
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/leave-management" className="nav-link d-flex align-items-center">
            <Calendar size={18} className="me-2" />
            Leave Management
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/recuperation" className="nav-link d-flex align-items-center">
            <RefreshCcw size={18} className="me-2" />
            Recuperation Time
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/bookings" className="nav-link d-flex align-items-center">
            <Car size={18} className="me-2" />
            Bookings
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/expenses" className="nav-link d-flex align-items-center">
            <Receipt size={18} className="me-2" />
            Expenses
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/tickets" className="nav-link d-flex align-items-center">
            <TicketCheck size={18} className="me-2" />
            Ticket System
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/tools" className="nav-link d-flex align-items-center">
            <Wrench size={18} className="me-2" />
            Company Tools
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/equipment" className="nav-link d-flex align-items-center">
            <Laptop size={18} className="me-2" />
            Equipment
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/mobile" className="nav-link d-flex align-items-center">
            <Smartphone size={18} className="me-2" />
            Mobile Plan
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/antispam" className="nav-link d-flex align-items-center">
            <ShieldCheck size={18} className="me-2" />
            Antispam
          </NavLink>
        </li>
        
        <li className="nav-item">
          <NavLink to="/documents" className="nav-link d-flex align-items-center">
            <FileText size={18} className="me-2" />
            Documents
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/directory" className="nav-link d-flex align-items-center">
            <Users size={18} className="me-2" />
            Directory
          </NavLink>
        </li>

        <li className="nav-item mt-auto">
          <NavLink to="/profile" className="nav-link d-flex align-items-center">
            <User size={18} className="me-2" />
            Profile
          </NavLink>
        </li>
      </ul>
      
      <div className="mt-auto p-3">
        <div className="card p-3 bg-light">
          <small className="text-muted">Need help?</small>
          <p className="small mb-0">Contact IT Support at ext. 1234 or create a new ticket in the system.</p>
        </div>

        <a href="/tickets?action=incident" className="btn btn-danger btn-sm d-flex align-items-center justify-content-center mt-2">
          <AlertTriangle size={14} className="me-1" />
          Report Critical Issue
        </a>
      </div>
    </div>
  );
};

export default Sidebar;