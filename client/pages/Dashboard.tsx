import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Ticket,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  Settings,
  Package,
} from "lucide-react";
import { mockDashboardData } from "@shared/mock-data";
import { TicketCategory } from "@shared/mira-types";
import { cn } from "@/lib/utils";

const categoryConfig = {
  profile: {
    label: "Profile",
    icon: Users,
    color: "bg-mira-blue",
    description: "Profile updates and information changes",
  },
  rate_negotiation: {
    label: "Rate Negotiation",
    icon: DollarSign,
    color: "bg-mira-green",
    description: "Rate adjustments and negotiations",
  },
  project: {
    label: "Project",
    icon: Package,
    color: "bg-mira-purple",
    description: "Project assignments and management",
  },
  payments: {
    label: "Payments",
    icon: DollarSign,
    color: "bg-mira-orange",
    description: "Payment issues and invoice queries",
  },
  idnc: {
    label: "ID & Compliance",
    icon: Settings,
    color: "bg-mira-red",
    description: "Identity verification and compliance",
  },
  others: {
    label: "Others",
    icon: FileText,
    color: "bg-mira-600",
    description: "Miscellaneous requests and inquiries",
  },
};

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] =
    useState<TicketCategory | null>(null);
  const { statistics, tickets } = mockDashboardData;

  const handleCategoryClick = (category: TicketCategory) => {
    navigate(`/tickets/${category}`);
  };

  const getRecentActivity = () => {
    return tickets
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-mira-blue to-mira-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-3xl font-bold text-mira-900">MIRA Dashboard</h1>
          </div>
          <p className="text-mira-600">
            Agentic AI for GLG - Unified ticket management and network member
            intelligence
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-mira-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-mira-700">
                Total Tickets
              </CardTitle>
              <Ticket className="h-4 w-4 text-mira-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mira-900">
                {statistics.total}
              </div>
              <p className="text-xs text-mira-600">
                +{statistics.recentActivity} new this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-mira-orange">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-mira-700">
                Overdue
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-mira-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mira-900">
                {statistics.overdueTickets}
              </div>
              <p className="text-xs text-mira-600">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-mira-green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-mira-700">
                Avg. Resolution
              </CardTitle>
              <Clock className="h-4 w-4 text-mira-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mira-900">
                {statistics.averageResolutionTime}d
              </div>
              <p className="text-xs text-mira-600">Average resolution time</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-mira-purple">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-mira-700">
                In Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-mira-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-mira-900">
                {statistics.byStatus.in_progress}
              </div>
              <p className="text-xs text-mira-600">Currently being handled</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Categories */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-mira-900">
                  Ticket Categories
                </CardTitle>
                <p className="text-sm text-mira-600">
                  Click on a category to view detailed tickets
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const category = key as TicketCategory;
                    const count = statistics.byCategory[category];
                    const Icon = config.icon;

                    return (
                      <div
                        key={category}
                        className="group cursor-pointer"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className="relative p-6 bg-white border border-mira-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-mira-blue">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-12 h-12 rounded-lg flex items-center justify-center",
                                  config.color,
                                )}
                              >
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-mira-900 group-hover:text-mira-blue transition-colors">
                                  {config.label}
                                </h3>
                                <p className="text-sm text-mira-600 mt-1">
                                  {config.description}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-mira-100 text-mira-800 hover:bg-mira-100">
                              {count}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-mira-900">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getRecentActivity().map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start gap-3 p-3 bg-mira-50 rounded-lg cursor-pointer hover:bg-mira-100 transition-colors"
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                  >
                    <div className="w-2 h-2 bg-mira-blue rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-mira-900 truncate">
                        {ticket.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={cn(
                            "text-xs",
                            priorityColors[ticket.priority],
                          )}
                        >
                          {ticket.priority}
                        </Badge>
                        <Badge
                          className={cn("text-xs", statusColors[ticket.status])}
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-mira-600 mt-1">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-mira-900">
                  Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(statistics.byStatus).map(
                    ([status, count]) => (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              statusColors[
                                status as keyof typeof statusColors
                              ].split(" ")[0],
                            )}
                          />
                          <span className="text-sm text-mira-700 capitalize">
                            {status.replace("_", " ")}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-mira-900">
                          {count}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
