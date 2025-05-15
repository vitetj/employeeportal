import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/common/PageHeader';
import { 
  FileText, 
  Folder, 
  Upload, 
  Download, 
  Search,
  Grid,
  List,
  Filter,
  Plus
} from 'lucide-react';

type ViewMode = 'grid' | 'list';

const Documents = () => {
  const { documents } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    document.title = 'Documents | Employee Portal';
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Documents"
        subtitle="Access and manage your important documents"
        action={
          <button className="btn btn-orange">
            <Upload size={18} className="me-1" /> Upload Document
          </button>
        }
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
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="HR">HR Documents</option>
                <option value="Contracts">Contracts</option>
                <option value="Forms">Forms</option>
                <option value="Reports">Reports</option>
              </select>
            </div>
            <div className="col-md-2">
              <div className="btn-group w-100">
                <button 
                  className={`btn btn-outline-primary ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`btn btn-outline-primary ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="row g-4">
              {/* Folders */}
              <div className="col-md-3">
                <div className="card h-100 cursor-pointer hover-shadow">
                  <div className="card-body text-center">
                    <Folder size={48} className="text-orange mb-3" />
                    <h6 className="mb-0">HR Documents</h6>
                    <small className="text-muted">12 files</small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card h-100 cursor-pointer hover-shadow">
                  <div className="card-body text-center">
                    <Folder size={48} className="text-primary mb-3" />
                    <h6 className="mb-0">Contracts</h6>
                    <small className="text-muted">8 files</small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card h-100 cursor-pointer hover-shadow">
                  <div className="card-body text-center">
                    <Folder size={48} className="text-success mb-3" />
                    <h6 className="mb-0">Forms</h6>
                    <small className="text-muted">15 files</small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="card h-100 cursor-pointer hover-shadow">
                  <div className="card-body text-center">
                    <Folder size={48} className="text-info mb-3" />
                    <h6 className="mb-0">Reports</h6>
                    <small className="text-muted">6 files</small>
                  </div>
                </div>
              </div>

              {/* Files */}
              {filteredDocs.map(doc => (
                <div key={doc.id} className="col-md-3">
                  <div className="card h-100 cursor-pointer hover-shadow">
                    <div className="card-body text-center">
                      <FileText size={48} className="text-muted mb-3" />
                      <h6 className="mb-1">{doc.title}</h6>
                      <small className="text-muted d-block mb-2">{doc.category}</small>
                      <button className="btn btn-sm btn-outline-primary">
                        <Download size={16} className="me-1" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Upload Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(doc => (
                    <tr key={doc.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FileText size={20} className="text-muted me-2" />
                          {doc.title}
                        </div>
                      </td>
                      <td>{doc.category}</td>
                      <td>{doc.uploadDate}</td>
                      <td>
                        <span className={`badge ${
                          doc.status === 'active' ? 'bg-success' :
                          doc.status === 'draft' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          <Download size={16} /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Documents;