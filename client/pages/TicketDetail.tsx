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

  // In a real app, this would fetch data based on ticketId
  const ticketData = mockTicketDetailData;
  const {
    ticket,
    networkMember,
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
    <div className="min-h-screen bg-mira-50 p-6">
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
                {ticket.subject}
              </h1>
              <div className="flex items-center gap-4">
                <Badge
                  className={cn("text-xs", priorityColors[ticket.priority])}
                >
                  {ticket.priority}
                </Badge>
                <Badge className={cn("text-xs", statusColors[ticket.status])}>
                  {ticket.status.replace("_", " ")}
                </Badge>
                <span className="text-sm text-mira-600">
                  Created {formatDate(ticket.createdAt)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-mira-600">Ticket ID</div>
              <div className="font-mono text-sm bg-mira-100 px-3 py-1 rounded">
                {ticket.id}
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
                          <AvatarImage src={networkMember.avatar} />
                          <AvatarFallback className="bg-mira-blue text-white text-lg">
                            {networkMember.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-mira-900">
                            {networkMember.name}
                          </h3>
                          <p className="text-mira-600">{networkMember.role}</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-mira-500" />
                              <span className="text-mira-700">
                                {networkMember.email}
                              </span>
                            </div>
                            {networkMember.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-mira-500" />
                                <span className="text-mira-700">
                                  {networkMember.phone}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-mira-500" />
                              <span className="text-mira-700">
                                {networkMember.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="h-4 w-4 text-mira-500" />
                              <span className="text-mira-700">
                                {networkMember.department}
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
                            {ticket.description}
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

            {/* Additional tabs would be implemented similarly */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
