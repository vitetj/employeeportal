import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <button 
          className="btn btn-outline-light d-lg-none me-3" 
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
        
        <a className="navbar-brand" href="/">
          <span className="text-orange fw-bold">{t('common.brand.employee')}</span> {t('common.brand.portal')}
        </a>
        
        <div className="d-flex align-items-center ms-auto">
          <div className="position-relative me-3">
            <button 
              className="btn btn-outline-light position-relative" 
              onClick={toggleNotifications}
            >
              <Bell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                2
              </span>
            </button>
            
            <div className="ms-2 d-inline-block">
              <LanguageSelector />
            </div>
            
            {showNotifications && (
              <div className="dropdown-menu dropdown-menu-end show p-0 shadow" style={{ minWidth: '320px' }}>
                <div className="p-3 border-bottom">
                  <h6 className="mb-0">{t('common.notifications')}</h6>
                </div>
                <div className="list-group list-group-flush">
                  <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-bold">{t('notifications.leaveApproved.title')}</p>
                        <p className="text-muted small mb-0">{t('notifications.leaveApproved.message')}</p>
                        <p className="text-muted small">{t('notifications.leaveApproved.time')}</p>
                      </div>
                    </div>
                  </a>
                  <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-bold">{t('notifications.ticketUpdate.title')}</p>
                        <p className="text-muted small mb-0">{t('notifications.ticketUpdate.message')}</p>
                        <p className="text-muted small">{t('notifications.ticketUpdate.time')}</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="p-2 border-top text-center">
                  <a href="#" className="text-decoration-none small">{t('notifications.viewAll')}</a>
                </div>
              </div>
            )}
          </div>
          
          <div className="position-relative">
            <button 
              className="btn btn-outline-light d-flex align-items-center" 
              onClick={toggleUserMenu}
            >
              <div className="avatar me-2">
                {currentUser?.name.charAt(0)}
              </div>
              <span className="d-none d-md-inline">{currentUser?.name}</span>
            </button>
            
            {showUserMenu && (
              <div className="dropdown-menu dropdown-menu-end show shadow">
                <div className="px-4 py-3">
                  <h6 className="mb-0">{currentUser?.name}</h6>
                  <p className="text-muted small mb-2">{currentUser?.email}</p>
                  <p className="small mb-0">{currentUser?.department} - {currentUser?.position}</p>
                </div>
                <div className="dropdown-divider"></div>
                <a 
                  className="dropdown-item d-flex align-items-center" 
                  href="/profile"
                >
                  <User size={16} className="me-2" />
                  {t('common.navigation.profile')}
                </a>
                <button 
                  className="dropdown-item d-flex align-items-center text-danger" 
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="me-2" />
                  {t('common.actions.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;