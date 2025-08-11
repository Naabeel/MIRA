import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  Briefcase,
  FileText,
  DollarSign,
  Building,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  mockTickets,
  mockNetworkMembers,
  mockTicketDetailData,
} from "@shared/mock-data";
import { cn } from "@/lib/utils";

const priorityColors = {
  low: "bg-mira-200 text-mira-800",
  medium: "bg-mira-blue text-white",
  high: "bg-mira-orange text-white",
  urgent: "bg-mira-red text-white",
};

const statusColors = {
  open: "bg-mira-blue text-white",
  pending: "bg-mira-orange text-white",
  in_progress: "bg-mira-purple text-white",
  resolved: "bg-mira-green text-white",
  closed: "bg-mira-600 text-white",
};

const complianceStatusColors = {
  compliant: "text-mira-green",
  non_compliant: "text-mira-red",
  pending: "text-mira-orange",
  expired: "text-mira-red",
};

export default function TicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();

  // Find the specific ticket based on ticketId
  const ticket = mockTickets.find((t) => t.id === ticketId);
  const networkMember = mockNetworkMembers.find(
    (m) => m.id === ticket?.networkMemberId,
  );

  if (!ticket || !networkMember) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mira-900 mb-2">
            Ticket Not Found
          </h1>
          <p className="text-mira-600">
            The requested ticket could not be found.
          </p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Use the found ticket data, with mock detail data as fallback
  const ticketData = {
    ticket,
    networkMember,
    prismData: mockTicketDetailData.prismData,
    streamlinerData: mockTicketDetailData.streamlinerData,
    revelioData: mockTicketDetailData.revelioData,
    salesforceData: mockTicketDetailData.salesforceData,
    knowledgeBaseData: mockTicketDetailData.knowledgeBaseData,
  };

  const {
    ticket: ticketInfo,
    networkMember: memberInfo,
    prismData,
    streamlinerData,
    revelioData,
    salesforceData,
    knowledgeBaseData,
  } = ticketData;

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

  const daysOverdue = getDaysOverdue(ticketInfo);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-mira-600 hover:text-mira-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* Main Ticket Details Card - Center of Attention */}
        <Card className="mb-8 border-l-4 border-l-mira-blue shadow-lg">
          <CardHeader className="bg-gradient-to-r from-mira-50 to-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-6 w-6 text-mira-blue" />
                  <span className="text-sm font-medium text-mira-600 bg-mira-100 px-3 py-1 rounded-full">
                    Ticket ID: {ticketInfo.id}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-mira-900 mb-4">
                  {ticketInfo.subject}
                </h1>
                <p className="text-lg text-mira-700 leading-relaxed mb-4">
                  {ticketInfo.description}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge
                    className={cn("text-sm px-3 py-1", priorityColors[ticketInfo.priority])}
                  >
                    {ticketInfo.priority.toUpperCase()} PRIORITY
                  </Badge>
                  <Badge
                    className={cn("text-sm px-3 py-1", statusColors[ticketInfo.status])}
                  >
                    {ticketInfo.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  {daysOverdue > 0 && (
                    <Badge className="bg-mira-red text-white text-sm px-3 py-1">
                      {daysOverdue} DAYS OVERDUE
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-mira-500" />
                <div>
                  <p className="text-sm font-medium text-mira-900">Created</p>
                  <p className="text-sm text-mira-600">{formatDate(ticketInfo.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-mira-500" />
                <div>
                  <p className="text-sm font-medium text-mira-900">Last Updated</p>
                  <p className="text-sm text-mira-600">{formatDate(ticketInfo.updatedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-mira-500" />
                <div>
                  <p className="text-sm font-medium text-mira-900">Assignee</p>
                  <p className="text-sm text-mira-600">{ticketInfo.assigneeId}</p>
                </div>
              </div>
            </div>

            {ticketInfo.tags.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-mira-900 mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {ticketInfo.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {ticketInfo.comments.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-mira-900 mb-3">Latest Comments</p>
                <div className="space-y-3">
                  {ticketInfo.comments.slice(-2).map((comment) => (
                    <div key={comment.id} className="bg-mira-50 p-4 rounded-lg border-l-2 border-l-mira-blue">
                      <p className="text-sm text-mira-700 mb-2">{comment.body}</p>
                      <p className="text-xs text-mira-500">{formatDate(comment.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comprehensive Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Network Member Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-mira-blue" />
                  Network Member Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={memberInfo.avatar} />
                    <AvatarFallback className="bg-mira-blue text-white text-xl">
                      {memberInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-mira-900 mb-1">
                      {memberInfo.name}
                    </h3>
                    <p className="text-mira-600 font-medium mb-3">{memberInfo.role}</p>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-mira-500" />
                        <span className="text-mira-700">{memberInfo.email}</span>
                      </div>
                      {memberInfo.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-mira-500" />
                          <span className="text-mira-700">{memberInfo.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-mira-500" />
                        <span className="text-mira-700">{memberInfo.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-mira-500" />
                        <span className="text-mira-700">{memberInfo.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Score & LinkedIn */}
                <div className="bg-mira-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-mira-900">Professional Intelligence</h4>
                    <a
                      href={revelioData.linkedInProfile.profileUrl}
                      className="text-mira-blue hover:underline flex items-center gap-1 text-sm"
                    >
                      LinkedIn <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-mira-600">Professional Score</span>
                        <span className="text-mira-700">{revelioData.socialMediaPresence.professionalScore}/100</span>
                      </div>
                      <Progress value={revelioData.socialMediaPresence.professionalScore} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-mira-600">Connections</span>
                      <span className="text-mira-700">{revelioData.linkedInProfile.connections.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-mira-green" />
                  Security & Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-mira-50 rounded-lg">
                    <div className={cn(
                      "w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center",
                      prismData.criminalHistory.clearanceLevel === "green" ? "bg-mira-green" : "bg-mira-orange"
                    )}>
                      {prismData.criminalHistory.clearanceLevel === "green" ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-mira-600">Background</p>
                    <p className="text-sm font-bold text-mira-900 capitalize">
                      {prismData.criminalHistory.clearanceLevel}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-mira-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center bg-mira-green">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-mira-600">ID Verified</p>
                    <p className="text-sm font-bold text-mira-900">
                      {prismData.identification.verified ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-mira-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center bg-mira-blue">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-mira-600">Documents</p>
                    <p className="text-sm font-bold text-mira-900">
                      {knowledgeBaseData.documents.length}
                    </p>
                  </div>
                </div>

                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {salesforceData.complianceHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-mira-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            item.status === "compliant" ? "bg-mira-green" : 
                            item.status === "pending" ? "bg-mira-orange" : "bg-mira-red"
                          )} />
                          <div>
                            <p className="text-sm font-medium text-mira-900">{item.title}</p>
                            <p className="text-xs text-mira-600 capitalize">{item.type}</p>
                          </div>
                        </div>
                        <Badge className={cn(
                          "text-xs",
                          item.status === "compliant" ? "bg-mira-green text-white" :
                          item.status === "pending" ? "bg-mira-orange text-white" : "bg-mira-red text-white"
                        )}>
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-mira-purple" />
                  Project Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-mira-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-mira-purple mx-auto mb-2" />
                    <p className="text-2xl font-bold text-mira-900">{streamlinerData.totalProjects}</p>
                    <p className="text-sm text-mira-600">Total Projects</p>
                  </div>
                  <div className="text-center p-4 bg-mira-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-mira-green mx-auto mb-2" />
                    <p className="text-2xl font-bold text-mira-900">
                      {formatCurrency(streamlinerData.totalValue, "USD")}
                    </p>
                    <p className="text-sm text-mira-600">Total Value</p>
                  </div>
                  <div className="text-center p-4 bg-mira-50 rounded-lg">
                    <Star className="h-6 w-6 text-mira-orange mx-auto mb-2" />
                    <p className="text-2xl font-bold text-mira-900">{streamlinerData.averageRating}/5</p>
                    <p className="text-sm text-mira-600">Avg Rating</p>
                  </div>
                  <div className="text-center p-4 bg-mira-50 rounded-lg">
                    <Award className="h-6 w-6 text-mira-blue mx-auto mb-2" />
                    <p className="text-2xl font-bold text-mira-900">{streamlinerData.completionRate}%</p>
                    <p className="text-sm text-mira-600">Success Rate</p>
                  </div>
                </div>

                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {streamlinerData.projects.map((project) => (
                      <div key={project.id} className="border border-mira-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-mira-900">{project.name}</h4>
                            <p className="text-sm text-mira-600">{project.client}</p>
                          </div>
                          <Badge className={cn(
                            "text-xs",
                            project.status === "active" ? "bg-mira-green text-white" :
                            project.status === "completed" ? "bg-mira-blue text-white" : "bg-mira-600 text-white"
                          )}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-mira-900">
                            {formatCurrency(project.value, project.currency)}
                          </span>
                          <span className="text-sm text-mira-600">{project.role}</span>
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
                  <DollarSign className="h-5 w-5 text-mira-green" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-mira-green to-mira-blue p-4 rounded-lg text-white mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Active Contract Value</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(salesforceData.contractStatus.value, salesforceData.contractStatus.currency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">Status</p>
                      <p className="font-semibold capitalize">{salesforceData.contractStatus.current}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-mira-900">Recent Payments</h4>
                  {salesforceData.paymentHistory.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border border-mira-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-mira-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                        <p className="text-xs text-mira-600">{formatDate(payment.date)}</p>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        payment.status === "paid" ? "bg-mira-green text-white" :
                        payment.status === "pending" ? "bg-mira-orange text-white" : "bg-mira-red text-white"
                      )}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
