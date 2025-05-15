import { useState, useEffect } from 'react';
import { ExternalLink, Search, Star, Users, Box, Shield, Mail, Calendar, FileText, Cloud } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { useData } from '../context/DataContext';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  icon: typeof Box;
  isStarred?: boolean;
}

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { createRequestTicket } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tools, setTools] = useState<Tool[]>([
    {
      id: '1',
      name: 'Nextcloud',
      description: 'File sharing and collaboration platform',
      category: 'Storage',
      url: 'https://cloud.company.com',
      icon: Cloud
    },
    {
      id: '2',
      name: 'Roundcube',
      description: 'Webmail client',
      category: 'Communication',
      url: 'https://mail.company.com',
      icon: Mail
    },
    {
      id: '3',
      name: 'Keycloak',
      description: 'Identity and access management',
      category: 'Security',
      url: 'https://auth.company.com',
      icon: Shield
    },
    {
      id: '4',
      name: 'Rocket.Chat',
      description: 'Team chat and collaboration',
      category: 'Communication',
      url: 'https://chat.company.com',
      icon: Users
    },
    {
      id: '5',
      name: 'BookStack',
      description: 'Documentation and knowledge base',
      category: 'Documentation',
      url: 'https://docs.company.com',
      icon: FileText
    },
    {
      id: '7',
      name: 'Confluence',
      description: 'Enterprise wiki and knowledge base',
      category: 'Documentation',
      url: '',
      icon: FileText
    },
    {
      id: '6',
      name: 'Calendar',
      description: 'Shared calendars and scheduling',
      category: 'Organization',
      url: 'https://calendar.company.com',
      icon: Calendar
    }
  ]);

  useEffect(() => {
    document.title = 'Company Tools | Employee Portal';
  }, []);

  const categories = ['all', ...new Set(tools.map(tool => tool.category))];

  const toggleStar = (toolId: string) => {
    setTools(tools.map(tool => 
      tool.id === toolId ? { ...tool, isStarred: !tool.isStarred } : tool
    ));
  };

  const handleAccessRequest = (tool: Tool) => {
    createRequestTicket({
      title: `Access Request: ${tool.name}`,
      description: `Request for access to ${tool.name} (${tool.description})`,
      category: 'IT',
      priority: 'medium'
    });
    alert('Access request has been submitted. You will be notified when access is granted.');
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Company Tools"
        subtitle="Access our self-hosted open source applications"
      />

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search tools..."
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
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-4">
        {filteredTools.map(tool => {
          const Icon = tool.icon;
          return (
            <div key={tool.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <div className="rounded-circle bg-light p-2 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                        <Icon size={24} className="text-orange" />
                      </div>
                    </div>
                    <div>
                      <h5 className="card-title mb-1">{tool.name}</h5>
                      <span className="badge bg-light text-dark">{tool.category}</span>
                    </div>
                    <button 
                      className={`btn btn-link ms-auto ${tool.isStarred ? 'text-warning' : 'text-muted'}`}
                      onClick={() => toggleStar(tool.id)}
                    >
                      <Star size={20} fill={tool.isStarred ? 'currentColor' : 'none'} />
                    </button>
                    {!tool.url && <span className="badge bg-secondary ms-2">Access Required</span>}
                  </div>
                  
                  <p className="card-text text-muted mb-4">{tool.description}</p>
                  
                  <a 
                    href={tool.url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`btn ${tool.url ? 'btn-outline-primary' : 'btn-outline-secondary'} w-100`}
                    onClick={(e) => {
                      if (!tool.url) {
                        e.preventDefault();
                        handleAccessRequest(tool);
                      }
                    }}
                  >
                    {tool.url ? (
                      <>Open Tool <ExternalLink size={16} className="ms-1" /></>
                    ) : (
                      'Request Access'
                    )}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-5">
          <Box size={48} className="text-muted mb-3" />
          <h4>No tools found</h4>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Tools;