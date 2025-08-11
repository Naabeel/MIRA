import { useState, useCallback } from "react";
import {
  Ticket,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Settings,
  Package,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  Briefcase,
  Building,
  ExternalLink,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { mockDashboardData, mockTicketDetailData } from "@shared/mock-data";
import type { TicketCategory } from "@shared/mira-types";
import type { DashboardState } from "@shared/api-interfaces";
import { cn } from "@/lib/utils";

const categoryConfig = {
  profile: {
    label: "Profile Management",
    icon: Users,
    color: "bg-glg-navy",
    description: "Profile updates and information changes",
  },
  rate_negotiation: {
    label: "Rate Negotiation",
    icon: DollarSign,
    color: "bg-glg-teal",
    description: "Rate adjustments and negotiations",
  },
  project: {
    label: "Project Management",
    icon: Package,
    color: "bg-glg-blue",
    description: "Project assignments and management",
  },
  payments: {
    label: "Payments & Invoicing",
    icon: DollarSign,
    color: "bg-glg-green",
    description: "Payment issues and invoice queries",
  },
  idnc: {
    label: "Identity & Compliance",
    icon: Settings,
    color: "bg-glg-amber",
    description: "Identity verification and compliance",
  },
  others: {
    label: "General Inquiries",
    icon: FileText,
    color: "bg-glg-600",
    description: "Miscellaneous requests and inquiries",
  },
};

const priorityColors = {
  low: "bg-glg-200 text-glg-800",
  medium: "bg-glg-blue text-white",
  high: "bg-glg-amber text-white",
  urgent: "bg-glg-red text-white",
};

const statusColors = {
  open: "bg-glg-blue text-white",
  pending: "bg-glg-amber text-white",
  in_progress: "bg-glg-navy text-white",
  resolved: "bg-glg-green text-white",
  closed: "bg-glg-600 text-white",
};

export default function UnifiedDashboard() {
  const { statistics, tickets, networkMembers } = mockDashboardData;
  
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    selectedCategory: null,
    selectedTicket: null,
    expandedSections: {
      ticketQueue: true,
      ticketList: false,
      ticketDetails: false,
      networkMember: false,
      dataSourcesInfo: false,
    },
    filters: {},
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const toggleSection = useCallback((section: keyof typeof dashboardState.expandedSections) => {
    setDashboardState(prev => ({
      ...prev,
      expandedSections: {
        ...prev.expandedSections,
        [section]: !prev.expandedSections[section],
      },
    }));
  }, []);

  const handleCategorySelect = useCallback((category: TicketCategory) => {
    setDashboardState(prev => ({
      ...prev,
      selectedCategory: category,
      selectedTicket: null,
      expandedSections: {
        ...prev.expandedSections,
        ticketList: true,
        ticketDetails: false,
      },
    }));
  }, []);

  const handleTicketSelect = useCallback((ticketId: string) => {
    setDashboardState(prev => ({
      ...prev,
      selectedTicket: ticketId,
      expandedSections: {
        ...prev.expandedSections,
        ticketDetails: true,
        networkMember: true,
        dataSourcesInfo: true,
      },
    }));
  }, []);

  const getFilteredTickets = useCallback(() => {
    let filtered = tickets;
    
    if (dashboardState.selectedCategory) {
      filtered = filtered.filter(ticket => ticket.category === dashboardState.selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    return filtered;
  }, [tickets, dashboardState.selectedCategory, searchTerm, statusFilter, priorityFilter]);

  const selectedTicket = dashboardState.selectedTicket 
    ? tickets.find(t => t.id === dashboardState.selectedTicket)
    : null;
    
  const selectedNetworkMember = selectedTicket
    ? networkMembers.find(m => m.id === selectedTicket.networkMemberId)
    : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getDaysOverdue = (ticket: any) => {
    if (ticket.status === "resolved" || ticket.status === "closed") return 0;
    const created = new Date(ticket.createdAt);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysDiff > 3 ? daysDiff - 3 : 0;
  };

  const filteredTickets = getFilteredTickets();

  return (
    <div className="min-h-screen bg-glg-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-glg-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-glg-navy to-glg-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-glg-900">MIRA Dashboard</h1>
              <p className="text-glg-600">Unified Intelligence & Ticket Management Platform</p>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-glg-50 p-4 rounded-lg border-l-4 border-l-glg-navy">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-glg-600">Total Tickets</p>
                  <p className="text-2xl font-bold text-glg-900">{statistics.total}</p>
                </div>
                <Ticket className="h-8 w-8 text-glg-navy" />
              </div>
            </div>
            <div className="bg-glg-50 p-4 rounded-lg border-l-4 border-l-glg-amber">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-glg-600">Overdue</p>
                  <p className="text-2xl font-bold text-glg-900">{statistics.overdueTickets}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-glg-amber" />
              </div>
            </div>
            <div className="bg-glg-50 p-4 rounded-lg border-l-4 border-l-glg-green">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-glg-600">Avg. Resolution</p>
                  <p className="text-2xl font-bold text-glg-900">{statistics.averageResolutionTime}d</p>
                </div>
                <Clock className="h-8 w-8 text-glg-green" />
              </div>
            </div>
            <div className="bg-glg-50 p-4 rounded-lg border-l-4 border-l-glg-blue">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-glg-600">In Progress</p>
                  <p className="text-2xl font-bold text-glg-900">{statistics.byStatus.in_progress}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-glg-blue" />
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Queue Section */}
        <CollapsibleSection
          title="Ticket Queue by Category"
          isExpanded={dashboardState.expandedSections.ticketQueue}
          onToggle={() => toggleSection('ticketQueue')}
          icon={<Package className="h-5 w-5" />}
          badge={Object.values(statistics.byCategory).reduce((sum, count) => sum + count, 0)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const category = key as TicketCategory;
              const count = statistics.byCategory[category];
              const Icon = config.icon;
              const isSelected = dashboardState.selectedCategory === category;

              return (
                <div
                  key={category}
                  className={cn(
                    "group cursor-pointer transition-all duration-200",
                    isSelected && "ring-2 ring-glg-navy"
                  )}
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="p-4 bg-white border border-glg-200 rounded-lg hover:shadow-md hover:border-glg-navy transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.color)}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-glg-900 group-hover:text-glg-navy transition-colors">
                            {config.label}
                          </h3>
                          <p className="text-sm text-glg-600 mt-1">{config.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-glg-100 text-glg-800 hover:bg-glg-100">
                        {count}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Ticket List Section */}
        {dashboardState.selectedCategory && (
          <CollapsibleSection
            title={`${categoryConfig[dashboardState.selectedCategory].label} Tickets`}
            isExpanded={dashboardState.expandedSections.ticketList}
            onToggle={() => toggleSection('ticketList')}
            icon={<FileText className="h-5 w-5" />}
            badge={filteredTickets.length}
          >
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 p-4 bg-glg-50 rounded-lg">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ticket List */}
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredTickets.map((ticket) => {
                    const networkMember = networkMembers.find(m => m.id === ticket.networkMemberId);
                    const daysOverdue = getDaysOverdue(ticket);
                    const isSelected = dashboardState.selectedTicket === ticket.id;

                    return (
                      <div
                        key={ticket.id}
                        className={cn(
                          "p-4 bg-white border border-glg-200 rounded-lg cursor-pointer hover:shadow-md transition-all",
                          isSelected && "ring-2 ring-glg-navy bg-glg-50"
                        )}
                        onClick={() => handleTicketSelect(ticket.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-glg-900 mb-2">{ticket.subject}</h4>
                            <p className="text-sm text-glg-600 mb-3 line-clamp-2">{ticket.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              {networkMember && (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-glg-500" />
                                  <span className="text-glg-700">{networkMember.name}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-glg-500" />
                                <span className="text-glg-700">{formatDate(ticket.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <Badge className={cn("text-xs", priorityColors[ticket.priority])}>
                              {ticket.priority}
                            </Badge>
                            <Badge className={cn("text-xs", statusColors[ticket.status])}>
                              {ticket.status.replace("_", " ")}
                            </Badge>
                            {daysOverdue > 0 && (
                              <Badge className="bg-glg-red text-white text-xs">
                                {daysOverdue}d overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </CollapsibleSection>
        )}

        {/* Ticket Details Section */}
        {selectedTicket && selectedNetworkMember && (
          <CollapsibleSection
            title="Ticket Details"
            isExpanded={dashboardState.expandedSections.ticketDetails}
            onToggle={() => toggleSection('ticketDetails')}
            icon={<FileText className="h-5 w-5" />}
            badge={`ID: ${selectedTicket.id}`}
          >
            <div className="bg-gradient-to-r from-glg-50 to-white p-6 rounded-lg border border-glg-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-glg-900 mb-2">{selectedTicket.subject}</h2>
                  <p className="text-glg-700 mb-4">{selectedTicket.description}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={cn("text-sm", priorityColors[selectedTicket.priority])}>
                      {selectedTicket.priority.toUpperCase()}
                    </Badge>
                    <Badge className={cn("text-sm", statusColors[selectedTicket.status])}>
                      {selectedTicket.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    {getDaysOverdue(selectedTicket) > 0 && (
                      <Badge className="bg-glg-red text-white text-sm">
                        {getDaysOverdue(selectedTicket)} DAYS OVERDUE
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-glg-500" />
                  <div>
                    <p className="text-sm font-medium text-glg-900">Created</p>
                    <p className="text-sm text-glg-600">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-glg-500" />
                  <div>
                    <p className="text-sm font-medium text-glg-900">Last Updated</p>
                    <p className="text-sm text-glg-600">{formatDate(selectedTicket.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-glg-500" />
                  <div>
                    <p className="text-sm font-medium text-glg-900">Assignee</p>
                    <p className="text-sm text-glg-600">{selectedTicket.assigneeId}</p>
                  </div>
                </div>
              </div>

              {selectedTicket.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-glg-900 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Network Member Section */}
        {selectedNetworkMember && (
          <CollapsibleSection
            title="Network Member Profile"
            isExpanded={dashboardState.expandedSections.networkMember}
            onToggle={() => toggleSection('networkMember')}
            icon={<User className="h-5 w-5" />}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-glg-200">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedNetworkMember.avatar} />
                    <AvatarFallback className="bg-glg-navy text-white text-lg">
                      {selectedNetworkMember.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-glg-900 mb-1">
                      {selectedNetworkMember.name}
                    </h3>
                    <p className="text-glg-600 font-medium mb-3">{selectedNetworkMember.role}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-glg-500" />
                        <span className="text-glg-700">{selectedNetworkMember.email}</span>
                      </div>
                      {selectedNetworkMember.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-glg-500" />
                          <span className="text-glg-700">{selectedNetworkMember.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-glg-500" />
                        <span className="text-glg-700">{selectedNetworkMember.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-glg-500" />
                        <span className="text-glg-700">{selectedNetworkMember.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-glg-200">
                <h4 className="font-semibold text-glg-900 mb-4">Professional Intelligence</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-glg-600">Professional Score</span>
                      <span className="text-glg-700">{mockTicketDetailData.revelioData.socialMediaPresence.professionalScore}/100</span>
                    </div>
                    <Progress value={mockTicketDetailData.revelioData.socialMediaPresence.professionalScore} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-glg-600">LinkedIn Connections</span>
                    <span className="text-glg-700">{mockTicketDetailData.revelioData.linkedInProfile.connections.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-glg-600">Public Sentiment</span>
                    <Badge className={cn(
                      "text-xs",
                      mockTicketDetailData.revelioData.publicInformation.sentiment === "positive"
                        ? "bg-glg-green text-white"
                        : "bg-glg-amber text-white"
                    )}>
                      {mockTicketDetailData.revelioData.publicInformation.sentiment}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Data Sources Information */}
        {selectedTicket && (
          <CollapsibleSection
            title="Comprehensive Data Sources"
            isExpanded={dashboardState.expandedSections.dataSourcesInfo}
            onToggle={() => toggleSection('dataSourcesInfo')}
            icon={<Shield className="h-5 w-5" />}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security & Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-glg-green" />
                    Security & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-glg-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-glg-green mx-auto mb-2" />
                      <p className="text-xs font-medium text-glg-600">Background</p>
                      <p className="text-sm font-bold text-glg-900">Clear</p>
                    </div>
                    <div className="text-center p-3 bg-glg-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-glg-green mx-auto mb-2" />
                      <p className="text-xs font-medium text-glg-600">ID Verified</p>
                      <p className="text-sm font-bold text-glg-900">Yes</p>
                    </div>
                    <div className="text-center p-3 bg-glg-50 rounded-lg">
                      <FileText className="h-6 w-6 text-glg-blue mx-auto mb-2" />
                      <p className="text-xs font-medium text-glg-600">Documents</p>
                      <p className="text-sm font-bold text-glg-900">{mockTicketDetailData.knowledgeBaseData.documents.length}</p>
                    </div>
                  </div>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {mockTicketDetailData.salesforceData.complianceHistory.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border border-glg-200 rounded">
                          <span className="text-sm text-glg-700">{item.title}</span>
                          <Badge className="bg-glg-green text-white text-xs">
                            {item.status.replace("_", " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Project Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-glg-blue" />
                    Project Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-glg-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-glg-blue mx-auto mb-2" />
                      <p className="text-lg font-bold text-glg-900">{mockTicketDetailData.streamlinerData.totalProjects}</p>
                      <p className="text-xs text-glg-600">Projects</p>
                    </div>
                    <div className="text-center p-3 bg-glg-50 rounded-lg">
                      <Star className="h-6 w-6 text-glg-amber mx-auto mb-2" />
                      <p className="text-lg font-bold text-glg-900">{mockTicketDetailData.streamlinerData.averageRating}/5</p>
                      <p className="text-xs text-glg-600">Rating</p>
                    </div>
                    <div className="text-center p-3 bg-glg-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-glg-green mx-auto mb-2" />
                      <p className="text-lg font-bold text-glg-900">
                        {formatCurrency(mockTicketDetailData.streamlinerData.totalValue, "USD")}
                      </p>
                      <p className="text-xs text-glg-600">Total Value</p>
                    </div>
                    <div className="text-center p-3 bg-glg-50 rounded-lg">
                      <Award className="h-6 w-6 text-glg-navy mx-auto mb-2" />
                      <p className="text-lg font-bold text-glg-900">{mockTicketDetailData.streamlinerData.completionRate}%</p>
                      <p className="text-xs text-glg-600">Success Rate</p>
                    </div>
                  </div>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {mockTicketDetailData.streamlinerData.projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="p-2 border border-glg-200 rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-glg-900">{project.name}</p>
                              <p className="text-xs text-glg-600">{project.client}</p>
                            </div>
                            <Badge className="bg-glg-green text-white text-xs">
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Financial Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-glg-green" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-glg-green to-glg-teal p-4 rounded-lg text-white mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm opacity-90">Contract Value</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(mockTicketDetailData.salesforceData.contractStatus.value, mockTicketDetailData.salesforceData.contractStatus.currency)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Status</p>
                        <p className="font-semibold capitalize">{mockTicketDetailData.salesforceData.contractStatus.current}</p>
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="h-24">
                    <div className="space-y-2">
                      {mockTicketDetailData.salesforceData.paymentHistory.slice(0, 3).map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-2 border border-glg-200 rounded">
                          <div>
                            <p className="text-sm font-medium text-glg-900">
                              {formatCurrency(payment.amount, payment.currency)}
                            </p>
                            <p className="text-xs text-glg-600">{formatDate(payment.date)}</p>
                          </div>
                          <Badge className="bg-glg-green text-white text-xs">
                            {payment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Knowledge Base */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-glg-navy" />
                    Knowledge Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-glg-600">Documents</span>
                      <span className="text-glg-700">{mockTicketDetailData.knowledgeBaseData.documents.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-glg-600">Interactions</span>
                      <span className="text-glg-700">{mockTicketDetailData.knowledgeBaseData.interactions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-glg-600">Notes</span>
                      <span className="text-glg-700">{mockTicketDetailData.knowledgeBaseData.notes.length}</span>
                    </div>
                  </div>
                  <ScrollArea className="h-24 mt-4">
                    <div className="space-y-2">
                      {mockTicketDetailData.knowledgeBaseData.documents.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="p-2 border border-glg-200 rounded">
                          <p className="text-sm font-medium text-glg-900">{doc.title}</p>
                          <p className="text-xs text-glg-600">{doc.type} • {(doc.size / 1024).toFixed(1)} KB</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}
