import { useState, useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { ShieldCheck, AlertTriangle, Ban, CheckCircle, Mail, Brush as Virus, BarChart } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for antispam statistics
const antispamStats = {
  totalEmails: 1250,
  blockedSpam: 180,
  blockedMalware: 15,
  quarantined: 45,
  lastUpdate: '2024-03-15 10:30',
  dailyStats: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    clean: [120, 150, 140, 160, 145, 90, 85],
    spam: [25, 30, 20, 35, 28, 15, 12],
    malware: [2, 3, 1, 4, 2, 1, 1]
  }
};

const Antispam = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    document.title = 'Antispam Protection | Employee Portal';
  }, []);

  const chartData = {
    labels: antispamStats.dailyStats.labels,
    datasets: [
      {
        label: 'Clean Emails',
        data: antispamStats.dailyStats.clean,
        backgroundColor: '#28A745',
      },
      {
        label: 'Spam',
        data: antispamStats.dailyStats.spam,
        backgroundColor: '#FFC107',
      },
      {
        label: 'Malware',
        data: antispamStats.dailyStats.malware,
        backgroundColor: '#DC3545',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Antispam Protection"
        subtitle="Email security and spam protection statistics"
      />

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Total Emails"
            value={antispamStats.totalEmails}
            icon={<Mail size={24} />}
            color="primary"
            subtitle="Last 7 days"
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Blocked Spam"
            value={antispamStats.blockedSpam}
            icon={<Ban size={24} />}
            color="warning"
            subtitle="Spam emails blocked"
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Blocked Malware"
            value={antispamStats.blockedMalware}
            icon={<Virus size={24} />}
            color="danger"
            subtitle="Malicious attachments"
          />
        </div>
        
        <div className="col-md-6 col-lg-3">
          <StatCard
            title="Quarantined"
            value={antispamStats.quarantined}
            icon={<AlertTriangle size={24} />}
            color="info"
            subtitle="Pending review"
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Email Traffic Analysis</h5>
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeRange('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={`btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeRange('month')}
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Protection Status</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <ShieldCheck size={20} className="text-success me-3" />
                    <span>Antispam Engine</span>
                  </div>
                  <span className="badge bg-success">Active</span>
                </div>
                <div className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Virus size={20} className="text-success me-3" />
                    <span>Malware Protection</span>
                  </div>
                  <span className="badge bg-success">Active</span>
                </div>
                <div className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <BarChart size={20} className="text-success me-3" />
                    <span>Pattern Analysis</span>
                  </div>
                  <span className="badge bg-success">Active</span>
                </div>
              </div>
              
              <div className="alert alert-info mt-3">
                <div className="d-flex">
                  <AlertTriangle size={20} className="me-2" />
                  <div>
                    <h6 className="alert-heading mb-1">Last Update</h6>
                    <p className="mb-0 small">{antispamStats.lastUpdate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Quarantine</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {/* Mock quarantined emails */}
                <div className="list-group-item px-0 py-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">Suspicious Newsletter</h6>
                      <small className="text-muted">From: newsletter@example.com</small>
                    </div>
                    <span className="badge bg-warning">Spam</span>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-success">Release</button>
                    <button className="btn btn-outline-danger">Block</button>
                  </div>
                </div>
                
                <div className="list-group-item px-0 py-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">Potential Phishing</h6>
                      <small className="text-muted">From: security@bank-verify.com</small>
                    </div>
                    <span className="badge bg-danger">Malware</span>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-success">Release</button>
                    <button className="btn btn-outline-danger">Block</button>
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

export default Antispam;