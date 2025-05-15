import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays, subDays, parseISO, differenceInDays } from 'date-fns';
import { 
  TimeEntry, 
  LeaveRequest, 
  RecupEntry, 
  Ticket, 
  TicketComment,
  TimeStatistics,
  LeaveStatistics,
  RecupStatistics,
  TicketStatistics,
  MobilePlan,
  Equipment,
  SecurityAlert,
  OfficePresence,
  Document
} from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Time tracking
  timeEntries: TimeEntry[];
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateTimeEntry: (entry: TimeEntry) => void;
  deleteTimeEntry: (id: string) => void;
  getTimeStatistics: () => TimeStatistics;
  
  // Leave management
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateLeaveRequest: (request: LeaveRequest) => void;
  deleteLeaveRequest: (id: string) => void;
  getLeaveStatistics: () => LeaveStatistics;
  
  // Recuperation time
  recupEntries: RecupEntry[];
  addRecupEntry: (entry: Omit<RecupEntry, 'id' | 'status'>) => void;
  updateRecupEntry: (entry: RecupEntry) => void;
  deleteRecupEntry: (id: string) => void;
  getRecupStatistics: () => RecupStatistics;
  
  // Ticket system
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'comments'>) => void;
  updateTicket: (ticket: Ticket) => void;
  deleteTicket: (id: string) => void;
  addTicketComment: (ticketId: string, content: string) => void;
  getTicketStatistics: () => TicketStatistics;
  
  // Request handling
  createRequestTicket: (request: {
    title: string;
    description: string;
    category: Ticket['category'];
    priority?: Ticket['priority'];
  }) => void;
  
  // Mobile plan
  mobilePlan: MobilePlan | null;
  updateMobilePlan: (plan: MobilePlan) => void;
  
  // Equipment
  equipment: Equipment[];
  getEquipment: (id: string) => Equipment | undefined;
  
  // Security alerts
  securityAlerts: SecurityAlert[];
  getSecurityAlertsByDevice: (deviceId: string) => SecurityAlert[];
  updateAlertStatus: (alertId: string, status: SecurityAlert['status'], resolution?: string) => void;
  
  // Office presence
  officePresence: OfficePresence | null;
  updateOfficePresence: (presence: OfficePresence) => void;
  
  // Documents
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'uploadDate'>) => void;
  updateDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Generate mock data
const generateMockTimeEntries = (userId: string): TimeEntry[] => {
  const entries: TimeEntry[] = [];
  const today = new Date();
  
  for (let i = 0; i < 10; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    entries.push({
      id: uuidv4(),
      userId,
      date,
      startTime: '09:00',
      endTime: '17:30',
      breaks: 60,
      description: `Work day ${date}`,
      totalHours: 7.5,
      isComplete: true
    });
  }
  
  return entries;
};

const generateMockLeaveRequests = (userId: string): LeaveRequest[] => {
  const today = new Date();
  
  return [
    {
      id: uuidv4(),
      userId,
      type: 'vacation',
      startDate: format(addDays(today, 14), 'yyyy-MM-dd'),
      endDate: format(addDays(today, 21), 'yyyy-MM-dd'),
      totalDays: 5,
      reason: 'Annual vacation',
      status: 'approved',
      createdAt: format(subDays(today, 30), 'yyyy-MM-dd'),
      approvedBy: 'Manager',
      approvalDate: format(subDays(today, 25), 'yyyy-MM-dd')
    },
    {
      id: uuidv4(),
      userId,
      type: 'personal',
      startDate: format(addDays(today, 5), 'yyyy-MM-dd'),
      endDate: format(addDays(today, 5), 'yyyy-MM-dd'),
      totalDays: 1,
      reason: 'Medical appointment',
      status: 'pending',
      createdAt: format(today, 'yyyy-MM-dd')
    }
  ];
};

const generateMockRecupEntries = (userId: string): RecupEntry[] => {
  const today = new Date();
  
  return [
    {
      id: uuidv4(),
      userId,
      date: format(subDays(today, 10), 'yyyy-MM-dd'),
      hours: 2.5,
      reason: 'Worked overtime on project launch',
      status: 'approved',
      approvedBy: 'Manager',
      approvalDate: format(subDays(today, 8), 'yyyy-MM-dd')
    },
    {
      id: uuidv4(),
      userId,
      date: format(subDays(today, 2), 'yyyy-MM-dd'),
      hours: 1,
      reason: 'Late meeting with client',
      status: 'pending'
    }
  ];
};

