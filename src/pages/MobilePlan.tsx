import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/common/PageHeader';
import { Phone, Signal, Database, Calendar, CreditCard, Plus, Globe, LifeBuoy } from 'lucide-react';
import StatCard from '../components/common/StatCard';

const MobilePlan = () => {
  const { mobilePlan } = useData();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState('');

  useEffect(() => {
    document.title = 'Mobile Plan | Employee Portal';
  }, []);

  const handlePlanRequest = (type: string) => {
    setRequestType(type);
    setShowRequestForm(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    createRequestTicket({
      title: `Mobile Plan Change Request: ${requestType}`,
      description: `Request for mobile plan change: ${requestType}\n${(e.target as HTMLFormElement).querySelector('textarea')?.value || ''}`,
      category: 'IT',
      priority: 'medium'
    });
    alert('Your request has been submitted. The IT team will process it shortly.');
    // Reset form
    setShowRequestForm(false);
  };

  const dataUsagePercent = (mobilePlan?.dataUsage / mobilePlan?.dataLimit) * 100;

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Mobile Plan Management"
        subtitle="View and manage your corporate mobile plan"
        action={
          <button className="btn btn-orange" onClick={() => handlePlanRequest('change')}>
            <Plus size={18} className="me-1" /> Request Plan Change
          </button>
        }
      />

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Data Usage"
            value={`${dataUsagePercent.toFixed(1)}%`}
            icon={<Database size={24} />}
            color={dataUsagePercent > 80 ? 'danger' : 'primary'}
            subtitle={`${mobilePlan?.dataUsage}GB of ${mobilePlan?.dataLimit}GB used`}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Next Bill"
            value={`€${mobilePlan?.lastBill}`}
            icon={<CreditCard size={24} />}
            color="success"
            subtitle={`Due on ${mobilePlan?.nextRenewal}`}
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Current Plan"
            value={mobilePlan?.plan}
            icon={<Signal size={24} />}
            color="info"
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Phone Number"
            value={mobilePlan?.phoneNumber}
            icon={<Phone size={24} />}
            color="orange"
          />
        </div>
      </div>

      {showRequestForm && (
        <div className="card mt-4 fade-in">
          <div className="card-header">
            <h5 className="card-title mb-0">Request Plan Change</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitRequest}>
              <div className="mb-3">
                <label className="form-label">Request Type</label>
                <select 
                  className="form-select" 
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  required
                >
                  <option value="">Select request type...</option>
                  <option value="upgrade">Plan Upgrade</option>
                  <option value="downgrade">Plan Downgrade</option>
                  <option value="international">Add International Package</option>
                  <option value="data">Additional Data Package</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Reason for Request</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  placeholder="Please explain why you need this change..."
                  required
                ></textarea>
              </div>
              
              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-light me-2"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-orange">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Usage Details</h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h6 className="mb-3">Data Usage Breakdown</h6>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div 
                    className={`progress-bar ${dataUsagePercent > 80 ? 'bg-danger' : 'bg-primary'}`}
                    style={{ width: `${dataUsagePercent}%` }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">Used: {mobilePlan?.dataUsage}GB</small>
                  <small className="text-muted">Remaining: {(mobilePlan?.dataLimit - mobilePlan?.dataUsage).toFixed(1)}GB</small>
                </div>
              </div>

              <div className="alert alert-info">
                <h6 className="alert-heading mb-1">Data Usage Alert</h6>
                <p className="mb-0 small">You will receive notifications at 80% and 90% of your data limit.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <button 
                  className="list-group-item list-group-item-action d-flex align-items-center"
                  onClick={() => handlePlanRequest('data')}
                >
                  <Database size={18} className="me-3" />
                  Request Additional Data
                </button>
                <button 
                  className="list-group-item list-group-item-action d-flex align-items-center"
                  onClick={() => handlePlanRequest('international')}
                >
                  <Globe size={18} className="me-3" />
                  Add International Package
                </button>
                <button 
                  className="list-group-item list-group-item-action d-flex align-items-center"
                  onClick={() => handlePlanRequest('support')}
                >
                  <LifeBuoy size={18} className="me-3" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePlan;