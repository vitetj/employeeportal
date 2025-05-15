import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        title={t('dashboard.welcome', { name: currentUser?.name.split(' ')[0] })}
        subtitle={today}
      />

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <StatCard
            title={t('notifications.stats.weeklyHours')}
            value={`${timeStats.weeklyHours.toFixed(1)} hrs`}
            icon={<Clock size={24} />}
            color="orange"
            subtitle={t('dashboard.target', { hours: '37.5' })}
            trend={{ value: 2, isPositive: true }}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title={t('notifications.stats.leaveBalance')}
            value={`${leaveStats.remainingVacation} days`}
            icon={<Calendar size={24} />}
            color="primary"
            subtitle={t('dashboard.vacationDaysRemaining')}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title={t('notifications.stats.recuperationHours')}
            value={`${recupStats.totalAvailable.toFixed(1)} hrs`}
            icon={<RefreshCcw size={24} />}
            color="success"
            subtitle={t('dashboard.hoursStatus', { hours: recupStats.totalPending.toFixed(1) })}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title={t('notifications.stats.openTickets')}
            value={ticketStats.totalOpen + ticketStats.totalInProgress}
            icon={<TicketCheck size={24} />}
            color="warning"
            subtitle={t('dashboard.ticketsInProgress', { count: ticketStats.totalInProgress })}
          />
        </div>

        <div className="col-md-6">
          <div className="card h-100 fade-in">
            <div className="card-header">
              <h5 className="card-title mb-0">{t('dashboard.todayTimeEntry')}</h5>
            </div>
            <div className="card-body">
              {todayEntry ? (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h6 className="mb-1">{t('dashboard.workingHours')}</h6>
                      <p className="text-muted mb-0">{todayEntry.startTime} - {todayEntry.endTime}</p>
                    </div>
                    <div className="text-end">
                      <h6 className="mb-1">{t('dashboard.total')}</h6>
                      <p className="text-muted mb-0">{t('dashboard.hours', { count: todayEntry.totalHours })}</p>
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
                      <h6 className="mb-1">{t('dashboard.notes')}</h6>
                      <p className="text-muted mb-0">{todayEntry.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-3">{t('dashboard.noTimeEntry')}</p>
                  <a href="/time-tracking" className="btn btn-orange">{t('dashboard.recordTime')}</a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card h-100 fade-in">
            <div className="card-header">
              <h5 className="card-title mb-0">{t('dashboard.upcomingLeave')}</h5>
            </div>
            <div className="card-body">
              {upcomingLeave ? (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h6 className="mb-1">{t(`dashboard.leaveTypes.${upcomingLeave.type}`)}</h6>
                      <p className="text-muted mb-0">
                        {format(new Date(upcomingLeave.startDate), 'MMM d')} - {format(new Date(upcomingLeave.endDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <span className={`status-badge status-${upcomingLeave.status}`}>
                        {t(`common.status.${upcomingLeave.status}`)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="mb-1">{t('dashboard.duration')}</h6>
                    <p className="text-muted mb-0">{t('dashboard.days', { count: upcomingLeave.totalDays })}</p>
                  </div>
                  
                  {upcomingLeave.reason && (
                    <div className="mt-3">
                      <h6 className="mb-1">{t('dashboard.reason')}</h6>
                      <p className="text-muted mb-0">{upcomingLeave.reason}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-3">{t('dashboard.noUpcomingLeave')}</p>
                  <a href="/leave-management" className="btn btn-orange">{t('dashboard.requestLeave')}</a>
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
              <h5 className="card-title mb-0">{t('dashboard.recentTickets')}</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>{t('dashboard.table.id')}</th>
                      <th>{t('dashboard.table.title')}</th>
                      <th>{t('dashboard.table.category')}</th>
                      <th>{t('dashboard.table.priority')}</th>
                      <th>{t('dashboard.table.status')}</th>
                      <th>{t('dashboard.table.created')}</th>
                      <th>{t('dashboard.table.action')}</th>
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
                        <td colSpan={7} className="text-center py-4">{t('dashboard.noTickets')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer text-end">
              <a href="/tickets" className="btn btn-link">{t('dashboard.viewAllTickets')}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;