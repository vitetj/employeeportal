import { useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  RefreshCcw, 
  TicketCheck, 
  TrendingUp, 
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { format } from 'date-fns';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { 
    timeEntries, 
    leaveRequests, 
    tickets,
    getTimeStatistics, 
    getLeaveStatistics, 
    getRecupStatistics,
    getTicketStatistics
  } = useData();

  const timeStats = getTimeStatistics();
  const leaveStats = getLeaveStatistics();
  const recupStats = getRecupStatistics();
  const ticketStats = getTicketStatistics();

  useEffect(() => {
    document.title = 'Dashboard | Employee Portal';
  }, []);

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const todayEntry = timeEntries.find(e => e.date === format(new Date(), 'yyyy-MM-dd'));
  
  const upcomingLeave = leaveRequests
    .filter(r => r.status === 'approved' && new Date(r.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title={`Hello, ${currentUser?.name.split(' ')[0]}`}
        subtitle={today}
      />

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Weekly Hours"
            value={`${timeStats.weeklyHours.toFixed(1)} hrs`}
            icon={<Clock size={24} />}
            color="orange"
            subtitle="Target: 37.5 hrs"
            trend={{ value: 2, isPositive: true }}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Leave Balance"
            value={`${leaveStats.remainingVacation} days`}
            icon={<Calendar size={24} />}
            color="primary"
            subtitle="Vacation days remaining"
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Recuperation Hours"
            value={`${recupStats.totalAvailable.toFixed(1)} hrs`}
            icon={<RefreshCcw size={24} />}
            color="success"
            subtitle={`${recupStats.totalPending.toFixed(1)} hrs pending`}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Open Tickets"
            value={ticketStats.totalOpen + ticketStats.totalInProgress}
            icon={<TicketCheck size={24} />}
            color="warning"
            subtitle={`${ticketStats.totalInProgress} in progress`}
          />
        </div>

        <div className="col-md-6">
          <div className="card h-100 fade-in">
            <div className="card-header">
              <h5 className="card-title mb-0">Today's Time Entry</h5>
            </div>
            <div className="card-body">
              {todayEntry ? (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h6 className="mb-1">Working Hours</h6>
                      <p className="text-muted mb-0">{todayEntry.startTime} - {todayEntry.endTime}</p>
                    </div>
                    <div className="text-end">
                      <h6 className="mb-1">Total</h6>
                      <p className="text-muted mb-0">{todayEntry.totalHours} hours</p>
                    </div>
                  </div>
                  
                  <div className="progress mb-3" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-orange" 
                      role="progressbar" 
                      style={{ width: `${(todayEntry.totalHours / 8) * 100}%` }}
                      aria-valuenow={(todayEntry.totalHours / 8) * 100} 
                      aria-valuemin={0} 
                      aria-valuemax={100}
                    ></div>
                  </div>
                  
                  {todayEntry.description && (
                    <div className="mt-3">
                      <h6 className="mb-1">Notes</h6>
                      <p className="text-muted mb-0">{todayEntry.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-3">No time entry recorded for today</p>
                  <a href="/time-tracking" className="btn btn-orange">Record Time</a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card h-100 fade-in">
            <div className="card-header">
              <h5 className="card-title mb-0">Upcoming Leave</h5>
            </div>
            <div className="card-body">
              {upcomingLeave ? (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h6 className="mb-1">{upcomingLeave.type.charAt(0).toUpperCase() + upcomingLeave.type.slice(1)} Leave</h6>
                      <p className="text-muted mb-0">
                        {format(new Date(upcomingLeave.startDate), 'MMM d')} - {format(new Date(upcomingLeave.endDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <span className={`status-badge status-${upcomingLeave.status}`}>
                        {upcomingLeave.status.charAt(0).toUpperCase() + upcomingLeave.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="mb-1">Duration</h6>
                    <p className="text-muted mb-0">{upcomingLeave.totalDays} {upcomingLeave.totalDays > 1 ? 'days' : 'day'}</p>
                  </div>
                  
                  {upcomingLeave.reason && (
                    <div className="mt-3">
                      <h6 className="mb-1">Reason</h6>
                      <p className="text-muted mb-0">{upcomingLeave.reason}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-3">No upcoming leave scheduled</p>
                  <a href="/leave-management" className="btn btn-orange">Request Leave</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row g-4 mt-4">
        <div className="col-12">
          <div className="card fade-in">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Tickets</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.slice(0, 5).map(ticket => (
                      <tr key={ticket.id}>
                        <td>#{ticket.id.slice(0, 8)}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.category}</td>
                        <td>
                          <span className={`badge ${
                            ticket.priority === 'high' || ticket.priority === 'urgent' 
                              ? 'bg-danger' 
                              : ticket.priority === 'medium' 
                                ? 'bg-warning text-dark' 
                                : 'bg-info text-dark'
                          }`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${
                            ticket.status === 'open' || ticket.status === 'in-progress' 
                              ? 'open' 
                              : 'closed'
                          }`}>
                            {ticket.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </td>
                        <td>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</td>
                        <td>
                          <a href={`/tickets?id=${ticket.id}`} className="btn btn-sm btn-outline-primary">View</a>
                        </td>
                      </tr>
                    ))}
                    
                    {tickets.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-4">No tickets found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer text-end">
              <a href="/tickets" className="btn btn-link">View All Tickets</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;