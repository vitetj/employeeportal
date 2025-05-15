import { useState, useEffect } from 'react';
import { User, UserCog, Calendar, Clock, RefreshCcw, TicketCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import PageHeader from '../components/common/PageHeader';

const Profile = () => {
  const { currentUser } = useAuth();
  const { getLeaveStatistics, getTimeStatistics, getRecupStatistics, getTicketStatistics } = useData();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    document.title = 'Profile | Employee Portal';
  }, []);

  const leaveStats = getLeaveStatistics();
  const timeStats = getTimeStatistics();
  const recupStats = getRecupStatistics();
  const ticketStats = getTicketStatistics();

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Your Profile"
        subtitle="View and manage your personal information and settings"
      />

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <div className="avatar mx-auto" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {currentUser?.name.charAt(0)}
                </div>
              </div>
              <h5 className="mb-1">{currentUser?.name}</h5>
              <p className="text-muted mb-3">{currentUser?.position}</p>
              <div className="d-flex justify-content-center">
                <span className="badge bg-light text-dark me-2">{currentUser?.department}</span>
                <span className="badge bg-light text-dark">{currentUser?.role}</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <div className="list-group list-group-flush">
                <button 
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={18} className="me-3" />
                  <span>Personal Information</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'time' ? 'active' : ''}`}
                  onClick={() => setActiveTab('time')}
                >
                  <Clock size={18} className="me-3" />
                  <span>Work Time Overview</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'leave' ? 'active' : ''}`}
                  onClick={() => setActiveTab('leave')}
                >
                  <Calendar size={18} className="me-3" />
                  <span>Leave Summary</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'recup' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recup')}
                >
                  <RefreshCcw size={18} className="me-3" />
                  <span>Recuperation Time</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'tickets' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tickets')}
                >
                  <TicketCheck size={18} className="me-3" />
                  <span>Ticket Activity</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <UserCog size={18} className="me-3" />
                  <span>Account Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          {activeTab === 'profile' && (
            <div className="card fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">Personal Information</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label text-muted">Full Name</label>
                    <p className="form-control-plaintext">{currentUser?.name}</p>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted">Email</label>
                    <p className="form-control-plaintext">{currentUser?.email}</p>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted">Employee ID</label>
                    <p className="form-control-plaintext">EMP-{currentUser?.id}</p>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label text-muted">Department</label>
                    <p className="form-control-plaintext">{currentUser?.department}</p>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted">Position</label>
                    <p className="form-control-plaintext">{currentUser?.position}</p>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted">Role</label>
                    <p className="form-control-plaintext">
                      {currentUser?.role === 'admin' ? 'Administrator' : 'User'}
                    </p>
                  </div>
                </div>
                
                <div className="alert alert-light">
                  <p className="mb-0 small">To update your personal information, please contact Human Resources.</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'time' && (
            <div className="card fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">Work Time Overview</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h6 className="mb-3">Weekly Working Hours</h6>
                    <div className="d-flex align-items-center mb-2">
                      <div className="me-3">
                        <span className="fw-bold h3 mb-0">{timeStats.weeklyHours.toFixed(1)}</span>
                        <span className="text-muted ms-1">/ 37.5</span>
                      </div>
                      <div className="flex-grow-1">
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-orange" 
                            role="progressbar" 
                            style={{ width: `${(timeStats.weeklyHours / 37.5) * 100}%` }}
                            aria-valuenow={(timeStats.weeklyHours / 37.5) * 100} 
                            aria-valuemin={0} 
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-muted small">Current week</span>
                  </div>
                  
                  <div className="col-md-6 mb-4">
                    <h6 className="mb-3">Average Daily Hours</h6>
                    <div className="d-flex align-items-center mb-2">
                      <div className="me-3">
                        <span className="fw-bold h3 mb-0">{timeStats.averageDailyHours.toFixed(1)}</span>
                        <span className="text-muted ms-1">/ 7.5</span>
                      </div>
                      <div className="flex-grow-1">
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            role="progressbar" 
                            style={{ width: `${(timeStats.averageDailyHours / 7.5) * 100}%` }}
                            aria-valuenow={(timeStats.averageDailyHours / 7.5) * 100} 
                            aria-valuemin={0} 
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-muted small">Based on your work entries</span>
                  </div>
                  
                  <div className="col-md-6 mb-4">
                    <h6 className="mb-3">Monthly Hours</h6>
                    <span className="fw-bold h3 mb-0">{timeStats.monthlyHours.toFixed(1)}</span>
                    <span className="text-muted small d-block">Current month</span>
                  </div>
                  
                  <div className="col-md-6 mb-4">
                    <h6 className="mb-3">Overtime</h6>
                    <span className={`fw-bold h3 mb-0 ${timeStats.totalOvertime >= 0 ? 'text-success' : 'text-danger'}`}>
                      {timeStats.totalOvertime.toFixed(1)}
                    </span>
                    <span className="text-muted small d-block">Accumulated hours</span>
                  </div>
                </div>
                
                <div className="alert alert-info">
                  <div className="d-flex">
                    <div className="me-3">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h6 className="alert-heading">Work Time Tracking</h6>
                      <p className="mb-0 small">Your regular work schedule is 37.5 hours per week (7.5 hours per day). Overtime hours are logged as recuperation time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'leave' && (
            <div className="card fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">Leave Summary</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">Vacation Days</h6>
                        <div className="d-flex justify-content-center mb-2">
                          <h3 className="mb-0">{leaveStats.remainingVacation}</h3>
                          <span className="text-muted ms-1">/ {currentUser?.leaveBalance.vacation}</span>
                        </div>
                        <span className="badge bg-orange">
                          {leaveStats.usedVacation} days used
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">Sick Leave</h6>
                        <div className="d-flex justify-content-center mb-2">
                          <h3 className="mb-0">{leaveStats.remainingSick}</h3>
                          <span className="text-muted ms-1">/ {currentUser?.leaveBalance.sick}</span>
                        </div>
                        <span className="badge bg-primary">
                          {leaveStats.usedSick} days used
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">Personal Leave</h6>
                        <div className="d-flex justify-content-center mb-2">
                          <h3 className="mb-0">{leaveStats.remainingPersonal}</h3>
                          <span className="text-muted ms-1">/ {currentUser?.leaveBalance.personal}</span>
                        </div>
                        <span className="badge bg-success">
                          {leaveStats.usedPersonal} days used
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="alert alert-warning mt-3">
                  <div className="d-flex">
                    <div className="me-3">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h6 className="alert-heading">Leave Policy Reminder</h6>
                      <p className="mb-0 small">Vacation days reset on January 1st each year. Unused vacation days (max 5) can be carried over to the next year.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'recup' && (
            <div className="card fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">Recuperation Time</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">Available</h6>
                        <h3 className="mb-0 text-success">{recupStats.totalAvailable.toFixed(1)}</h3>
                        <span className="text-muted small">hours</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">Pending</h6>
                        <h3 className="mb-0 text-warning">{recupStats.totalPending.toFixed(1)}</h3>
                        <span className="text-muted small">hours</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">Used</h6>
                        <h3 className="mb-0 text-primary">{recupStats.totalUsed.toFixed(1)}</h3>
                        <span className="text-muted small">hours</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="alert alert-info mt-3">
                  <div className="d-flex">
                    <div className="me-3">
                      <RefreshCcw size={24} />
                    </div>
                    <div>
                      <h6 className="alert-heading">Recuperation Time Guidelines</h6>
                      <p className="mb-0 small">Overtime work is converted to recuperation time. You can use recuperation time for time off by submitting a leave request.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'tickets' && (
            <div className="card fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">Ticket Activity</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">Open</h6>
                        <h3 className="mb-0">{ticketStats.totalOpen}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">In Progress</h6>
                        <h3 className="mb-0">{ticketStats.totalInProgress}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">Resolved</h6>
                        <h3 className="mb-0">{ticketStats.totalResolved}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-3 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-3">Closed</h6>
                        <h3 className="mb-0">{ticketStats.totalClosed}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-center mt-2 mb-4">
                  <a href="/tickets" className="btn btn-orange">
                    <TicketCheck size={18} className="me-2" />
                    View All Tickets
                  </a>
                </div>
                
                <div className="alert alert-light mt-3">
                  <div className="d-flex">
                    <div className="me-3">
                      <TicketCheck size={24} />
                    </div>
                    <div>
                      <h6 className="alert-heading">Support Ticket System</h6>
                      <p className="mb-0 small">Use the ticket system to request help from IT, HR, or Facilities. Track the status of your requests and communicate with support staff.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="card fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">Account Settings</h5>
              </div>
              <div className="card-body">
                <form>
                  <h6 className="mb-3">Password</h6>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input type="password" className="form-control" id="currentPassword" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input type="password" className="form-control" id="newPassword" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" id="confirmPassword" />
                  </div>
                  
                  <hr className="my-4" />
                  
                  <h6 className="mb-3">Notification Preferences</h6>
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                    <label className="form-check-label" htmlFor="emailNotifications">
                      Email Notifications
                    </label>
                    <div className="form-text">Receive email notifications for important updates</div>
                  </div>
                  
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="leaveNotifications" defaultChecked />
                    <label className="form-check-label" htmlFor="leaveNotifications">
                      Leave Request Updates
                    </label>
                    <div className="form-text">Receive notifications when leave requests are updated</div>
                  </div>
                  
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="ticketNotifications" defaultChecked />
                    <label className="form-check-label" htmlFor="ticketNotifications">
                      Ticket Updates
                    </label>
                    <div className="form-text">Receive notifications when tickets are updated</div>
                  </div>
                  
                  <div className="form-check form-switch mb-4">
                    <input className="form-check-input" type="checkbox" id="reminderNotifications" defaultChecked />
                    <label className="form-check-label" htmlFor="reminderNotifications">
                      Reminders
                    </label>
                    <div className="form-text">Receive reminders for time tracking and other tasks</div>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-orange">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;