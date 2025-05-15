import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { 
  Laptop, 
  HardDrive, 
  Download, 
  Shield, 
  Network, 
  FileText,
  Cloud,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Equipment = () => {
  const { equipment, getSecurityAlertsByDevice, mobilePlan } = useData();
  const [selectedDevice, setSelectedDevice] = useState(equipment[0]?.id);

  useEffect(() => {
    document.title = 'Equipment Management | Employee Portal';
  }, []);

  const currentDevice = equipment.find(e => e.id === selectedDevice);
  const securityAlerts = currentDevice ? getSecurityAlertsByDevice(currentDevice.id) : [];

  // Mock data for Windows-specific information
  const windowsStatus = {
    updates: {
      pending: 3,
      critical: 1,
      lastChecked: '2024-03-15 08:00',
    },
    storage: {
      total: 512, // GB
      used: 285,
      free: 227,
    },
    office: {
      license: 'Microsoft 365 E3',
      activatedOn: '2023-12-01',
      products: ['Word', 'Excel', 'PowerPoint', 'Outlook', 'Teams'],
    },
    onedrive: {
      total: 1024, // GB
      used: 156,
      free: 868,
      lastSync: '2024-03-15 09:45',
    },
    vpn: {
      status: 'Connected',
      lastConnection: '2024-03-15 08:15',
      profile: 'Corporate VPN',
    },
  };

  const formatBytes = (gb: number) => {
    if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
    return `${gb.toFixed(1)} GB`;
  };

  const getStoragePercentage = () => {
    return ((windowsStatus.storage.used / windowsStatus.storage.total) * 100).toFixed(1);
  };

  const getOneDrivePercentage = () => {
    return ((windowsStatus.onedrive.used / windowsStatus.onedrive.total) * 100).toFixed(1);
  };

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Equipment Management"
        subtitle="View and manage your assigned devices and software"
      />

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="System Updates"
            value={windowsStatus.updates.pending}
            icon={<Download size={24} />}
            color={windowsStatus.updates.critical > 0 ? 'danger' : 'warning'}
            subtitle={`${windowsStatus.updates.critical} critical updates pending`}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Storage Space"
            value={`${getStoragePercentage()}% used`}
            icon={<HardDrive size={24} />}
            color={getStoragePercentage() > 90 ? 'danger' : 'primary'}
            subtitle={`${formatBytes(windowsStatus.storage.free)} free of ${formatBytes(windowsStatus.storage.total)}`}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="OneDrive Storage"
            value={`${getOneDrivePercentage()}% used`}
            icon={<Cloud size={24} />}
            color="info"
            subtitle={`${formatBytes(windowsStatus.onedrive.free)} free of ${formatBytes(windowsStatus.onedrive.total)}`}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Security Alerts"
            value={securityAlerts.length}
            icon={<Shield size={24} />}
            color={securityAlerts.length > 0 ? 'danger' : 'success'}
            subtitle={securityAlerts.length > 0 ? 'Active alerts detected' : 'No active alerts'}
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Device Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-4">
                    <Laptop size={32} className="text-primary me-3" />
                    <div>
                      <h6 className="mb-1">{currentDevice?.name}</h6>
                      <p className="text-muted mb-0">{currentDevice?.model}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="mb-3">System Details</h6>
                    <div className="list-group list-group-flush">
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between">
                        <span className="text-muted">Serial Number</span>
                        <span>{currentDevice?.serialNumber}</span>
                      </div>
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between">
                        <span className="text-muted">Assigned Date</span>
                        <span>{currentDevice?.assignedDate}</span>
                      </div>
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between">
                        <span className="text-muted">Status</span>
                        <span className="badge bg-success">{currentDevice?.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="mb-3">Office License</h6>
                    <div className="list-group list-group-flush">
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between">
                        <span className="text-muted">License Type</span>
                        <span>{windowsStatus.office.license}</span>
                      </div>
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between">
                        <span className="text-muted">Activated On</span>
                        <span>{windowsStatus.office.activatedOn}</span>
                      </div>
                      <div className="list-group-item px-0 py-2">
                        <span className="text-muted d-block mb-2">Installed Products</span>
                        <div className="d-flex flex-wrap gap-2">
                          {windowsStatus.office.products.map(product => (
                            <span key={product} className="badge bg-light text-dark">
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-4">
                    <h6 className="mb-3">Windows Updates</h6>
                    <div className="list-group list-group-flush">
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                        <span className="text-muted">Pending Updates</span>
                        <span className="badge bg-warning text-dark">{windowsStatus.updates.pending}</span>
                      </div>
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                        <span className="text-muted">Critical Updates</span>
                        <span className="badge bg-danger">{windowsStatus.updates.critical}</span>
                      </div>
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between">
                        <span className="text-muted">Last Checked</span>
                        <span>{windowsStatus.updates.lastChecked}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="mb-3">Storage Usage</h6>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">System Drive (C:)</span>
                        <span>{getStoragePercentage()}% used</span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar ${getStoragePercentage() > 90 ? 'bg-danger' : 'bg-primary'}`}
                          style={{ width: `${getStoragePercentage()}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">
                        {formatBytes(windowsStatus.storage.used)} used of {formatBytes(windowsStatus.storage.total)}
                      </small>
                    </div>
                    
                    <div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">OneDrive</span>
                        <span>{getOneDrivePercentage()}% used</span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className="progress-bar bg-info"
                          style={{ width: `${getOneDrivePercentage()}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">
                        {formatBytes(windowsStatus.onedrive.used)} used of {formatBytes(windowsStatus.onedrive.total)}
                      </small>
                    </div>
                  </div>
                  
                  <div>
                    <h6 className="mb-3">VPN Status</h6>
                    <div className="list-group list-group-flush">
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                        <span className="text-muted">Connection Status</span>
                        <span className={`badge ${windowsStatus.vpn.status === 'Connected' ? 'bg-success' : 'bg-danger'}`}>
                          {windowsStatus.vpn.status}
                        </span>
                      </div>
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between">
                        <span className="text-muted">Last Connection</span>
                        <span>{windowsStatus.vpn.lastConnection}</span>
                      </div>
                      <div className="list-group-item px-0 py-2 d-flex justify-content-between">
                        <span className="text-muted">Profile</span>
                        <span>{windowsStatus.vpn.profile}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Security Status</h5>
            </div>
            <div className="card-body">
              {securityAlerts.length > 0 ? (
                <div className="list-group list-group-flush">
                  {securityAlerts.map(alert => (
                    <div key={alert.id} className="list-group-item px-0 py-3">
                      <div className="d-flex align-items-center mb-2">
                        <AlertTriangle 
                          size={20} 
                          className={`me-2 ${
                            alert.severity === 'critical' ? 'text-danger' :
                            alert.severity === 'high' ? 'text-warning' :
                            'text-info'
                          }`} 
                        />
                        <h6 className="mb-0">{alert.type}</h6>
                      </div>
                      <p className="text-muted small mb-2">{alert.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-dark">{alert.timestamp}</span>
                        <span className={`badge ${
                          alert.status === 'new' ? 'bg-danger' :
                          alert.status === 'investigating' ? 'bg-warning' :
                          'bg-success'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle size={48} className="text-success mb-3" />
                  <h6>All Clear</h6>
                  <p className="text-muted mb-0">No security alerts detected</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Software Compliance</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                  <span>Windows Defender</span>
                  <CheckCircle size={20} className="text-success" />
                </div>
                <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                  <span>SentinelOne</span>
                  <CheckCircle size={20} className="text-success" />
                </div>
                <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                  <span>WAPT Agent</span>
                  <CheckCircle size={20} className="text-success" />
                </div>
                <div className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                  <span>VPN Client</span>
                  <CheckCircle size={20} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipment;