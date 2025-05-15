import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  TicketCheck, Plus, MessageSquare, AlertCircle, Search, 
  AlertTriangle, Clock, Users, Filter, Phone, Mail, 
  MessageCircle, Shield, Activity, CheckCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Ticket, TicketComment } from '../types';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';

const TicketSystem = () => {
  const { currentUser } = useAuth();
  const { tickets, addTicket, updateTicket, deleteTicket, addTicketComment, getTicketStatistics } = useData();
  const ticketStats = getTicketStatistics();
  const [searchParams] = useSearchParams();
  const [showDirectory, setShowDirectory] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'IT',
    priority: 'medium',
  });
  
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    type: 'cyber_attack',
    impactLevel: 'high',
    affectedSystems: [],
  });

  const [newComment, setNewComment] = useState('');
  
  // Mock directory data
  const directory = [
    { id: '1', name: 'IT Support', email: 'it@company.com', phone: '1234', teams: '@itsupport', department: 'IT' },
    { id: '2', name: 'HR Team', email: 'hr@company.com', phone: '1235', teams: '@hrteam', department: 'HR' },
    { id: '3', name: 'Security Team', email: 'security@company.com', phone: '1236', teams: '@securityteam', department: 'Security' },
  ];

  useEffect(() => {
    document.title = 'Ticket System | Employee Portal';
    
    // Check if there's an ID in the URL
    const ticketId = searchParams.get('id');
    if (ticketId) {
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket) {
        setSelectedTicket(ticket);
      }
    }
  }, [searchParams, tickets]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTicket({
      userId: currentUser?.id || '',
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category as any,
      priority: newTicket.priority as any,
    });
    
    setNewTicket({
      title: '',
      description: '',
      category: 'IT',
      priority: 'medium',
    });
    setShowForm(false);
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    addTicket({
      userId: currentUser?.id || '',
      title: newIncident.title,
      description: newIncident.description,
      category: 'Security',
      priority: 'urgent',
      status: 'incident',
      incidentDetails: {
        type: newIncident.type as any,
        impactLevel: newIncident.impactLevel as any,
        startTime: now,
        affectedSystems: newIncident.affectedSystems,
      }
    });
    
    setShowIncidentForm(false);
    setNewIncident({
      title: '',
      description: '',
      type: 'cyber_attack',
      impactLevel: 'high',
      affectedSystems: [],
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTicket && newComment.trim()) {
      addTicketComment(selectedTicket.id, newComment);
      setNewComment('');
    }
  };

  const handleStatusChange = (newStatus: Ticket['status']) => {
    if (selectedTicket) {
      updateTicket({
        ...selectedTicket,
        status: newStatus
      });
    }
  };

  const handleAddNew = () => {
    setSelectedTicket(null);
    setShowForm(true);
  };

  const closeTicketDetails = () => {
    setSelectedTicket(null);
  };

  const filterTickets = (tickets: Ticket[]) => {
    let filtered = tickets;
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => {
        if (filterStatus === 'open-all') {
          return t.status === 'open' || t.status === 'in-progress';
        }
        return t.status === filterStatus;
      });
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  // Sort tickets by date, newest first
  const sortedTickets = [...tickets].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const filteredTickets = filterTickets(sortedTickets);

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title={
          <div className="d-flex align-items-center">
            <span className="me-3">Ticket System</span>
            {selectedTicket?.status === 'incident' && (
              <span className="badge bg-danger d-flex align-items-center">
                <Activity size={16} className="me-1" /> Live Incident
              </span>
            )}
          </div>
        }
        subtitle="Support tickets, incidents, and contact directory"
        action={
          <div className="d-flex gap-2">
            <button className="btn btn-danger" onClick={() => setShowIncidentForm(true)}>
              <AlertTriangle size={18} className="me-1" /> Report Incident
            </button>
            <button className="btn btn-orange" onClick={handleAddNew}>
              <Plus size={18} className="me-1" /> New Ticket
            </button>
          </div>
        }
      />

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard
            title="Open Tickets"
            value={ticketStats.totalOpen}
            icon={<TicketCheck size={24} />}
            color="primary"
            subtitle="Awaiting response"
          />
        </div>
        
        <div className="col-md-3">
          <StatCard
            title="In Progress"
            value={ticketStats.totalInProgress}
            icon={<Clock size={24} />}
            color="warning"
            subtitle="Being worked on"
          />
        </div>
        
        <div className="col-md-3">
          <StatCard
            title="Resolved"
            value={ticketStats.totalResolved}
            icon={<CheckCircle size={24} />}
            color="success"
            subtitle="Last 30 days"
          />
        </div>
        
        <div className="col-md-3">
          <StatCard
            title="Active Incidents"
            value={tickets.filter(t => t.status === 'incident').length}
            icon={<AlertTriangle size={24} />}
            color="danger"
            subtitle="Requires attention"
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Tickets</h5>
                <span className="badge bg-orange">{tickets.length}</span>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Search size={16} />
                  </span>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search tickets..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <select 
                  className="form-select" 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Tickets</option>
                  <option value="open-all">All Open Tickets</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Filter size={16} />
                  </span>
                  <select 
                    className="form-select" 
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <select 
                    className="form-select" 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Security">Security</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
              </div>

              <div className="list-group">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <button
                      key={ticket.id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedTicket?.id === ticket.id ? 'active' : ''}`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="d-flex flex-column align-items-start">
                        <h6 className="mb-1">{ticket.title}</h6>
                        <div className="d-flex align-items-center">
                          <span className={`badge ${
                            ticket.priority === 'high' || ticket.priority === 'urgent' 
                              ? 'bg-danger' 
                              : ticket.priority === 'medium' 
                                ? 'bg-warning text-dark' 
                                : 'bg-info text-dark'
                          }`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                          <small className="text-muted">
                            {format(parseISO(ticket.createdAt), 'MMM d')}
                          </small>
                        </div>
                      </div>
                      <span className={`status-badge status-${
                        ticket.status === 'open' || ticket.status === 'in-progress' 
                          ? 'open' 
                          : 'closed'
                      }`}>
                        {ticket.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-3">No tickets found</p>
                    <button className="btn btn-orange" onClick={handleAddNew}>
                      Create New Ticket
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Ticket Statistics</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Open</h6>
                <span className="fw-bold">{ticketStats.totalOpen}</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">In Progress</h6>
                <span className="fw-bold">{ticketStats.totalInProgress}</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Resolved</h6>
                <span className="fw-bold">{ticketStats.totalResolved}</span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Closed</h6>
                <span className="fw-bold">{ticketStats.totalClosed}</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Contact Directory</h5>
              <button 
                className="btn btn-link"
                onClick={() => setShowDirectory(!showDirectory)}
              >
                {showDirectory ? 'Hide' : 'Show'}
              </button>
            </div>
            {showDirectory && (
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {directory.map(contact => (
                    <div key={contact.id} className="list-group-item px-0">
                      <h6 className="mb-1">{contact.name}</h6>
                      <p className="text-muted mb-2 small">{contact.department}</p>
                      <div className="d-flex gap-2">
                        <a href={`mailto:${contact.email}`} className="btn btn-sm btn-outline-primary">
                          <Mail size={14} />
                        </a>
                        <a href={`tel:${contact.phone}`} className="btn btn-sm btn-outline-primary">
                          <Phone size={14} />
                        </a>
                        <a href={`https://teams.microsoft.com/l/chat/0/0?users=${contact.teams}`} 
                           target="_blank" 
                           className="btn btn-sm btn-outline-primary">
                          <MessageCircle size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-lg-8">
          {showIncidentForm && (
            <div className="card mb-4 fade-in">
              <div className="card-header bg-danger text-white d-flex align-items-center">
                <AlertTriangle size={20} className="me-2" />
                <h5 className="card-title mb-0">Report Security Incident</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleIncidentSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Incident Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newIncident.title}
                      onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                      placeholder="Brief description of the incident"
                      required
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Incident Type</label>
                      <select
                        className="form-select"
                        value={newIncident.type}
                        onChange={(e) => setNewIncident({...newIncident, type: e.target.value})}
                        required
                      >
                        <option value="cyber_attack">Cyber Attack</option>
                        <option value="system_outage">System Outage</option>
                        <option value="data_breach">Data Breach</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Impact Level</label>
                      <select
                        className="form-select"
                        value={newIncident.impactLevel}
                        onChange={(e) => setNewIncident({...newIncident, impactLevel: e.target.value})}
                        required
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Affected Systems</label>
                    <select
                      multiple
                      className="form-select"
                      value={newIncident.affectedSystems}
                      onChange={(e) => setNewIncident({
                        ...newIncident, 
                        affectedSystems: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                      size={4}
                      required
                    >
                      <option value="email">Email System</option>
                      <option value="network">Network Infrastructure</option>
                      <option value="database">Database Servers</option>
                      <option value="web">Web Applications</option>
                      <option value="vpn">VPN Services</option>
                      <option value="workstations">User Workstations</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">Detailed Description</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={newIncident.description}
                      onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                      placeholder="Provide detailed information about the incident..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="alert alert-warning">
                    <div className="d-flex">
                      <AlertTriangle size={20} className="me-2" />
                      <div>
                        <h6 className="alert-heading mb-1">Important Notice</h6>
                        <p className="mb-0 small">This will create a high-priority incident ticket and notify the security team immediately.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-light me-2"
                      onClick={() => setShowIncidentForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-danger">
                      Report Incident
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showForm && (
            <div className="card mb-4 fade-in">
              <div className="card-header">
                <h5 className="card-title mb-0">New Ticket</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={newTicket.title}
                      onChange={handleInputChange}
                      placeholder="Briefly describe your issue"
                      required
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="category" className="form-label">Category</label>
                      <select
                        className="form-select"
                        id="category"
                        name="category"
                        value={newTicket.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="IT">IT Support</option>
                        <option value="HR">Human Resources</option>
                        <option value="Security">Security</option>
                        <option value="Facilities">Facilities</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="priority" className="form-label">Priority</label>
                      <select
                        className="form-select"
                        id="priority"
                        name="priority"
                        value={newTicket.priority}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows={5}
                      value={newTicket.description}
                      onChange={handleInputChange}
                      placeholder="Provide detailed information about your issue"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-light me-2" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-orange">
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {selectedTicket && (
            <div className="card fade-in">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 me-2">{selectedTicket.title}</h5>
                    <span className={`badge ${
                      selectedTicket.priority === 'high' || selectedTicket.priority === 'urgent' ? 'bg-danger' :
                      selectedTicket.priority === 'medium' ? 'bg-warning text-dark' : 'bg-info text-dark'
                    }`}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                    </span>
                  </div>
                  <div className="text-muted small">
                    #{selectedTicket.id.slice(0, 8)} • {selectedTicket.category} • Created on {format(parseISO(selectedTicket.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className={`status-badge me-2 status-${
                    selectedTicket.status === 'open' || selectedTicket.status === 'in-progress' 
                      ? 'open' 
                      : 'closed'
                  }`}>
                    {selectedTicket.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <button type="button" className="btn-close" onClick={closeTicketDetails}></button>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6>Description</h6>
                  <p>{selectedTicket.description}</p>
                  
                  {selectedTicket.incidentDetails && (
                    <div className="alert alert-danger mt-3">
                      <div className="d-flex mb-3">
                        <Shield size={20} className="me-2" />
                        <h6 className="mb-0">Security Incident Details</h6>
                      </div>
                      <div className="list-group list-group-flush">
                        <div className="list-group-item bg-transparent px-0 py-2 d-flex justify-content-between">
                          <span>Type</span>
                          <span className="badge bg-danger text-wrap">
                            {selectedTicket.incidentDetails.type.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </div>
                        <div className="list-group-item bg-transparent px-0 py-2 d-flex justify-content-between">
                          <span>Impact Level</span>
                          <span className="badge bg-danger text-wrap">
                            {selectedTicket.incidentDetails.impactLevel.toUpperCase()}
                          </span>
                        </div>
                        <div className="list-group-item bg-transparent px-0 py-2 d-flex justify-content-between">
                          <span>Start Time</span>
                          <span>{format(parseISO(selectedTicket.incidentDetails.startTime), 'MMM d, yyyy HH:mm')}</span>
                        </div>
                        <div className="list-group-item bg-transparent px-0 py-2">
                          <span className="d-block mb-2">Affected Systems</span>
                          <div className="d-flex flex-wrap gap-2">
                            {selectedTicket.incidentDetails.affectedSystems.map(system => (
                              <span key={system} className="badge bg-danger text-wrap">
                                {system.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedTicket.assignedTo && (
                  <div className="mb-4">
                    <h6>Assigned To</h6>
                    <p>{selectedTicket.assignedTo}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Status</h6>
                    <div className="btn-group">
                      <div className="d-flex flex-wrap gap-2">
                        <button 
                          className={`btn btn-sm ${selectedTicket.status === 'open' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleStatusChange('open')}
                        >
                          Open
                        </button>
                        <button 
                          className={`btn btn-sm ${selectedTicket.status === 'in-progress' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleStatusChange('in-progress')}
                        >
                          In Progress
                        </button>
                        <button 
                          className={`btn btn-sm ${selectedTicket.status === 'resolved' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleStatusChange('resolved')}
                        >
                          Resolved
                        </button>
                        <button 
                          className={`btn btn-sm ${selectedTicket.status === 'closed' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleStatusChange('closed')}
                        >
                          Closed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h6 className="mb-3">Comments ({selectedTicket.comments.length})</h6>
                  
                  {selectedTicket.comments.length > 0 ? (
                    <div className="comment-list">
                      {selectedTicket.comments.map(comment => (
                        <div key={comment.id} className="comment mb-3 p-3 border rounded">
                          <div className="d-flex justify-content-between mb-2">
                            <div className="d-flex align-items-center">
                              <div className="avatar me-2">
                                {comment.userId === currentUser?.id ? currentUser?.name.charAt(0) : 'S'}
                              </div>
                              <span className="fw-semibold">
                                {comment.userId === currentUser?.id ? currentUser?.name : 'Support Staff'}
                              </span>
                            </div>
                            <small className="text-muted">
                              {format(parseISO(comment.createdAt), 'MMM d, yyyy')}
                            </small>
                          </div>
                          <p className="mb-0">{comment.content}</p>
                        </div>
                      ))}
                    
                    </div>
                  ) : (
                    <div className="alert alert-light">
                      <div className="d-flex align-items-center">
                        <MessageSquare size={20} className="me-2" />
                        <span>No comments yet</span>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleCommentSubmit} className="mt-3">
                    <div className="input-group">
                      <textarea
                        className="form-control"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                        required
                      ></textarea>
                      <button type="submit" className="btn btn-primary">
                        <MessageSquare size={18} className="me-1" />
                        Comment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketSystem;