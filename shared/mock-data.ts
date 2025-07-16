import {
  NetworkMember,
  ZendeskTicket,
  TicketStatistics,
  DashboardData,
  TicketDetailData,
  PrismData,
  StreamlinerData,
  RevelioData,
  SalesforceData,
  KnowledgeBaseData,
} from "./mira-types";

export const mockNetworkMembers: NetworkMember[] = [
  {
    id: "nm_001",
    name: "Sarah Chen",
    email: "sarah.chen@glg.com",
    phone: "+1-555-0123",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    role: "Senior Consultant",
    department: "Healthcare",
    location: "New York, NY",
    joinDate: "2022-03-15",
    status: "active",
  },
  {
    id: "nm_002",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@glg.com",
    phone: "+1-555-0124",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    role: "Principal Engineer",
    department: "Technology",
    location: "San Francisco, CA",
    joinDate: "2021-08-20",
    status: "active",
  },
  {
    id: "nm_003",
    name: "Emily Johnson",
    email: "emily.johnson@glg.com",
    phone: "+1-555-0125",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    role: "Research Director",
    department: "Financial Services",
    location: "London, UK",
    joinDate: "2020-11-10",
    status: "active",
  },
  {
    id: "nm_004",
    name: "David Kim",
    email: "david.kim@glg.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    role: "Strategy Consultant",
    department: "Manufacturing",
    location: "Chicago, IL",
    joinDate: "2023-01-05",
    status: "pending",
  },
];

export const mockTickets: ZendeskTicket[] = [
  {
    id: "zd_001",
    subject: "Update professional profile information",
    description: "Need to update education and work experience on profile",
    status: "open",
    priority: "medium",
    category: "profile",
    assigneeId: "agent_001",
    requesterId: "nm_001",
    networkMemberId: "nm_001",
    createdAt: "2024-01-15T09:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    tags: ["profile_update", "education"],
    customFields: { urgency_level: "standard" },
    comments: [
      {
        id: "comment_001",
        authorId: "nm_001",
        body: "I recently completed my MBA and need to update my profile.",
        createdAt: "2024-01-15T09:30:00Z",
        public: true,
      },
    ],
    attachments: ["resume_updated.pdf"],
  },
  {
    id: "zd_002",
    subject: "Rate increase negotiation for Q2 projects",
    description:
      "Requesting rate adjustment based on experience and market conditions",
    status: "in_progress",
    priority: "high",
    category: "rate_negotiation",
    assigneeId: "agent_002",
    requesterId: "nm_002",
    networkMemberId: "nm_002",
    createdAt: "2024-01-14T11:15:00Z",
    updatedAt: "2024-01-16T10:45:00Z",
    tags: ["rate_increase", "negotiation", "q2_2024"],
    customFields: { current_rate: "$150/hr", requested_rate: "$175/hr" },
    comments: [
      {
        id: "comment_002",
        authorId: "agent_002",
        body: "Reviewing market data for your expertise area.",
        createdAt: "2024-01-16T10:45:00Z",
        public: false,
      },
    ],
    attachments: ["market_analysis.xlsx"],
  },
  {
    id: "zd_003",
    subject: "Project assignment - Healthcare Analytics",
    description: "New project assignment in healthcare analytics domain",
    status: "pending",
    priority: "urgent",
    category: "project",
    assigneeId: "agent_001",
    requesterId: "nm_001",
    networkMemberId: "nm_001",
    createdAt: "2024-01-16T16:00:00Z",
    updatedAt: "2024-01-16T16:00:00Z",
    tags: ["project_assignment", "healthcare", "analytics"],
    customFields: { project_duration: "3_months", client: "confidential" },
    comments: [],
    attachments: ["project_brief.pdf", "nda.pdf"],
  },
  {
    id: "zd_004",
    subject: "Payment delay for December invoices",
    description:
      "December invoice payment is overdue, requesting status update",
    status: "open",
    priority: "high",
    category: "payments",
    assigneeId: "agent_003",
    requesterId: "nm_003",
    networkMemberId: "nm_003",
    createdAt: "2024-01-12T08:30:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
    tags: ["payment_delay", "invoice", "december_2023"],
    customFields: { invoice_amount: "$4,250", due_date: "2024-01-05" },
    comments: [
      {
        id: "comment_003",
        authorId: "agent_003",
        body: "Escalating to finance team for immediate review.",
        createdAt: "2024-01-15T12:00:00Z",
        public: false,
      },
    ],
    attachments: ["invoice_dec_2023.pdf"],
  },
  {
    id: "zd_005",
    subject: "ID verification documentation required",
    description:
      "Additional identity verification documents needed for compliance",
    status: "pending",
    priority: "medium",
    category: "idnc",
    assigneeId: "agent_004",
    requesterId: "nm_004",
    networkMemberId: "nm_004",
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
    tags: ["id_verification", "compliance", "documentation"],
    customFields: { verification_type: "enhanced", deadline: "2024-01-20" },
    comments: [
      {
        id: "comment_004",
        authorId: "nm_004",
        body: "I can provide passport and utility bill. Is that sufficient?",
        createdAt: "2024-01-14T09:15:00Z",
        public: true,
      },
    ],
    attachments: [],
  },
];

