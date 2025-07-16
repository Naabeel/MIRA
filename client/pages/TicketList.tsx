import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDashboardData } from "@shared/mock-data";
import { TicketCategory } from "@shared/mira-types";
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

const categoryLabels = {
  profile: "Profile",
  rate_negotiation: "Rate Negotiation",
  project: "Project",
  payments: "Payments",
  idnc: "ID & Compliance",
  others: "Others",
};

export default function TicketList() {
  const { category } = useParams<{ category: TicketCategory }>();
  const navigate = useNavigate();
  const { tickets, networkMembers } = mockDashboardData;

  const filteredTickets = tickets.filter(
    (ticket) => ticket.category === category,
  );

  const getNetworkMember = (memberId: string) => {
    return networkMembers.find((member) => member.id === memberId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysOverdue = (ticket: any) => {
    if (ticket.status === "resolved" || ticket.status === "closed") return 0;
    const created = new Date(ticket.createdAt);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysDiff > 3 ? daysDiff - 3 : 0; // Assuming 3 days is normal resolution time
  };

  return (
    <div className="min-h-screen bg-mira-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-mira-600 hover:text-mira-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-mira-blue to-mira-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-3xl font-bold text-mira-900">
              {category ? categoryLabels[category] : "Tickets"} Tickets
            </h1>
            <Badge className="bg-mira-100 text-mira-800">
              {filteredTickets.length} tickets
            </Badge>
          </div>
          <p className="text-mira-600">
            Manage and track{" "}
            {category ? categoryLabels[category].toLowerCase() : ""} related
            tickets
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-mira-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-mira-600" />
                </div>
                <h3 className="text-lg font-semibold text-mira-900 mb-2">
                  No tickets found
                </h3>
                <p className="text-mira-600 text-center">
                  There are currently no tickets in the{" "}
                  {category
                    ? categoryLabels[category].toLowerCase()
                    : "selected"}{" "}
                  category.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTickets.map((ticket) => {
              const networkMember = getNetworkMember(ticket.networkMemberId);
              const daysOverdue = getDaysOverdue(ticket);

              return (
                <Card
                  key={ticket.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-mira-blue hover:border-l-mira-blue-dark"
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-mira-900 group-hover:text-mira-blue transition-colors mb-2">
                              {ticket.subject}
                            </h3>
                            <p className="text-mira-600 text-sm leading-relaxed">
                              {ticket.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <Badge
                              className={cn(
                                "text-xs",
                                priorityColors[ticket.priority],
                              )}
                            >
                              {ticket.priority}
                            </Badge>
                            <Badge
                              className={cn(
                                "text-xs",
                                statusColors[ticket.status],
                              )}
                            >
                              {ticket.status.replace("_", " ")}
                            </Badge>
                            {daysOverdue > 0 && (
                              <Badge className="bg-mira-red text-white text-xs">
                                {daysOverdue}d overdue
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between pt-4 border-t border-mira-100">
                          <div className="flex items-center gap-6">
                            {networkMember && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-mira-500" />
                                <span className="text-sm text-mira-700">
                                  {networkMember.name}
                                </span>
                                <span className="text-xs text-mira-500">
                                  ({networkMember.department})
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-mira-500" />
                              <span className="text-sm text-mira-700">
                                {formatDate(ticket.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-mira-500">
                              Ticket ID:
                            </span>
                            <span className="text-xs font-mono text-mira-700 bg-mira-100 px-2 py-1 rounded">
                              {ticket.id}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        {ticket.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {ticket.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-mira-100 text-mira-700 hover:bg-mira-100"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
