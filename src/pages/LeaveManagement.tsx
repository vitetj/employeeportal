import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { format, parseISO, differenceInBusinessDays, addDays } from 'date-fns';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { LeaveRequest } from '../types';
import PageHeader from '../components/common/PageHeader';

const LeaveManagement = () => {
  const { currentUser } = useAuth();
  const { leaveRequests, addLeaveRequest, updateLeaveRequest, deleteLeaveRequest, getLeaveStatistics } = useData();
  const leaveStats = getLeaveStatistics();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'vacation',
    startDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    reason: '',
  });

  useEffect(() => {
    document.title = 'Leave Management | Employee Portal';
  }, []);

  useEffect(() => {
    if (editingId) {
      const request = leaveRequests.find(r => r.id === editingId);
      if (request) {
        setFormData({
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          reason: request.reason,
        });
        setShowForm(true);
      }
    }
  }, [leaveRequests, editingId]);

  const calculateBusinessDays = (start: string, end: string) => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    return differenceInBusinessDays(endDate, startDate) + 1;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalDays = calculateBusinessDays(formData.startDate, formData.endDate);
    
    if (editingId) {
      // Update existing request
      const request = leaveRequests.find(r => r.id === editingId);
      if (request) {
        updateLeaveRequest({
          ...request,
          type: formData.type as any,
          startDate: formData.startDate,
          endDate: formData.endDate,
          totalDays,
          reason: formData.reason,
        });
      }
    } else {
      // Add new request
      addLeaveRequest({
        userId: currentUser?.id || '',
        type: formData.type as any,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays,
        reason: formData.reason,
      });
    }
    
    // Reset form
    setFormData({
      type: 'vacation',
      startDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      reason: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      type: 'vacation',
      startDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      reason: '',
    });
    setShowForm(true);
  };

  const handleEdit = (request: LeaveRequest) => {
    setEditingId(request.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this leave request?')) {
      deleteLeaveRequest(id);
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

  // Sort requests by date, most recent first
  const sortedRequests = [...leaveRequests].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Leave Management"
        subtitle="Request and manage your time off"
        action={
          <button className="btn btn-orange" onClick={handleAddNew}>
            <Plus size={18} className="me-1" /> New Leave Request
          </button>
        }
      />

      <div className="row g-4">
        <div className="col-md-8">
          {showForm && (
            <div className="card mb-4 fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">{editingId ? 'Edit Leave Request' : 'New Leave Request'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="type" className="form-label">Leave Type</label>
                      <select
                        className="form-select"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="vacation">Vacation</option>
                        <option value="sick">Sick Leave</option>
                        <option value="personal">Personal Leave</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="startDate" className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="endDate" className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="totalDays" className="form-label">Total Business Days</label>
                    <input
                      type="text"
                      className="form-control"
                      id="totalDays"
                      value={calculateBusinessDays(formData.startDate, formData.endDate)}
                      readOnly
                    />
                    <small className="text-muted">Weekends are excluded from this calculation</small>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="reason" className="form-label">Reason for Leave</label>
                    <textarea
                      className="form-control"
                      id="reason"
                      name="reason"
                      rows={3}
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Provide details about your leave request"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-light me-2" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-orange">
                      {editingId ? 'Update Request' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Leave Requests</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Dates</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRequests.map(request => (
                      <tr key={request.id}>
                        <td>
                          <span className="fw-semibold">
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                          </span>
                        </td>
                        <td>
                          {format(parseISO(request.startDate), 'MMM d')}
                          {' - '}
                          {format(parseISO(request.endDate), 'MMM d, yyyy')}
                        </td>
                        <td>
                          {request.totalDays} {request.totalDays > 1 ? 'days' : 'day'}
                        </td>
                        <td>
                          <span className={`status-badge status-${request.status}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td>{format(parseISO(request.createdAt), 'MMM d, yyyy')}</td>
                        <td>
                          {request.status === 'pending' && (
                            <div className="btn-group">
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                onClick={() => handleEdit(request)}
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => handleDelete(request.id)}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                          {request.status !== 'pending' && (
                            <span className="text-muted small">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    
                    {sortedRequests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <p>No leave requests found</p>
                          <button className="btn btn-orange" onClick={handleAddNew}>
                            Create First Request
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
              <h5 className="card-title mb-0">Leave Balance</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Vacation</h6>
                <span className="fw-bold">{leaveStats.remainingVacation} days remaining</span>
              </div>
              <div className="progress mb-3" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-orange" 
                  role="progressbar" 
                  style={{ width: `${(leaveStats.remainingVacation / (currentUser?.leaveBalance.vacation || 1)) * 100}%` }}
                  aria-valuenow={(leaveStats.remainingVacation / (currentUser?.leaveBalance.vacation || 1)) * 100} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                ></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Sick Leave</h6>
                <span className="fw-bold">{leaveStats.remainingSick} days remaining</span>
              </div>
              <div className="progress mb-3" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-primary" 
                  role="progressbar" 
                  style={{ width: `${(leaveStats.remainingSick / (currentUser?.leaveBalance.sick || 1)) * 100}%` }}
                  aria-valuenow={(leaveStats.remainingSick / (currentUser?.leaveBalance.sick || 1)) * 100} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                ></div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Personal</h6>
                <span className="fw-bold">{leaveStats.remainingPersonal} days remaining</span>
              </div>
              <div className="progress mb-3" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${(leaveStats.remainingPersonal / (currentUser?.leaveBalance.personal || 1)) * 100}%` }}
                  aria-valuenow={(leaveStats.remainingPersonal / (currentUser?.leaveBalance.personal || 1)) * 100} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Leave Usage</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Vacation Used</h6>
                <span className="fw-bold">{leaveStats.usedVacation} days</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Sick Leave Used</h6>
                <span className="fw-bold">{leaveStats.usedSick} days</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Personal Leave Used</h6>
                <span className="fw-bold">{leaveStats.usedPersonal} days</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Leave Policy</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="me-2 text-orange">•</i>
                  <span>Leave requests should be submitted at least 2 weeks in advance</span>
                </li>
                <li className="mb-2">
                  <i className="me-2 text-orange">•</i>
                  <span>Sick leave requires a doctor's note for absences longer than 3 days</span>
                </li>
                <li className="mb-2">
                  <i className="me-2 text-orange">•</i>
                  <span>Personal leave is limited to 5 days per year</span>
                </li>
                <li>
                  <i className="me-2 text-orange">•</i>
                  <span>Unused vacation days can be carried over (max 5 days)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;