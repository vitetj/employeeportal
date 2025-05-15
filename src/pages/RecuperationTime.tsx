import { useState, useEffect } from 'react';
import { RefreshCcw, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { RecupEntry } from '../types';
import PageHeader from '../components/common/PageHeader';

const RecuperationTime = () => {
  const { currentUser } = useAuth();
  const { recupEntries, addRecupEntry, updateRecupEntry, deleteRecupEntry, getRecupStatistics } = useData();
  const recupStats = getRecupStatistics();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: 1,
    reason: '',
  });

  useEffect(() => {
    document.title = 'Recuperation Time | Employee Portal';
  }, []);

  useEffect(() => {
    if (editingId) {
      const entry = recupEntries.find(e => e.id === editingId);
      if (entry) {
        setFormData({
          date: entry.date,
          hours: entry.hours,
          reason: entry.reason,
        });
        setShowForm(true);
      }
    }
  }, [recupEntries, editingId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hours' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing entry
      const entry = recupEntries.find(e => e.id === editingId);
      if (entry) {
        updateRecupEntry({
          ...entry,
          date: formData.date,
          hours: formData.hours,
          reason: formData.reason,
        });
      }
    } else {
      // Add new entry
      addRecupEntry({
        userId: currentUser?.id || '',
        date: formData.date,
        hours: formData.hours,
        reason: formData.reason,
      });
    }
    
    // Reset form
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      hours: 1,
      reason: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      hours: 1,
      reason: '',
    });
    setShowForm(true);
  };

  const handleEdit = (entry: RecupEntry) => {
    setEditingId(entry.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this recuperation time entry?')) {
      deleteRecupEntry(id);
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

  // Sort entries by date, most recent first
  const sortedEntries = [...recupEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Recuperation Time"
        subtitle="Manage overtime and compensation time"
        action={
          <button className="btn btn-orange" onClick={handleAddNew}>
            <Plus size={18} className="me-1" /> New Recup Entry
          </button>
        }
      />

      <div className="row g-4">
        <div className="col-md-8">
          {showForm && (
            <div className="card mb-4 fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">{editingId ? 'Edit Recuperation Entry' : 'New Recuperation Entry'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="date" className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        max={format(new Date(), 'yyyy-MM-dd')}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="hours" className="form-label">Hours</label>
                      <select
                        className="form-select"
                        id="hours"
                        name="hours"
                        value={formData.hours}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="0.5">0.5 hours</option>
                        <option value="1">1 hour</option>
                        <option value="1.5">1.5 hours</option>
                        <option value="2">2 hours</option>
                        <option value="2.5">2.5 hours</option>
                        <option value="3">3 hours</option>
                        <option value="3.5">3.5 hours</option>
                        <option value="4">4 hours</option>
                        <option value="4.5">4.5 hours</option>
                        <option value="5">5 hours</option>
                        <option value="5.5">5.5 hours</option>
                        <option value="6">6 hours</option>
                        <option value="6.5">6.5 hours</option>
                        <option value="7">7 hours</option>
                        <option value="7.5">7.5 hours</option>
                        <option value="8">8 hours</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="reason" className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      id="reason"
                      name="reason"
                      rows={3}
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Explain why you worked overtime"
                      required
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
              <h5 className="card-title mb-0">Recuperation Time Entries</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Hours</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEntries.map(entry => (
                      <tr key={entry.id}>
                        <td>{format(parseISO(entry.date), 'EEE, MMM d, yyyy')}</td>
                        <td>
                          <strong>{entry.hours}</strong> hrs
                        </td>
                        <td>
                          <span className="text-truncate d-inline-block" style={{ maxWidth: '300px' }}>
                            {entry.reason}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${entry.status}`}>
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          {entry.status === 'pending' && (
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
                          )}
                          {entry.status !== 'pending' && (
                            <span className="text-muted small">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    
                    {sortedEntries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <p>No recuperation time entries found</p>
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
              <h5 className="card-title mb-0">Recuperation Time Balance</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0 text-success">{recupStats.totalAvailable.toFixed(1)}</h3>
                <span className="text-muted">hours available</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Pending</h6>
                <span className="fw-bold">{recupStats.totalPending.toFixed(1)} hours</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Used</h6>
                <span className="fw-bold">{recupStats.totalUsed.toFixed(1)} hours</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Recuperation Time Policy</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="me-2 text-orange">•</i>
                  <span>Overtime must be approved by a manager</span>
                </li>
                <li className="mb-2">
                  <i className="me-2 text-orange">•</i>
                  <span>Recuperation time expires after 6 months</span>
                </li>
                <li className="mb-2">
                  <i className="me-2 text-orange">•</i>
                  <span>Maximum 40 hours of recuperation time can be accumulated</span>
                </li>
                <li className="mb-2">
                  <i className="me-2 text-orange">•</i>
                  <span>Recuperation time can be used in increments of 30 minutes</span>
                </li>
                <li>
                  <i className="me-2 text-orange">•</i>
                  <span>Using recuperation time requires manager approval</span>
                </li>
              </ul>
              
              <div className="alert alert-info mt-3">
                <div className="d-flex">
                  <div className="me-3">
                    <RefreshCcw size={24} />
                  </div>
                  <div>
                    <h6 className="mb-1">How to Use Recuperation Time</h6>
                    <p className="small mb-0">To use your accumulated recuperation time, please submit a leave request and select "recuperation time" as the leave type.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperationTime;