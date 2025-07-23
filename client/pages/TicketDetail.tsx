import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  const [activeDataSource, setActiveDataSource] = useState("all");

  // Find the specific ticket based on ticketId
  const ticket = mockTickets.find(t => t.id === ticketId);
  const networkMember = mockNetworkMembers.find(m => m.id === ticket?.networkMemberId);

  if (!ticket || !networkMember) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-mira-900 mb-2">Ticket Not Found</h1>
          <p className="text-mira-600">The requested ticket could not be found.</p>
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-mira-900 mb-2">
                {ticketInfo.subject}
              </h1>
              <div className="flex items-center gap-4">
                <Badge
                  className={cn("text-xs", priorityColors[ticketInfo.priority])}
                >
                  {ticketInfo.priority}
                </Badge>
                <Badge className={cn("text-xs", statusColors[ticketInfo.status])}>
                  {ticketInfo.status.replace("_", " ")}
                </Badge>
                <span className="text-sm text-mira-600">
                  Created {formatDate(ticketInfo.createdAt)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-mira-600">Ticket ID</div>
              <div className="font-mono text-sm bg-mira-100 px-3 py-1 rounded">
                {ticketInfo.id}
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Tabs */}
        <div className="mb-6">
          <Tabs value={activeDataSource} onValueChange={setActiveDataSource}>
            <TabsList className="grid w-full grid-cols-7 bg-white border border-mira-200">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-mira-blue data-[state=active]:text-white"
              >
                All Data
              </TabsTrigger>
              <TabsTrigger
                value="prism"
                className="data-[state=active]:bg-mira-blue data-[state=active]:text-white"
              >
                PRISM
              </TabsTrigger>
              <TabsTrigger
                value="streamliner"
                className="data-[state=active]:bg-mira-blue data-[state=active]:text-white"
              >
                Streamliner
              </TabsTrigger>
              <TabsTrigger
                value="revelio"
                className="data-[state=active]:bg-mira-blue data-[state=active]:text-white"
              >
                Revelio
              </TabsTrigger>
              <TabsTrigger
                value="zendesk"
                className="data-[state=active]:bg-mira-blue data-[state=active]:text-white"
              >
                Zendesk
              </TabsTrigger>
              <TabsTrigger
                value="salesforce"
                className="data-[state=active]:bg-mira-blue data-[state=active]:text-white"
              >
                Salesforce
              </TabsTrigger>
              <TabsTrigger
                value="knowledge"
                className="data-[state=active]:bg-mira-blue data-[state=active]:text-white"
              >
                Knowledge
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Network Member Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-mira-blue" />
                        Network Member Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={memberInfo.avatar} />
                          <AvatarFallback className="bg-mira-blue text-white text-lg">
                            {memberInfo.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-mira-900">
                            {memberInfo.name}
                          </h3>
                          <p className="text-mira-600">{memberInfo.role}</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-mira-500" />
                              <span className="text-mira-700">
                                {memberInfo.email}
                              </span>
                            </div>
                            {memberInfo.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-mira-500" />
                                <span className="text-mira-700">
                                  {memberInfo.phone}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-mira-500" />
                              <span className="text-mira-700">
                                {memberInfo.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="h-4 w-4 text-mira-500" />
                              <span className="text-mira-700">
                                {memberInfo.department}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compliance History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-mira-green" />
                        Compliance History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {salesforceData.complianceHistory.map((item) => (
                            <div
                              key={item.id}
                              className="border border-mira-200 rounded-lg p-3"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-mira-900">
                                    {item.title}
                                  </h4>
                                  <p className="text-sm text-mira-600 capitalize">
                                    {item.type}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {item.status === "compliant" ? (
                                    <CheckCircle className="h-4 w-4 text-mira-green" />
                                  ) : item.status === "non_compliant" ? (
                                    <XCircle className="h-4 w-4 text-mira-red" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-mira-orange" />
                                  )}
                                  <span
                                    className={cn(
                                      "text-sm font-medium",
                                      complianceStatusColors[item.status],
                                    )}
                                  >
                                    {item.status.replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                              {item.completedDate && (
                                <p className="text-xs text-mira-500 mt-2">
                                  Completed: {formatDate(item.completedDate)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Ticket History & Project History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-mira-purple" />
                        Project History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {streamlinerData.projects.map((project) => (
                            <div
                              key={project.id}
                              className="border border-mira-200 rounded-lg p-3"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-mira-900">
                                    {project.name}
                                  </h4>
                                  <p className="text-sm text-mira-600">
                                    {project.client}
                                  </p>
                                  <p className="text-sm text-mira-700 mt-1">
                                    {project.role}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge
                                    className={cn(
                                      "text-xs",
                                      project.status === "active"
                                        ? "bg-mira-green text-white"
                                        : project.status === "completed"
                                          ? "bg-mira-blue text-white"
                                          : "bg-mira-600 text-white",
                                    )}
                                  >
                                    {project.status}
                                  </Badge>
                                  <p className="text-sm font-medium text-mira-900 mt-1">
                                    {formatCurrency(
                                      project.value,
                                      project.currency,
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-xs text-mira-500">
                                <span>
                                  Start:{" "}
                                  {new Date(
                                    project.startDate,
                                  ).toLocaleDateString()}
                                </span>
                                {project.endDate && (
                                  <span>
                                    End:{" "}
                                    {new Date(
                                      project.endDate,
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Ticket Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-mira-blue" />
                        Ticket Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-mira-900 mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-mira-700 leading-relaxed">
                            {ticketInfo.description}
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium text-mira-900 mb-2">
                            Timeline
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-mira-600">Created:</span>
                              <span className="text-mira-700">
                                {formatDate(ticket.createdAt)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-mira-600">
                                Last Updated:
                              </span>
                              <span className="text-mira-700">
                                {formatDate(ticket.updatedAt)}
                              </span>
                            </div>
                            {ticket.resolvedAt && (
                              <div className="flex justify-between">
                                <span className="text-mira-600">Resolved:</span>
                                <span className="text-mira-700">
                                  {formatDate(ticket.resolvedAt)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {ticket.tags.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-medium text-mira-900 mb-2">
                                Tags
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {ticket.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {ticket.comments.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-medium text-mira-900 mb-2">
                                Latest Comments
                              </h4>
                              <div className="space-y-2">
                                {ticket.comments.slice(-2).map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="bg-mira-50 p-3 rounded-lg"
                                  >
                                    <p className="text-sm text-mira-700">
                                      {comment.body}
                                    </p>
                                    <p className="text-xs text-mira-500 mt-1">
                                      {formatDate(comment.createdAt)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Individual data source tabs would show filtered content */}
            <TabsContent value="prism">
              <Card>
                <CardHeader>
                  <CardTitle>PRISM - Background & Verification Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-mira-900 mb-3">
                        Criminal History
                      </h4>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            prismData.criminalHistory.clearanceLevel === "green"
                              ? "bg-mira-green"
                              : prismData.criminalHistory.clearanceLevel ===
                                  "yellow"
                                ? "bg-mira-orange"
                                : "bg-mira-red",
                          )}
                        />
                        <span className="text-sm text-mira-700 capitalize">
                          {prismData.criminalHistory.clearanceLevel} clearance
                        </span>
                      </div>
                      <p className="text-xs text-mira-500 mt-1">
                        Last checked:{" "}
                        {formatDate(prismData.criminalHistory.lastChecked)}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-mira-900 mb-3">
                        Background Check
                      </h4>
                      <div className="flex items-center gap-2">
                        {prismData.backgroundCheck.results === "passed" ? (
                          <CheckCircle className="h-4 w-4 text-mira-green" />
                        ) : (
                          <XCircle className="h-4 w-4 text-mira-red" />
                        )}
                        <span className="text-sm text-mira-700 capitalize">
                          {prismData.backgroundCheck.results}
                        </span>
                      </div>
                      {prismData.backgroundCheck.completedDate && (
                        <p className="text-xs text-mira-500 mt-1">
                          Completed:{" "}
                          {formatDate(prismData.backgroundCheck.completedDate)}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-mira-900 mb-3">
                        Identity Verification
                      </h4>
                      <div className="flex items-center gap-2">
                        {prismData.identification.verified ? (
                          <CheckCircle className="h-4 w-4 text-mira-green" />
                        ) : (
                          <XCircle className="h-4 w-4 text-mira-red" />
                        )}
                        <span className="text-sm text-mira-700">
                          {prismData.identification.verified
                            ? "Verified"
                            : "Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-mira-500 mt-1">
                        Documents:{" "}
                        {prismData.identification.documents.join(", ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

                        <TabsContent value="streamliner">
              <Card>
                <CardHeader>
                  <CardTitle>STREAMLINER - Project History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-mira-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-mira-600">
                          Total Projects
                        </h4>
                        <p className="text-2xl font-bold text-mira-900">
                          {streamlinerData.totalProjects}
                        </p>
                      </div>
                      <div className="bg-mira-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-mira-600">
                          Total Value
                        </h4>
                        <p className="text-2xl font-bold text-mira-900">
                          {formatCurrency(streamlinerData.totalValue, "USD")}
                        </p>
                      </div>
                      <div className="bg-mira-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-mira-600">
                          Avg Rating
                        </h4>
                        <p className="text-2xl font-bold text-mira-900">
                          {streamlinerData.averageRating}/5
                        </p>
                      </div>
                      <div className="bg-mira-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-mira-600">
                          Completion Rate
                        </h4>
                        <p className="text-2xl font-bold text-mira-900">
                          {streamlinerData.completionRate}%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {streamlinerData.projects.map((project) => (
                        <div
                          key={project.id}
                          className="border border-mira-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-mira-900">
                                {project.name}
                              </h4>
                              <p className="text-mira-600 mt-1">
                                {project.client}
                              </p>
                              <p className="text-sm text-mira-700 mt-2">
                                {project.description}
                              </p>
                              <div className="flex items-center gap-4 mt-3">
                                <span className="text-sm text-mira-600">
                                  Role: {project.role}
                                </span>
                                <span className="text-sm text-mira-600">
                                  Duration: {project.startDate}
                                  {project.endDate ? ` - ${project.endDate}` : " - Present"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {project.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <Badge
                                className={cn(
                                  "text-xs mb-2",
                                  project.status === "active"
                                    ? "bg-mira-green text-white"
                                    : project.status === "completed"
                                      ? "bg-mira-blue text-white"
                                      : "bg-mira-600 text-white",
                                )}
                              >
                                {project.status}
                              </Badge>
                              <p className="text-lg font-semibold text-mira-900">
                                {formatCurrency(project.value, project.currency)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revelio">
              <Card>
                <CardHeader>
                  <CardTitle>REVELIO - Social & Professional Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-mira-900 mb-3">
                        LinkedIn Profile
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-mira-600">
                            Headline
                          </label>
                          <p className="text-sm text-mira-700">
                            {revelioData.linkedInProfile.headline}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-mira-600">
                            Connections
                          </label>
                          <p className="text-sm text-mira-700">
                            {revelioData.linkedInProfile.connections.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-mira-600">
                            Profile URL
                          </label>
                          <a
                            href={revelioData.linkedInProfile.profileUrl}
                            className="text-sm text-mira-blue hover:underline flex items-center gap-1"
                          >
                            View Profile <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-mira-600">
                            Skills
                          </label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {revelioData.linkedInProfile.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-mira-900 mb-3">
                        Professional Intelligence
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-mira-50 p-3 rounded-lg">
                          <label className="text-sm font-medium text-mira-600">
                            Professional Score
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-mira-200 rounded-full h-2">
                              <div
                                className="bg-mira-blue h-2 rounded-full"
                                style={{
                                  width: `${revelioData.socialMediaPresence.professionalScore}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-mira-700">
                              {revelioData.socialMediaPresence.professionalScore}/100
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-mira-600">
                            Public Sentiment
                          </label>
                          <Badge
                            className={cn(
                              "text-xs ml-2",
                              revelioData.publicInformation.sentiment === "positive"
                                ? "bg-mira-green text-white"
                                : revelioData.publicInformation.sentiment === "negative"
                                  ? "bg-mira-red text-white"
                                  : "bg-mira-orange text-white",
                            )}
                          >
                            {revelioData.publicInformation.sentiment}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-mira-600">
                            Public Mentions
                          </label>
                          <p className="text-sm text-mira-700">
                            {revelioData.publicInformation.mentions} mentions,{" "}
                            {revelioData.publicInformation.newsArticles} articles
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="zendesk">
              <Card>
                <CardHeader>
                  <CardTitle>ZENDESK - Ticket Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-mira-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-mira-600">
                          Ticket Status
                        </h4>
                        <Badge className={cn("mt-2", statusColors[ticket.status])}>
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="bg-mira-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-mira-600">
                          Priority Level
                        </h4>
                        <Badge className={cn("mt-2", priorityColors[ticket.priority])}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="bg-mira-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-mira-600">
                          Category
                        </h4>
                        <p className="text-sm text-mira-700 mt-2 capitalize">
                          {ticket.category.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-mira-900 mb-3">
                        Ticket Details
                      </h4>
                      <div className="border border-mira-200 rounded-lg p-4">
                        <h5 className="font-medium text-mira-900 mb-2">
                          {ticket.subject}
                        </h5>
                        <p className="text-mira-700 mb-4">{ticket.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-mira-600">Created:</span>
                            <span className="text-mira-700 ml-2">
                              {formatDate(ticket.createdAt)}
                            </span>
                          </div>
                          <div>
                            <span className="text-mira-600">Last Updated:</span>
                            <span className="text-mira-700 ml-2">
                              {formatDate(ticket.updatedAt)}
                            </span>
                          </div>
                          <div>
                            <span className="text-mira-600">Requester:</span>
                            <span className="text-mira-700 ml-2">
                              {networkMember.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-mira-600">Assignee ID:</span>
                            <span className="text-mira-700 ml-2">
                              {ticket.assigneeId}
                            </span>
                          </div>
                        </div>

                        {ticket.attachments.length > 0 && (
                          <div className="mt-4">
                            <h6 className="text-sm font-medium text-mira-600 mb-2">
                              Attachments
                            </h6>
                            <div className="flex flex-wrap gap-2">
                              {ticket.attachments.map((attachment) => (
                                <Badge key={attachment} variant="outline" className="text-xs">
                                  {attachment}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="salesforce">
              <Card>
                <CardHeader>
                  <CardTitle>SALESFORCE - Financial & Contract Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-mira-900 mb-3">
                        Contract Status
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-mira-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-mira-600">
                              Current Status
                            </span>
                            <Badge
                              className={cn(
                                "text-xs",
                                salesforceData.contractStatus.current === "active"
                                  ? "bg-mira-green text-white"
                                  : "bg-mira-orange text-white",
                              )}
                            >
                              {salesforceData.contractStatus.current}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-mira-900">
                            {formatCurrency(
                              salesforceData.contractStatus.value,
                              salesforceData.contractStatus.currency,
                            )}
                          </p>
                          <p className="text-xs text-mira-500">Contract Value</p>
                        </div>
                        <div className="bg-mira-50 p-4 rounded-lg">
                          <span className="text-sm font-medium text-mira-600">
                            Contract Period
                          </span>
                          <p className="text-sm text-mira-700 mt-1">
                            {salesforceData.contractStatus.startDate} -{" "}
                            {salesforceData.contractStatus.endDate}
                          </p>
                          {salesforceData.contractStatus.renewalDate && (
                            <p className="text-xs text-mira-500 mt-1">
                              Renewal: {salesforceData.contractStatus.renewalDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-mira-900 mb-3">
                        Payment History
                      </h4>
                      <div className="space-y-3">
                        {salesforceData.paymentHistory.map((payment) => (
                          <div
                            key={payment.id}
                            className="border border-mira-200 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-mira-900">
                                  {payment.description}
                                </h5>
                                <p className="text-sm text-mira-600">
                                  Invoice: {payment.invoiceNumber}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-mira-900">
                                  {formatCurrency(payment.amount, payment.currency)}
                                </p>
                                <Badge
                                  className={cn(
                                    "text-xs",
                                    payment.status === "paid"
                                      ? "bg-mira-green text-white"
                                      : payment.status === "pending"
                                        ? "bg-mira-orange text-white"
                                        : "bg-mira-red text-white",
                                  )}
                                >
                                  {payment.status}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-mira-500 mt-2">
                              {formatDate(payment.date)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="knowledge">
              <Card>
                <CardHeader>
                  <CardTitle>KNOWLEDGE BASE - Documents & Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-mira-900 mb-3">
                        Documents
                      </h4>
                      <div className="space-y-3">
                        {knowledgeBaseData.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="border border-mira-200 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-mira-900">
                                  {doc.title}
                                </h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {doc.type}
                                  </Badge>
                                  <span className="text-xs text-mira-500">
                                    {(doc.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {doc.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right text-xs text-mira-500 ml-4">
                                <p>Uploaded: {formatDate(doc.uploadDate)}</p>
                                <p>Modified: {formatDate(doc.lastModified)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-mira-900 mb-3">
                        Recent Interactions
                      </h4>
                      <div className="space-y-3">
                        {knowledgeBaseData.interactions.map((interaction) => (
                          <div
                            key={interaction.id}
                            className="border border-mira-200 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-medium text-mira-900">
                                  {interaction.subject}
                                </h5>
                                <p className="text-sm text-mira-600 mt-1">
                                  {interaction.summary}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {interaction.type}
                                  </Badge>
                                  <span className="text-xs text-mira-500">
                                    Participants: {interaction.participants.join(", ")}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right text-xs text-mira-500 ml-4">
                                <p>{formatDate(interaction.date)}</p>
                                {interaction.outcome && (
                                  <p className="text-mira-700 font-medium mt-1">
                                    {interaction.outcome}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-mira-900 mb-3">
                        Internal Notes
                      </h4>
                      <div className="space-y-3">
                        {knowledgeBaseData.notes.map((note) => (
                          <div
                            key={note.id}
                            className="border border-mira-200 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-mira-900">
                                  {note.title}
                                </h5>
                                <p className="text-sm text-mira-700 mt-1">
                                  {note.content}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  {note.isPrivate && (
                                    <Badge className="bg-mira-red text-white text-xs">
                                      Private
                                    </Badge>
                                  )}
                                  {note.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right text-xs text-mira-500 ml-4">
                                <p>Created: {formatDate(note.createdAt)}</p>
                                <p>Updated: {formatDate(note.updatedAt)}</p>
                                <p>Author: {note.authorId}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
