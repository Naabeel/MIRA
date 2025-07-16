export interface NetworkMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  department: string;
  location: string;
  joinDate: string;
  status: "active" | "inactive" | "pending";
}

export interface PrismData {
  networkMemberId: string;
  criminalHistory: {
    records: Array<{
      id: string;
      type: string;
      date: string;
      description: string;
      status: "cleared" | "pending" | "flagged";
    }>;
    lastChecked: string;
    clearanceLevel: "green" | "yellow" | "red";
  };
  backgroundCheck: {
    completed: boolean;
    completedDate?: string;
    results: "passed" | "failed" | "pending";
    notes?: string;
  };
  identification: {
    verified: boolean;
    documents: string[];
    verificationDate?: string;
  };
}

export interface StreamlinerData {
  networkMemberId: string;
  projects: Array<{
    id: string;
    name: string;
    status: "active" | "completed" | "paused" | "cancelled";
    startDate: string;
    endDate?: string;
    role: string;
    client: string;
    value: number;
    currency: string;
    description: string;
    tags: string[];
  }>;
  totalProjects: number;
  totalValue: number;
  averageRating: number;
  completionRate: number;
}

export interface RevelioData {
  networkMemberId: string;
  linkedInProfile: {
    profileUrl?: string;
    headline?: string;
    summary?: string;
    experience: Array<{
      company: string;
      position: string;
      duration: string;
      description?: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      year?: string;
    }>;
    skills: string[];
    connections: number;
  };
  socialMediaPresence: {
    platforms: string[];
    professionalScore: number;
    riskFactors: string[];
  };
  publicInformation: {
    newsArticles: number;
    mentions: number;
    sentiment: "positive" | "neutral" | "negative";
  };
}

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus =
  | "open"
  | "pending"
  | "in_progress"
  | "resolved"
  | "closed";
export type TicketCategory =
  | "profile"
  | "rate_negotiation"
  | "project"
  | "payments"
  | "idnc"
  | "others";

export interface ZendeskTicket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  assigneeId: string;
  requesterId: string;
  networkMemberId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags: string[];
  customFields: Record<string, any>;
  comments: Array<{
    id: string;
    authorId: string;
    body: string;
    createdAt: string;
    public: boolean;
    attachments?: string[];
  }>;
  attachments: string[];
}

export interface SalesforceData {
  networkMemberId: string;
  complianceHistory: Array<{
    id: string;
    type: "contract" | "tax" | "certification" | "policy" | "training";
    title: string;
    status: "compliant" | "non_compliant" | "pending" | "expired";
    dueDate?: string;
    completedDate?: string;
    notes?: string;
    documents: string[];
    priority: "low" | "medium" | "high";
  }>;
  contractStatus: {
    current: "active" | "expired" | "pending" | "terminated";
    startDate?: string;
    endDate?: string;
    renewalDate?: string;
    value: number;
    currency: string;
  };
  paymentHistory: Array<{
    id: string;
    amount: number;
    currency: string;
    date: string;
    status: "paid" | "pending" | "overdue" | "cancelled";
    invoiceNumber: string;
    description: string;
  }>;
}

export interface KnowledgeBaseData {
  networkMemberId: string;
  documents: Array<{
    id: string;
    title: string;
    type: "contract" | "resume" | "certification" | "reference" | "other";
    category: string;
    uploadDate: string;
    lastModified: string;
    size: number;
    url: string;
    tags: string[];
    metadata: Record<string, any>;
  }>;
  notes: Array<{
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    isPrivate: boolean;
  }>;
  interactions: Array<{
    id: string;
    type: "email" | "call" | "meeting" | "message";
    subject: string;
    summary: string;
    date: string;
    participants: string[];
    outcome?: string;
  }>;
}

export interface TicketStatistics {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
  byCategory: Record<TicketCategory, number>;
  averageResolutionTime: number;
  overdueTickets: number;
  recentActivity: number;
}

export interface DashboardData {
  tickets: ZendeskTicket[];
  networkMembers: NetworkMember[];
  statistics: TicketStatistics;
}

export interface TicketDetailData {
  ticket: ZendeskTicket;
  networkMember: NetworkMember;
  prismData: PrismData;
  streamlinerData: StreamlinerData;
  revelioData: RevelioData;
  salesforceData: SalesforceData;
  knowledgeBaseData: KnowledgeBaseData;
}