export const mockStatistics: TicketStatistics = {
  total: 47,
  byStatus: {
    open: 12,
    pending: 8,
    in_progress: 15,
    resolved: 7,
    closed: 5,
  },
  byPriority: {
    low: 8,
    medium: 22,
    high: 13,
    urgent: 4,
  },
  byCategory: {
    profile: 8,
    rate_negotiation: 12,
    project: 15,
    payments: 6,
    idnc: 4,
    others: 2,
  },
  averageResolutionTime: 3.2,
  overdueTickets: 6,
  recentActivity: 23,
};

export const mockDashboardData: DashboardData = {
  tickets: mockTickets,
  networkMembers: mockNetworkMembers,
  statistics: mockStatistics,
};

export const mockPrismData: PrismData = {
  networkMemberId: "nm_001",
  criminalHistory: {
    records: [],
    lastChecked: "2024-01-01T00:00:00Z",
    clearanceLevel: "green",
  },
  backgroundCheck: {
    completed: true,
    completedDate: "2023-12-15T00:00:00Z",
    results: "passed",
    notes: "Standard background check completed successfully.",
  },
  identification: {
    verified: true,
    documents: ["passport", "driver_license"],
    verificationDate: "2023-12-15T00:00:00Z",
  },
};

export const mockStreamlinerData: StreamlinerData = {
  networkMemberId: "nm_001",
  projects: [
    {
      id: "proj_001",
      name: "Healthcare Digital Transformation",
      status: "active",
      startDate: "2024-01-01",
      role: "Senior Consultant",
      client: "MedTech Corp",
      value: 25000,
      currency: "USD",
      description:
        "Leading digital transformation initiative for healthcare provider",
      tags: ["healthcare", "digital", "transformation"],
    },
    {
      id: "proj_002",
      name: "Pharmaceutical Market Analysis",
      status: "completed",
      startDate: "2023-10-15",
      endDate: "2023-12-30",
      role: "Research Lead",
      client: "BioPharma Inc",
      value: 18000,
      currency: "USD",
      description: "Comprehensive market analysis for new drug launch",
      tags: ["pharmaceutical", "market_research"],
    },
  ],
  totalProjects: 12,
  totalValue: 185000,
  averageRating: 4.8,
  completionRate: 96,
};

