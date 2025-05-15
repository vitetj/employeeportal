import { useState, useEffect } from 'react';
import { Clock, Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import { format, parse, isToday, parseISO } from 'date-fns';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { TimeEntry } from '../types';
import PageHeader from '../components/common/PageHeader';

const TimeTracking = () => {
  const { currentUser } = useAuth();
  const { timeEntries, addTimeEntry, updateTimeEntry, deleteTimeEntry, getTimeStatistics } = useData();
  const timeStats = getTimeStatistics();
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    startTime: '09:00',
    endTime: '17:30',
    breaks: 60,
    description: '',
  });

  useEffect(() => {
    document.title = 'Time Tracking | Employee Portal';
  }, []);

  useEffect(() => {
    // Check if there's an entry for today
    const todayEntry = timeEntries.find(e => e.date === format(new Date(), 'yyyy-MM-dd'));
    
    // If editing or there's a today entry, populate the form
    if (editingId) {
      const entry = timeEntries.find(e => e.id === editingId);
      if (entry) {
        setFormData({
          startTime: entry.startTime,
          endTime: entry.endTime,
          breaks: entry.breaks,
          description: entry.description || '',
        });
        setSelectedDate(entry.date);
        setShowForm(true);
      }
    } else if (todayEntry && isToday(parseISO(todayEntry.date))) {
      setFormData({
        startTime: todayEntry.startTime,
        endTime: todayEntry.endTime,
        breaks: todayEntry.breaks,
        description: todayEntry.description || '',
      });
      setEditingId(todayEntry.id);
    }
  }, [timeEntries, editingId]);

  const calculateTotalHours = (start: string, end: string, breakMinutes: number) => {
    const startTime = parse(start, 'HH:mm', new Date());
    const endTime = parse(end, 'HH:mm', new Date());
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours - (breakMinutes / 60));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'breaks' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalHours = calculateTotalHours(formData.startTime, formData.endTime, formData.breaks);
    
    if (editingId) {
      // Update existing entry
      updateTimeEntry({
        id: editingId,
        userId: currentUser?.id || '',
        date: selectedDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        breaks: formData.breaks,
        description: formData.description,
        totalHours,
        isComplete: true,
      });
    } else {
      // Add new entry
      addTimeEntry({
        userId: currentUser?.id || '',
        date: selectedDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        breaks: formData.breaks,
        description: formData.description,
        totalHours,
        isComplete: true,
      });
    }
    
    // Reset form
    setFormData({
      startTime: '09:00',
      endTime: '17:30',
      breaks: 60,
      description: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    setFormData({
      startTime: '09:00',
      endTime: '17:30',
      breaks: 60,
      description: '',
    });
    setShowForm(true);
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingId(entry.id);
    setSelectedDate(entry.date);
    setFormData({
      startTime: entry.startTime,
      endTime: entry.endTime,
      breaks: entry.breaks,
      description: entry.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      deleteTimeEntry(id);
      if (editingId === id) {
        setEditingId(null);
        setShowForm(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
  };

  // Sort entries by date, newest first
  const sortedEntries = [...timeEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Time Tracking"
        subtitle="Record and manage your daily work hours"
        action={
          <button className="btn btn-orange" onClick={handleAddNew}>
            <Plus size={18} className="me-1" /> New Time Entry
          </button>
        }
      />

      <div className="row g-4">
        <div className="col-md-8">
          {showForm && (
            <div className="card mb-4 fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">{editingId ? 'Edit Time Entry' : 'New Time Entry'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="date" className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={format(new Date(), 'yyyy-MM-dd')}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="startTime" className="form-label">Start Time</label>
                      <input
                        type="time"
                        className="form-control"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="endTime" className="form-label">End Time</label>
                      <input
                        type="time"
                        className="form-control"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="breaks" className="form-label">Breaks (minutes)</label>
                      <select
                        className="form-select"
                        id="breaks"
                        name="breaks"
                        value={formData.breaks}
                        onChange={handleInputChange}
                      >
                        <option value="0">No break</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                    <div className="col-md-8">
                      <label htmlFor="totalHours" className="form-label">Total Hours</label>
                      <input
                        type="text"
                        className="form-control"
                        id="totalHours"
                        value={calculateTotalHours(formData.startTime, formData.endTime, formData.breaks).toFixed(2)}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description / Tasks</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="What did you work on today?"
                    ></textarea>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-light me-2" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-orange">
                      {editingId ? 'Update Entry' : 'Save Entry'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Time Entries</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Hours</th>
                      <th>Time Range</th>
                      <th>Breaks</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEntries.slice(0, 10).map(entry => (
                      <tr key={entry.id}>
                        <td>
                          {isToday(parseISO(entry.date)) 
                            ? <strong className="text-orange">Today</strong> 
                            : format(parseISO(entry.date), 'EEE, MMM d')
                          }
                        </td>
                        <td>
                          <strong>{entry.totalHours.toFixed(2)}</strong> hrs
                        </td>
                        <td>{entry.startTime} - {entry.endTime}</td>
                        <td>{entry.breaks} min</td>
                        <td>
                          <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                            {entry.description || '-'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button 
                              className="btn btn-sm btn-outline-primary" 
                              onClick={() => handleEdit(entry)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleDelete(entry.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {sortedEntries.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <p>No time entries found</p>
                          <button className="btn btn-orange" onClick={handleAddNew}>
                            Create First Entry
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Time Statistics</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Week to Date</h6>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-orange" 
                    role="progressbar" 
                    style={{ width: `${(timeStats.weeklyHours / 37.5) * 100}%` }}
                    aria-valuenow={(timeStats.weeklyHours / 37.5) * 100} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  ></div>
                </div>
                <div className="d-flex justify-content-between">
                  <small>{timeStats.weeklyHours.toFixed(1)} hrs</small>
                  <small>Target: 37.5 hrs</small>
                </div>
              </div>
              
              <div className="mb-3">
                <h6>Monthly Hours</h6>
                <h3 className="mb-0">{timeStats.monthlyHours.toFixed(1)} <small className="text-muted">hrs</small></h3>
              </div>
              
              <div className="mb-3">
                <h6>Avg. Daily Hours</h6>
                <h3 className="mb-0">{timeStats.averageDailyHours.toFixed(1)} <small className="text-muted">hrs</small></h3>
              </div>
              
              <div>
                <h6>Overtime</h6>
                <h3 className={`mb-0 ${timeStats.totalOvertime >= 0 ? 'text-success' : 'text-danger'}`}>
                  {timeStats.totalOvertime.toFixed(1)} <small className="text-muted">hrs</small>
                </h3>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Reminders</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="me-3 text-warning">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h6 className="mb-1">Daily Update</h6>
                  <p className="text-muted mb-0 small">Remember to update your time card before leaving for the day.</p>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <div className="me-3 text-info">
                  <Clock size={24} />
                </div>
                <div>
                  <h6 className="mb-1">Weekly Report</h6>
                  <p className="text-muted mb-0 small">Weekly time reports are generated every Friday. Make sure all entries are complete.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;