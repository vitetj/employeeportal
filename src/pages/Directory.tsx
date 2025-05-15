import { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle, Search, Filter } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

// Mock directory data - in a real app, this would come from your backend
const directoryData = [
  { 
    id: '1',
    name: 'John Smith',
    position: 'Software Engineer',
    department: 'Engineering',
    email: 'john.smith@company.com',
    phone: '1234',
    teams: '@jsmith',
    location: 'Paris Office'
  },
  { 
    id: '2',
    name: 'Sarah Johnson',
    position: 'HR Manager',
    department: 'Human Resources',
    email: 'sarah.johnson@company.com',
    phone: '1235',
    teams: '@sjohnson',
    location: 'Lyon Office'
  },
  { 
    id: '3',
    name: 'Marc Dubois',
    position: 'Security Analyst',
    department: 'IT Security',
    email: 'marc.dubois@company.com',
    phone: '1236',
    teams: '@mdubois',
    location: 'Paris Office'
  },
  { 
    id: '4',
    name: 'Emma Martin',
    position: 'Product Manager',
    department: 'Product',
    email: 'emma.martin@company.com',
    phone: '1237',
    teams: '@emartin',
    location: 'Remote'
  }
];

const departments = ['All Departments', 'Engineering', 'Human Resources', 'IT Security', 'Product'];
const locations = ['All Locations', 'Paris Office', 'Lyon Office', 'Remote'];

const Directory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');

  useEffect(() => {
    document.title = 'Employee Directory | Employee Portal';
  }, []);

  const filteredEmployees = directoryData.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      selectedDepartment === 'All Departments' || 
      employee.department === selectedDepartment;
    
    const matchesLocation = 
      selectedLocation === 'All Locations' || 
      employee.location === selectedLocation;

    return matchesSearch && matchesDepartment && matchesLocation;
  });

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Employee Directory"
        subtitle="Connect with your colleagues"
      />

      <div className="card">
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, position, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <Filter size={18} />
                </span>
                <select
                  className="form-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  className="form-select"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {filteredEmployees.map(employee => (
              <div key={employee.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar me-3" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="card-title mb-1">{employee.name}</h5>
                        <p className="text-muted mb-0">{employee.position}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-light text-dark me-2">{employee.department}</span>
                        <span className="badge bg-light text-dark">{employee.location}</span>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <a 
                        href={`mailto:${employee.email}`} 
                        className="btn btn-outline-primary flex-grow-1"
                        title="Send email"
                      >
                        <Mail size={16} className="me-1" />
                        <span className="d-none d-sm-inline">Email</span>
                      </a>
                      <a 
                        href={`tel:${employee.phone}`} 
                        className="btn btn-outline-primary flex-grow-1"
                        title="Call extension"
                      >
                        <Phone size={16} className="me-1" />
                        <span className="d-none d-sm-inline">Call</span>
                      </a>
                      <a 
                        href={`https://teams.microsoft.com/l/chat/0/0?users=${employee.teams}`}
                        target="_blank"
                        className="btn btn-outline-primary flex-grow-1"
                        title="Chat on Teams"
                      >
                        <MessageCircle size={16} className="me-1" />
                        <span className="d-none d-sm-inline">Teams</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-5">
              <Users size={48} className="text-muted mb-3" />
              <h4>No employees found</h4>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Directory;