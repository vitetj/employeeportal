// Common Types

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  position: string;
  avatar?: string;
  leaveBalance: {
    vacation: number;
    sick: number;
    personal: number;
  };
};

export type TimeEntry = {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  breaks: number; // in minutes
  description?: string;
  totalHours: number;
  isComplete: boolean;
};

export type LeaveRequest = {
  id: string;
  userId: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedBy?: string;
  approvalDate?: string;
  comments?: string;
};

export type RecupEntry = {
  id: string;
  userId: string;
  date: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'used';
  approvedBy?: string;
  approvalDate?: string;
};

export type Ticket = {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'IT' | 'HR' | 'Facilities' | 'Security' | 'Other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'incident';
  assignedTo?: string;
  incidentDetails?: {
    type: 'cyber_attack' | 'system_outage' | 'data_breach';
    impactLevel: 'low' | 'medium' | 'high' | 'critical';
    startTime: string;
    resolutionTime?: string;
    affectedSystems: string[];
  };
  responseTime?: number; // in minutes
  createdAt: string;
  updatedAt: string;
  comments: TicketComment[];
};

export type TicketComment = {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type TimeStatistics = {
  weeklyHours: number;
  monthlyHours: number;
  averageDailyHours: number;
  totalOvertime: number;
};

export type LeaveStatistics = {
  usedVacation: number;
  usedSick: number;
  usedPersonal: number;
  remainingVacation: number;
  remainingSick: number;
  remainingPersonal: number;
};

export type RecupStatistics = {
  totalAvailable: number;
  totalUsed: number;
  totalPending: number;
};

export type TicketStatistics = {
  totalOpen: number;
  totalInProgress: number;
  totalResolved: number;
  totalClosed: number;
};

export type MobilePlan = {
  id: string;
  userId: string;
  phoneNumber: string;
  plan: string;
  dataUsage: number;
  dataLimit: number;
  lastBill: number;
  nextRenewal: string;
};

export type Equipment = {
  id: string;
  userId: string;
  type: 'laptop' | 'desktop' | 'phone' | 'tablet' | 'monitor' | 'accessory';
  name: string;
  model: string;
  serialNumber: string;
  assignedDate: string;
  status: 'active' | 'maintenance' | 'retired';
  waptStatus: {
    lastUpdate: string;
    pendingUpdates: number;
    installedPackages: string[];
  };
};

export type SecurityAlert = {
  id: string;
  deviceId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
  resolution?: string;
};

export type OfficePresence = {
  id: string;
  userId: string;
  status: 'office' | 'remote' | 'traveling' | 'sick' | 'vacation';
  location?: string;
  startDate: string;
  endDate?: string;
};

export type Document = {
  id: string;
  userId: string;
  type: 'contract' | 'leave_request' | 'recuperation' | 'equipment_form' | 'other';
  title: string;
  fileName: string;
  uploadDate: string;
  category: string;
  status: 'draft' | 'active' | 'archived';
};

export type VehicleBooking = {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  mileage?: {
    start: number;
    end: number;
  };
};

export type Vehicle = {
  id: string;
  name: string;
  type: 'car' | 'van' | 'truck';
  plate: string;
  seats: number;
  status: 'available' | 'maintenance' | 'booked';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  mileage: number;
};

export type RoomBooking = {
  id: string;
  userId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  attendees: string[];
  description?: string;
  teamsLink?: boolean;
  status: 'confirmed' | 'cancelled';
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    until: string;
  };
  teamsUrl?: string;
};

export type Room = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  features: string[];
  status: 'available' | 'maintenance';
  teamsEnabled?: boolean;
};

export type Expense = {
  id: string;
  userId: string;
  date: string;
  category: 'travel' | 'meals' | 'supplies' | 'equipment' | 'other';
  amount: number;
  currency: string;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  receipt?: string;
  paymentMethod: 'corporate-card' | 'personal-card' | 'cash';
  project?: string;
  approvedBy?: string;
  approvalDate?: string;
  reimbursementDate?: string;
};

export type ExpenseReport = {
  id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  expenses: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  total: number;
  submittedDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  paymentDate?: string;
  comments?: string[];
};