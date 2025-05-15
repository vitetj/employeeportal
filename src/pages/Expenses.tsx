import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Receipt, Plus, FileText, CreditCard, Calendar, Filter, Search, Download } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { format, parseISO } from 'date-fns';
import { createWorker } from 'tesseract.js';
import { Expense, ExpenseReport } from '../types';

// Mock data
const mockExpenses: Expense[] = [
  {
    id: '1',
    userId: '1',
    date: '2024-03-10',
    category: 'travel',
    amount: 125.50,
    currency: 'EUR',
    description: 'Train ticket to Lyon',
    status: 'approved',
    paymentMethod: 'corporate-card',
    approvedBy: 'Manager Name',
    approvalDate: '2024-03-11'
  },
  {
    id: '2',
    userId: '1',
    date: '2024-03-12',
    category: 'meals',
    amount: 45.80,
    currency: 'EUR',
    description: 'Business lunch with client',
    status: 'pending',
    paymentMethod: 'personal-card'
  }
];

const mockReports: ExpenseReport[] = [
  {
    id: '1',
    userId: '1',
    title: 'March Business Trip',
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    expenses: ['1', '2'],
    status: 'submitted',
    total: 171.30,
    submittedDate: '2024-03-13'
  }
];

const Expenses = () => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'reports'>('expenses');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [newExpense, setNewExpense] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'travel',
    amount: '',
    currency: 'EUR',
    description: '',
    paymentMethod: 'corporate-card',
    receipt: null as File | null
  });

  const [newReport, setNewReport] = useState({
    title: '',
    startDate: '',
    endDate: '',
    expenses: [] as string[]
  });

  useEffect(() => {
    document.title = 'Expenses | Employee Portal';
  }, []);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle expense submission
    setShowExpenseForm(false);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle report submission
    setShowReportForm(false);
  };

  const handleReceiptUpload = async (file: File) => {
    setIsProcessing(true);
    setReceiptPreview(URL.createObjectURL(file));
    
    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(file);
      setOcrResult(text);
      
      // Auto-fill form based on OCR results
      const amountMatch = text.match(/(?:€|EUR)\s*(\d+(?:\.\d{2})?)/i);
      const dateMatch = text.match(/(\d{2}[-/.]\d{2}[-/.]\d{4})/);
      
      if (amountMatch) {
        setNewExpense(prev => ({ ...prev, amount: amountMatch[1] }));
      }
      if (dateMatch) {
        const [day, month, year] = dateMatch[1].split(/[-/.]/);
        setNewExpense(prev => ({ ...prev, date: `${year}-${month}-${day}` }));
      }
      
      await worker.terminate();
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="container-fluid px-4">
      <PageHeader 
        title="Expenses"
        subtitle="Manage your expenses and reports"
        action={
          <div className="d-flex gap-2">
            <button 
              className="btn btn-orange"
              onClick={() => setShowExpenseForm(true)}
            >
              <Plus size={18} className="me-1" />
              New Expense
            </button>
            {selectedExpenses.length > 0 && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowReportForm(true)}
              >
                <FileText size={18} className="me-1" />
                Create Report
              </button>
            )}
          </div>
        }
      />

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`}
                onClick={() => setActiveTab('expenses')}
              >
                <Receipt size={18} className="me-2" />
                Expenses
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                <FileText size={18} className="me-2" />
                Reports
              </button>
            </li>
          </ul>
        </div>
        
        <div className="card-body">
          {activeTab === 'expenses' && (
            <>
              {showExpenseForm && (
                <div className="card mb-4 fade-in">
                  <div className="card-header">
                    <h5 className="card-title mb-0">New Expense</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleExpenseSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Category</label>
                          <select
                            className="form-select"
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({...newExpense, category: e.target.value as any})}
                            required
                          >
                            <option value="travel">Travel</option>
                            <option value="meals">Meals</option>
                            <option value="supplies">Supplies</option>
                            <option value="equipment">Equipment</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Amount</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              value={newExpense.amount}
                              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                              step="0.01"
                              min="0"
                              required
                            />
                            <select
                              className="form-select"
                              value={newExpense.currency}
                              onChange={(e) => setNewExpense({...newExpense, currency: e.target.value})}
                              style={{ maxWidth: '100px' }}
                            >
                              <option value="EUR">EUR</option>
                              
                              <option value="USD">USD</option>
                              <option value="GBP">GBP</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Payment Method</label>
                          <select
                            className="form-select"
                            value={newExpense.paymentMethod}
                            onChange={(e) => setNewExpense({...newExpense, paymentMethod: e.target.value as any})}
                            required
                          >
                            <option value="corporate-card">Corporate Card</option>
                            <option value="personal-card">Personal Card</option>
                            <option value="cash">Cash</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          value={newExpense.description}
                          onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                          rows={3}
                          required
                        ></textarea>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Receipt</label>
                        <div className="row">
                          <div className="col-md-6">
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setNewExpense({ ...newExpense, receipt: file });
                                  handleReceiptUpload(file);
                                }
                              }}
                              required
                            />
                            <small className="text-muted d-block">Upload receipt image or PDF (max 5MB)</small>
                          </div>
                          <div className="col-md-6">
                            {isProcessing && (
                              <div className="alert alert-info">
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                  <span className="visually-hidden">Processing...</span>
                                </div>
                                Processing receipt...
                              </div>
                            )}
                            {receiptPreview && (
                              <div className="card">
                                <div className="card-body p-2">
                                  <img 
                                    src={receiptPreview} 
                                    alt="Receipt preview" 
                                    className="img-fluid mb-2"
                                    style={{ maxHeight: '200px' }}
                                  />
                                  {ocrResult && (
                                    <div className="mt-2">
                                      <small className="text-muted">Extracted Information:</small>
                                      <pre className="small bg-light p-2 mt-1 mb-0" style={{ maxHeight: '100px', overflow: 'auto' }}>
                                        {ocrResult}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          type="button" 
                          className="btn btn-light"
                          onClick={() => setShowExpenseForm(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-orange">
                          Save Expense
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search expenses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <Filter size={18} />
                    </span>
                    <select
                      className="form-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="paid">Paid</option>
                    </select>
                    <select
                      className="form-select"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="travel">Travel</option>
                      <option value="meals">Meals</option>
                      <option value="supplies">Supplies</option>
                      <option value="equipment">Equipment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedExpenses.length === filteredExpenses.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedExpenses(filteredExpenses.map(exp => exp.id));
                            } else {
                              setSelectedExpenses([]);
                            }
                          }}
                        />
                      </th>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map(expense => (
                      <tr key={expense.id}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedExpenses.includes(expense.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedExpenses([...selectedExpenses, expense.id]);
                              } else {
                                setSelectedExpenses(selectedExpenses.filter(id => id !== expense.id));
                              }
                            }}
                          />
                        </td>
                        <td>{format(parseISO(expense.date), 'MMM d, yyyy')}</td>
                        <td>
                          <span className="text-capitalize">
                            {expense.category}
                          </span>
                        </td>
                        <td>{expense.description}</td>
                        <td>
                          <strong>{expense.amount.toFixed(2)}</strong> {expense.currency}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {expense.paymentMethod === 'corporate-card' ? 'Corporate Card' :
                             expense.paymentMethod === 'personal-card' ? 'Personal Card' : 'Cash'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            expense.status === 'approved' ? 'bg-success' :
                            expense.status === 'rejected' ? 'bg-danger' :
                            expense.status === 'paid' ? 'bg-info' :
                            'bg-warning'
                          }`}>
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary">
                              <FileText size={14} />
                            </button>
                            <button className="btn btn-sm btn-outline-primary">
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'reports' && (
            <>
              {showReportForm && (
                <div className="card mb-4 fade-in">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Create Expense Report</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleReportSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Report Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newReport.title}
                          onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                          placeholder="e.g., March Business Trip"
                          required
                        />
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={newReport.startDate}
                            onChange={(e) => setNewReport({...newReport, startDate: e.target.value})}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={newReport.endDate}
                            onChange={(e) => setNewReport({...newReport, endDate: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Selected Expenses</label>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockExpenses
                                .filter(exp => selectedExpenses.includes(exp.id))
                                .map(expense => (
                                  <tr key={expense.id}>
                                    <td>{format(parseISO(expense.date), 'MMM d, yyyy')}</td>
                                    <td>{expense.description}</td>
                                    <td>{expense.amount.toFixed(2)} {expense.currency}</td>
                                    <td>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => setSelectedExpenses(
                                          selectedExpenses.filter(id => id !== expense.id)
                                        )}
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={2} className="text-end"><strong>Total:</strong></td>
                                <td colSpan={2}>
                                  <strong>
                                    {mockExpenses
                                      .filter(exp => selectedExpenses.includes(exp.id))
                                      .reduce((sum, exp) => sum + exp.amount, 0)
                                      .toFixed(2)
                                    } EUR
                                  </strong>
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          type="button" 
                          className="btn btn-light"
                          onClick={() => setShowReportForm(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-orange">
                          Submit Report
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Report</th>
                      <th>Date Range</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReports.map(report => (
                      <tr key={report.id}>
                        <td>{report.title}</td>
                        <td>
                          {format(parseISO(report.startDate), 'MMM d')} - {format(parseISO(report.endDate), 'MMM d, yyyy')}
                        </td>
                        <td><strong>{report.total.toFixed(2)} EUR</strong></td>
                        <td>
                          <span className={`badge ${
                            report.status === 'approved' ? 'bg-success' :
                            report.status === 'rejected' ? 'bg-danger' :
                            report.status === 'paid' ? 'bg-info' :
                            'bg-warning'
                          }`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </td>
                        <td>{format(parseISO(report.submittedDate!), 'MMM d, yyyy')}</td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-primary">
                              <FileText size={14} />
                            </button>
                            <button className="btn btn-sm btn-outline-primary">
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;