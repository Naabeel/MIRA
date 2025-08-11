// API Response Interfaces - Structured for real API integration

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// Dashboard API Responses
export interface DashboardStatsResponse {
  totalTickets: number;
  overdueTickets: number;
  averageResolutionTime: number;
  activeTickets: number;
  statusBreakdown: {
    open: number;
    pending: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  categoryBreakdown: {
    profile: number;
    rate_negotiation: number;
    project: number;
    payments: number;
    idnc: number;
    others: number;
  };
  priorityBreakdown: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

export interface TicketListResponse {
  tickets: TicketItem[];
  filters: {
    category?: string;
    status?: string;
    priority?: string;
    assignee?: string;
  };
}

export interface TicketItem {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'profile' | 'rate_negotiation' | 'project' | 'payments' | 'idnc' | 'others';
  assigneeId: string;
  requesterId: string;
  networkMemberId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags: string[];
  customFields: Record<string, any>;
  daysOverdue?: number;
}

export interface NetworkMemberResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  department: string;
  location: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface TicketDetailResponse {
  ticket: TicketItem;
  networkMember: NetworkMemberResponse;
  dataSourcesInfo: {
    prism: PrismDataResponse;
    streamliner: StreamlinerDataResponse;
    revelio: RevelioDataResponse;
    salesforce: SalesforceDataResponse;
    knowledgeBase: KnowledgeBaseDataResponse;
  };
  comments: CommentItem[];
  attachments: AttachmentItem[];
}

export interface CommentItem {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  isPublic: boolean;
  attachments?: string[];
}

export interface AttachmentItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

// Data Source API Responses
export interface PrismDataResponse {
  networkMemberId: string;
  backgroundCheck: {
    status: 'passed' | 'failed' | 'pending';
    completedDate?: string;
    clearanceLevel: 'green' | 'yellow' | 'red';
    notes?: string;
  };
  identityVerification: {
    verified: boolean;
    documents: string[];
    verificationDate?: string;
  };
  criminalHistory: {
    records: Array<{
      id: string;
      type: string;
      date: string;
      status: 'cleared' | 'pending' | 'flagged';
    }>;
    lastChecked: string;
  };
}

export interface StreamlinerDataResponse {
  networkMemberId: string;
  performanceMetrics: {
    totalProjects: number;
    totalValue: number;
    averageRating: number;
    completionRate: number;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    client: string;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    value: number;
    currency: string;
    startDate: string;
    endDate?: string;
    role: string;
  }>;
}

export interface RevelioDataResponse {
  networkMemberId: string;
  professionalProfile: {
    linkedInUrl?: string;
    headline?: string;
    connections: number;
    professionalScore: number;
    skills: string[];
  };
  publicSentiment: {
    score: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    mentions: number;
    articles: number;
  };
  riskFactors: string[];
}

export interface SalesforceDataResponse {
  networkMemberId: string;
  contractInfo: {
    status: 'active' | 'expired' | 'pending' | 'terminated';
    value: number;
    currency: string;
    startDate: string;
    endDate?: string;
    renewalDate?: string;
  };
  complianceItems: Array<{
    id: string;
    title: string;
    type: 'contract' | 'tax' | 'certification' | 'policy' | 'training';
    status: 'compliant' | 'non_compliant' | 'pending' | 'expired';
    dueDate?: string;
    completedDate?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  recentPayments: Array<{
    id: string;
    amount: number;
    currency: string;
    date: string;
    status: 'paid' | 'pending' | 'overdue' | 'cancelled';
    invoiceNumber: string;
  }>;
}

export interface KnowledgeBaseDataResponse {
  networkMemberId: string;
  documents: Array<{
    id: string;
    title: string;
    type: 'contract' | 'resume' | 'certification' | 'reference' | 'other';
    uploadDate: string;
    size: number;
    url: string;
  }>;
  interactions: Array<{
    id: string;
    type: 'email' | 'call' | 'meeting' | 'message';
    subject: string;
    date: string;
    participants: string[];
    outcome?: string;
  }>;
  notes: Array<{
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    isPrivate: boolean;
  }>;
}

// UI State Interfaces
export interface DashboardState {
  selectedCategory: string | null;
  selectedTicket: string | null;
  expandedSections: {
    ticketQueue: boolean;
    ticketList: boolean;
    ticketDetails: boolean;
    networkMember: boolean;
    dataSourcesInfo: boolean;
  };
  filters: {
    status?: string[];
    priority?: string[];
    assignee?: string;
  };
}

export interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string | number;
  icon?: React.ReactNode;
}