export const mockRevelioData: RevelioData = {
  networkMemberId: "nm_001",
  linkedInProfile: {
    profileUrl: "https://linkedin.com/in/sarahchen",
    headline: "Senior Healthcare Consultant | Digital Transformation Expert",
    summary:
      "Experienced healthcare consultant with 8+ years in digital transformation...",
    experience: [
      {
        company: "GLG",
        position: "Senior Consultant",
        duration: "2022 - Present",
        description: "Leading healthcare consulting projects...",
      },
      {
        company: "McKinsey & Company",
        position: "Consultant",
        duration: "2019 - 2022",
        description: "Management consulting across various industries...",
      },
    ],
    education: [
      {
        institution: "Harvard Business School",
        degree: "MBA",
        field: "Healthcare Management",
        year: "2019",
      },
      {
        institution: "Stanford University",
        degree: "Bachelor's",
        field: "Biomedical Engineering",
        year: "2017",
      },
    ],
    skills: ["Healthcare Strategy", "Digital Transformation", "Data Analytics"],
    connections: 2847,
  },
  socialMediaPresence: {
    platforms: ["LinkedIn", "Twitter"],
    professionalScore: 85,
    riskFactors: [],
  },
  publicInformation: {
    newsArticles: 5,
    mentions: 12,
    sentiment: "positive",
  },
};

export const mockSalesforceData: SalesforceData = {
  networkMemberId: "nm_001",
  complianceHistory: [
    {
      id: "comp_001",
      type: "contract",
      title: "Master Service Agreement",
      status: "compliant",
      completedDate: "2023-12-15T00:00:00Z",
      documents: ["msa_signed.pdf"],
      priority: "high",
    },
    {
      id: "comp_002",
      type: "training",
      title: "Data Privacy Training",
      status: "compliant",
      completedDate: "2024-01-10T00:00:00Z",
      documents: ["training_certificate.pdf"],
      priority: "medium",
    },
  ],
  contractStatus: {
    current: "active",
    startDate: "2022-03-15",
    endDate: "2025-03-15",
    renewalDate: "2025-01-15",
    value: 150000,
    currency: "USD",
  },
  paymentHistory: [
    {
      id: "pay_001",
      amount: 4250,
      currency: "USD",
      date: "2024-01-15",
      status: "paid",
      invoiceNumber: "INV-2024-001",
      description: "Healthcare project consulting - January 2024",
    },
    {
      id: "pay_002",
      amount: 3800,
      currency: "USD",
      date: "2023-12-15",
      status: "paid",
      invoiceNumber: "INV-2023-012",
      description: "Market research project - December 2023",
    },
  ],
};

export const mockKnowledgeBaseData: KnowledgeBaseData = {
  networkMemberId: "nm_001",
  documents: [
    {
      id: "doc_001",
      title: "Updated Resume - Sarah Chen",
      type: "resume",
      category: "personal",
      uploadDate: "2024-01-15T00:00:00Z",
      lastModified: "2024-01-15T00:00:00Z",
      size: 245760,
      url: "/documents/resume_sarah_chen.pdf",
      tags: ["resume", "updated", "2024"],
      metadata: { version: "2.1" },
    },
    {
      id: "doc_002",
      title: "Healthcare Certification",
      type: "certification",
      category: "professional",
      uploadDate: "2023-12-01T00:00:00Z",
      lastModified: "2023-12-01T00:00:00Z",
      size: 1024000,
      url: "/documents/healthcare_cert.pdf",
      tags: ["certification", "healthcare"],
      metadata: { issuer: "Healthcare Innovation Institute" },
    },
  ],
  notes: [
    {
      id: "note_001",
      title: "Project Performance Review",
      content: "Excellent performance on the digital transformation project...",
      authorId: "agent_001",
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
      tags: ["performance", "review"],
      isPrivate: true,
    },
  ],
  interactions: [
    {
      id: "int_001",
      type: "call",
      subject: "Project kickoff discussion",
      summary:
        "Discussed project scope and timeline for new healthcare initiative",
      date: "2024-01-12T00:00:00Z",
      participants: ["Sarah Chen", "Project Manager"],
      outcome: "Project approved to proceed",
    },
  ],
};

export const mockTicketDetailData: TicketDetailData = {
  ticket: mockTickets[0],
  networkMember: mockNetworkMembers[0],
  prismData: mockPrismData,
  streamlinerData: mockStreamlinerData,
  revelioData: mockRevelioData,
  salesforceData: mockSalesforceData,
  knowledgeBaseData: mockKnowledgeBaseData,
};