const generateMockTickets = (userId: string): Ticket[] => {
  const today = new Date();
  
  return [
    {
      id: uuidv4(),
      userId,
      title: 'Internet connection issue',
      description: 'Having trouble connecting to the office WiFi',
      category: 'IT',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'IT Support',
      createdAt: format(subDays(today, 3), 'yyyy-MM-dd'),
      updatedAt: format(subDays(today, 2), 'yyyy-MM-dd'),
      comments: [
        {
          id: uuidv4(),
          ticketId: 'ticket1',
          userId: 'support1',
          content: 'We are looking into this issue. Could you please provide more details about when it started?',
          createdAt: format(subDays(today, 2), 'yyyy-MM-dd')
        }
      ]
    },
    {
      id: uuidv4(),
      userId,
      title: 'Request for new monitor',
      description: 'Current monitor has dead pixels, requesting replacement',
      category: 'Facilities',
      priority: 'medium',
      status: 'open',
      createdAt: format(today, 'yyyy-MM-dd'),
      updatedAt: format(today, 'yyyy-MM-dd'),
      comments: []
    }
  ];
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '1';
  
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [recupEntries, setRecupEntries] = useState<RecupEntry[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [mobilePlan, setMobilePlan] = useState<MobilePlan | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [officePresence, setOfficePresence] = useState<OfficePresence | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Initialize data when component mounts
  useEffect(() => {
    setTimeEntries(generateMockTimeEntries(userId));
    setLeaveRequests(generateMockLeaveRequests(userId));
    setRecupEntries(generateMockRecupEntries(userId));
    setTickets(generateMockTickets(userId));
    setMobilePlan({
      id: '1',
      userId,
      phoneNumber: '+33 6 12 34 56 78',
      plan: 'Enterprise Premium',
      dataUsage: 15.2,
      dataLimit: 50,
      lastBill: 45.99,
      nextRenewal: format(addDays(new Date(), 15), 'yyyy-MM-dd')
    });
    setEquipment([
      {
        id: '1',
        userId,
        type: 'laptop',
        name: 'MacBook Pro',
        model: 'MBP 16" 2023',
        serialNumber: 'MBP2023XXXX',
        assignedDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
        status: 'active',
        waptStatus: {
          lastUpdate: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
          pendingUpdates: 3,
          installedPackages: ['Chrome', 'Firefox', 'VSCode', 'Docker']
        }
      }
    ]);
    setSecurityAlerts([
      {
        id: '1',
        deviceId: '1',
        severity: 'medium',
        type: 'Suspicious Process',
        description: 'Unusual process activity detected',
        timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        status: 'new'
      }
    ]);
    setOfficePresence({
      id: '1',
      userId,
      status: 'office',
      location: 'Main Office',
      startDate: format(new Date(), 'yyyy-MM-dd')
    });
    setDocuments([
      {
        id: '1',
        userId,
        type: 'contract',
        title: 'Employment Contract',
        fileName: 'contract_2023.pdf',
        uploadDate: format(subDays(new Date(), 180), 'yyyy-MM-dd'),
        category: 'HR',
        status: 'active'
      }
    ]);
  }, [userId]);

  // Time tracking functions
  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry = { ...entry, id: uuidv4() };
    setTimeEntries([...timeEntries, newEntry]);
  };

  const updateTimeEntry = (entry: TimeEntry) => {
    setTimeEntries(timeEntries.map(e => e.id === entry.id ? entry : e));
  };

  const deleteTimeEntry = (id: string) => {
    setTimeEntries(timeEntries.filter(e => e.id !== id));
  };

  const getTimeStatistics = (): TimeStatistics => {
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    return {
      weeklyHours: 37.5, // Typical work week
      monthlyHours: 150,
      averageDailyHours: timeEntries.length ? totalHours / timeEntries.length : 0,
      totalOvertime: totalHours - (timeEntries.length * 7.5) // Assuming 7.5 hours regular day
    };
  };

  // Leave management functions
  const addLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: uuidv4(),
      status: 'pending',
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };
    setLeaveRequests([...leaveRequests, newRequest]);
  };

  const updateLeaveRequest = (request: LeaveRequest) => {
    setLeaveRequests(leaveRequests.map(r => r.id === request.id ? request : r));
  };

  const deleteLeaveRequest = (id: string) => {
    setLeaveRequests(leaveRequests.filter(r => r.id !== id));
  };

  const getLeaveStatistics = (): LeaveStatistics => {
    const approvedRequests = leaveRequests.filter(r => r.status === 'approved');
    
    const usedVacation = approvedRequests
      .filter(r => r.type === 'vacation')
      .reduce((sum, r) => sum + r.totalDays, 0);
      
    const usedSick = approvedRequests
      .filter(r => r.type === 'sick')
      .reduce((sum, r) => sum + r.totalDays, 0);
      
    const usedPersonal = approvedRequests
      .filter(r => r.type === 'personal')
      .reduce((sum, r) => sum + r.totalDays, 0);
    
    return {
      usedVacation,
      usedSick,
      usedPersonal,
      remainingVacation: (currentUser?.leaveBalance.vacation || 0) - usedVacation,
      remainingSick: (currentUser?.leaveBalance.sick || 0) - usedSick,
      remainingPersonal: (currentUser?.leaveBalance.personal || 0) - usedPersonal
    };
  };

  // Recuperation time functions
  const addRecupEntry = (entry: Omit<RecupEntry, 'id' | 'status'>) => {
    const newEntry: RecupEntry = {
      ...entry,
      id: uuidv4(),
      status: 'pending'
    };
    setRecupEntries([...recupEntries, newEntry]);
  };

  const updateRecupEntry = (entry: RecupEntry) => {
    setRecupEntries(recupEntries.map(e => e.id === entry.id ? entry : e));
  };

  const deleteRecupEntry = (id: string) => {
    setRecupEntries(recupEntries.filter(e => e.id !== id));
  };

  const getRecupStatistics = (): RecupStatistics => {
    const available = recupEntries
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + e.hours, 0);
      
    const used = recupEntries
      .filter(e => e.status === 'used')
      .reduce((sum, e) => sum + e.hours, 0);
      
    const pending = recupEntries
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.hours, 0);
    
    return {
      totalAvailable: available,
      totalUsed: used,
      totalPending: pending
    };
  };

  // Ticket system functions
  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'comments'>) => {
    const now = format(new Date(), 'yyyy-MM-dd');
    const newTicket: Ticket = {
      ...ticket,
      id: uuidv4(),
      status: 'open',
      createdAt: now,
      updatedAt: now,
      comments: []
    };
    setTickets([...tickets, newTicket]);
  };

  const updateTicket = (ticket: Ticket) => {
    setTickets(tickets.map(t => t.id === ticket.id ? {
      ...ticket,
      updatedAt: format(new Date(), 'yyyy-MM-dd')
    } : t));
  };

  const deleteTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const addTicketComment = (ticketId: string, content: string) => {
    const newComment: TicketComment = {
      id: uuidv4(),
      ticketId,
      userId,
      content,
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };
    
    setTickets(tickets.map(t => t.id === ticketId ? {
      ...t,
      comments: [...t.comments, newComment],
      updatedAt: format(new Date(), 'yyyy-MM-dd')
    } : t));
  };

  const getTicketStatistics = (): TicketStatistics => {
    return {
      totalOpen: tickets.filter(t => t.status === 'open').length,
      totalInProgress: tickets.filter(t => t.status === 'in-progress').length,
      totalResolved: tickets.filter(t => t.status === 'resolved').length,
      totalClosed: tickets.filter(t => t.status === 'closed').length
    };
  };

  // Generic request ticket creation
  const createRequestTicket = (request: {
    title: string;
    description: string;
    category: Ticket['category'];
    priority?: Ticket['priority'];
  }) => {
    const now = format(new Date(), 'yyyy-MM-dd');
    const newTicket: Ticket = {
      id: uuidv4(),
      userId,
      title: request.title,
      description: request.description,
      category: request.category,
      priority: request.priority || 'medium',
      status: 'open',
      createdAt: now,
      updatedAt: now,
      comments: []
    };
    setTickets([...tickets, newTicket]);
    return newTicket.id;
  };

  return (
    <DataContext.Provider
      value={{
        timeEntries,
        addTimeEntry,
        updateTimeEntry,
        deleteTimeEntry,
        getTimeStatistics,
        
        leaveRequests,
        addLeaveRequest,
        updateLeaveRequest,
        deleteLeaveRequest,
        getLeaveStatistics,
        
        recupEntries,
        addRecupEntry,
        updateRecupEntry,
        deleteRecupEntry,
        getRecupStatistics,
        
        tickets,
        addTicket,
        updateTicket,
        deleteTicket,
        addTicketComment,
        getTicketStatistics,
        createRequestTicket,
        
        mobilePlan,
        updateMobilePlan: setMobilePlan,
        
        equipment,
        getEquipment: (id) => equipment.find(e => e.id === id),
        
        securityAlerts,
        getSecurityAlertsByDevice: (deviceId) => securityAlerts.filter(a => a.deviceId === deviceId),
        updateAlertStatus: (alertId, status, resolution) => {
          setSecurityAlerts(alerts => alerts.map(a => 
            a.id === alertId ? { ...a, status, resolution } : a
          ));
        },
        
        officePresence,
        updateOfficePresence: setOfficePresence,
        
        documents,
        addDocument: (doc) => {
          const newDoc = {
            ...doc,
            id: uuidv4(),
            uploadDate: format(new Date(), 'yyyy-MM-dd')
          };
          setDocuments([...documents, newDoc]);
        },
        updateDocument: (doc) => {
          setDocuments(docs => docs.map(d => d.id === doc.id ? doc : d));
        },
        deleteDocument: (id) => {
          setDocuments(docs => docs.filter(d => d.id !== id));
        }
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}