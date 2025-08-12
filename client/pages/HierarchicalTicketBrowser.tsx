import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Building,
  MapPin,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileText,
  Briefcase,
  DollarSign,
  Shield,
  Users,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { apiService, type TicketClassificationResponse, type TicketDetailsResponse } from "@shared/api-service";
import { cn } from "@/lib/utils";

type ViewLevel = "categories" | "catalysts" | "tickets" | "details";

interface NavigationState {
  level: ViewLevel;
  selectedCategory?: string;
  selectedCatalyst?: string;
  selectedTicketId?: string;
}

const priorityColors = {
  low: "bg-glg-200 text-glg-800",
  medium: "bg-glg-blue text-white",
  high: "bg-glg-amber text-white",
  urgent: "bg-glg-red text-white",
};

const channelIcons = {
  email: Mail,
  portal: User,
  phone: Phone,
  internal: Building,
};

export default function HierarchicalTicketBrowser() {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    level: "categories",
  });
  
  const [classificationData, setClassificationData] = useState<TicketClassificationResponse | null>(null);
  const [ticketDetails, setTicketDetails] = useState<TicketDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Load initial classification data
  useEffect(() => {
    loadClassificationData();
  }, []);

  const loadClassificationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.classifyTickets();
      setClassificationData(data);
    } catch (err) {
      setError("Failed to load ticket categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetails = async (ticketId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getTicketDetails(ticketId);
      setTicketDetails(data);
      setNavigationState(prev => ({
        ...prev,
        level: "details",
        selectedTicketId: ticketId,
      }));
      // Auto-expand all sections on details view
      const autoExpanded: Record<string, boolean> = {};
      data.ticket_details.sections.forEach(section => {
        autoExpanded[section.title] = true;
      });
      setExpandedSections(autoExpanded);
    } catch (err) {
      setError("Failed to load ticket details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToCategories = () => {
    setNavigationState({ level: "categories" });
    setTicketDetails(null);
    setError(null);
  };

  const navigateToCatalysts = (category: string) => {
    setNavigationState({
      level: "catalysts",
      selectedCategory: category,
    });
    setTicketDetails(null);
    setError(null);
  };

  const navigateToTickets = (catalyst: string) => {
    setNavigationState(prev => ({
      ...prev,
      level: "tickets",
      selectedCatalyst: catalyst,
    }));
    setTicketDetails(null);
    setError(null);
  };

  const navigateBack = () => {
    const { level } = navigationState;
    if (level === "details") {
      setNavigationState(prev => ({ ...prev, level: "tickets" }));
      setTicketDetails(null);
    } else if (level === "tickets") {
      setNavigationState(prev => ({ ...prev, level: "catalysts" }));
    } else if (level === "catalysts") {
      setNavigationState({ level: "categories" });
    }
    setError(null);
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentCategory = () => {
    if (!classificationData || !navigationState.selectedCategory) return null;
    return classificationData.ticket_categories.find(cat => cat.category === navigationState.selectedCategory);
  };

  const getCurrentCatalyst = () => {
    const category = getCurrentCategory();
    if (!category || !navigationState.selectedCatalyst) return null;
    return category.catalysts.find(cat => cat.catalyst === navigationState.selectedCatalyst);
  };

  const getBreadcrumb = () => {
    const crumbs = ["Categories"];
    if (navigationState.selectedCategory) {
      crumbs.push(navigationState.selectedCategory);
    }
    if (navigationState.selectedCatalyst) {
      crumbs.push(navigationState.selectedCatalyst);
    }
    if (navigationState.level === "details") {
      crumbs.push("Details");
    }
    return crumbs.join(" → ");
  };

  if (loading && !classificationData) {
    return (
      <div className="min-h-screen bg-glg-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-glg-navy" />
          <span className="text-glg-700">Loading ticket data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-glg-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-glg-red mb-4">
              <AlertCircle className="h-6 w-6" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-glg-700 mb-4">{error}</p>
            <Button onClick={loadClassificationData} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-glg-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-glg-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-glg-navy to-glg-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-glg-900">MIRA Ticket Browser</h1>
                <p className="text-glg-600">Navigate: {getBreadcrumb()}</p>
              </div>
            </div>
            {navigationState.level !== "categories" && (
              <Button 
                variant="outline" 
                onClick={navigateBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          {loading && (
            <div className="mt-4 flex items-center gap-2 text-glg-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>

        {/* Categories View */}
        {navigationState.level === "categories" && classificationData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-glg-navy" />
                Ticket Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classificationData.ticket_categories.map((category) => (
                  <div
                    key={category.category}
                    className="p-6 bg-white border border-glg-200 rounded-lg hover:shadow-md hover:border-glg-navy transition-all cursor-pointer group"
                    onClick={() => navigateToCatalysts(category.category)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-glg-900 group-hover:text-glg-navy transition-colors">
                        {category.category}
                      </h3>
                      <Badge className="bg-glg-100 text-glg-800">
                        {category.total_catalysts} catalysts
                      </Badge>
                    </div>
                    <p className="text-glg-600 text-sm">
                      Click to view {category.total_catalysts} catalyst{category.total_catalysts !== 1 ? 's' : ''} 
                      in this category
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Catalysts View */}
        {navigationState.level === "catalysts" && classificationData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-glg-blue" />
                {navigationState.selectedCategory} Catalysts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getCurrentCategory() ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCurrentCategory()!.catalysts.map((catalyst) => (
                    <div
                      key={catalyst.catalyst}
                      className="p-5 bg-white border border-glg-200 rounded-lg hover:shadow-md hover:border-glg-navy transition-all cursor-pointer group"
                      onClick={() => navigateToTickets(catalyst.catalyst)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-glg-900 group-hover:text-glg-navy transition-colors">
                          {catalyst.catalyst}
                        </h3>
                        <Badge className="bg-glg-100 text-glg-800">
                          {catalyst.total_tickets} tickets
                        </Badge>
                      </div>
                      <p className="text-glg-600 text-sm">
                        View {catalyst.total_tickets} ticket{catalyst.total_tickets !== 1 ? 's' : ''} 
                        in this catalyst
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-glg-400 mx-auto mb-4" />
                  <p className="text-glg-600">No catalysts found</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tickets List View */}
        {navigationState.level === "tickets" && classificationData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-glg-green" />
                {navigationState.selectedCatalyst} Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getCurrentCatalyst() ? (
                <div className="space-y-4">
                  {getCurrentCatalyst()!.tickets.map((ticket) => {
                    const ChannelIcon = channelIcons[ticket.channel as keyof typeof channelIcons] || FileText;
                    
                    return (
                      <div
                        key={ticket.id}
                        className="p-5 bg-white border border-glg-200 rounded-lg hover:shadow-md hover:border-glg-navy transition-all cursor-pointer"
                        onClick={() => loadTicketDetails(ticket.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-glg-900 mb-2">
                              {ticket.Subject}
                            </h3>
                            <p className="text-glg-600 text-sm mb-3 line-clamp-2">
                              {ticket.Description}
                            </p>
                          </div>
                          <Badge className={cn("ml-4", priorityColors[ticket.priority as keyof typeof priorityColors])}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-glg-600">
                          <div className="flex items-center gap-1">
                            <ChannelIcon className="h-4 w-4" />
                            <span className="capitalize">{ticket.channel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{ticket.from_address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {formatDate(ticket.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Updated: {formatDate(ticket.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-glg-400 mx-auto mb-4" />
                  <p className="text-glg-600">No tickets found</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Ticket Details View */}
        {navigationState.level === "details" && ticketDetails && (
          <div className="space-y-6">
            {/* Ticket Information */}
            <Card className="border-l-4 border-l-glg-navy">
              <CardHeader className="bg-gradient-to-r from-glg-50 to-white">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-glg-900 mb-2">
                      Ticket Details
                    </CardTitle>
                    <Badge variant="outline" className="text-sm">
                      ID: {ticketDetails.ticket_details.id}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Network Member Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-glg-blue" />
                  Network Member Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-glg-navy text-white text-lg">
                          {ticketDetails.ticket_details.network_member_details.NAME
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-glg-900">
                          {ticketDetails.ticket_details.network_member_details.NAME}
                        </h3>
                        {ticketDetails.ticket_details.network_member_details.LOCALIZED_NAME && (
                          <p className="text-glg-600">
                            {ticketDetails.ticket_details.network_member_details.LOCALIZED_NAME}
                          </p>
                        )}
                        <p className="text-glg-700 font-medium mt-1">
                          {ticketDetails.ticket_details.network_member_details.PRACTICE_AREA}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-glg-500" />
                        <span className="text-glg-700">
                          {ticketDetails.ticket_details.network_member_details.EMAIL}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-glg-500" />
                        <span className="text-glg-700">
                          {ticketDetails.ticket_details.network_member_details.PHONE}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-glg-500" />
                        <span className="text-glg-700">
                          {[
                            ticketDetails.ticket_details.network_member_details.CITY,
                            ticketDetails.ticket_details.network_member_details.STATE,
                            ticketDetails.ticket_details.network_member_details.COUNTRY
                          ].filter(Boolean).join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-glg-500" />
                        <span className="text-glg-700">
                          {ticketDetails.ticket_details.network_member_details.COUNCIL_NAME}
                        </span>
                      </div>
                      {ticketDetails.ticket_details.network_member_details.LINKED_IN_PROFILE_URL && (
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-glg-500" />
                          <a 
                            href={ticketDetails.ticket_details.network_member_details.LINKED_IN_PROFILE_URL}
                            className="text-glg-blue hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-glg-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-glg-900 mb-3">Professional Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-glg-600">Consultation Rate:</span>
                          <span className="text-glg-900 font-medium">
                            ${ticketDetails.ticket_details.network_member_details.CONSULTATION_RATE}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-glg-600">Recommended Rate:</span>
                          <span className="text-glg-900 font-medium">
                            ${ticketDetails.ticket_details.network_member_details.RECOMMENDED_CONSULTATION_RATE}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-glg-600">Language:</span>
                          <span className="text-glg-900">
                            {ticketDetails.ticket_details.network_member_details.CURRENT_PRIMARY_LANGUAGE}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-glg-600">Member Since:</span>
                          <span className="text-glg-900">
                            {formatDate(ticketDetails.ticket_details.network_member_details.PROFILE_CREATE_DATE)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {ticketDetails.ticket_details.network_member_details.BIOGRAPHY && (
                      <div>
                        <h4 className="font-semibold text-glg-900 mb-2">Biography</h4>
                        <ScrollArea className="h-32">
                          <p className="text-glg-700 text-sm leading-relaxed">
                            {ticketDetails.ticket_details.network_member_details.BIOGRAPHY}
                          </p>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Sections */}
            {ticketDetails.ticket_details.sections.map((section) => (
              <CollapsibleSection
                key={section.title}
                title={section.title}
                isExpanded={expandedSections[section.title] || false}
                onToggle={() => toggleSection(section.title)}
                icon={
                  section.title === "Work History" ? <Briefcase className="h-5 w-5" /> :
                  section.title === "Fee History" ? <DollarSign className="h-5 w-5" /> :
                  section.title === "Project History" ? <FileText className="h-5 w-5" /> :
                  section.title === "TC History" ? <Shield className="h-5 w-5" /> :
                  <FileText className="h-5 w-5" />
                }
              >
                <div className="space-y-4">
                  {section.title === "Work History" && section.details.history && (
                    <div className="space-y-3">
                      {section.details.history.map((job: any, index: number) => (
                        <div key={index} className="p-4 border border-glg-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-glg-900">{job.job_title}</h4>
                              <p className="text-glg-700">{job.company_name}</p>
                            </div>
                            {job.current_ind && (
                              <Badge className="bg-glg-green text-white">Current</Badge>
                            )}
                          </div>
                          <p className="text-glg-600 text-sm mb-2">{job.description}</p>
                          <div className="text-xs text-glg-500">
                            {job.start_month}/{job.start_year} - {job.current_ind ? "Present" : `${job.end_month}/${job.end_year}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.title === "Fee History" && section.details.history && (
                    <div className="space-y-3">
                      {section.details.history.map((fee: any, index: number) => (
                        <div key={index} className="p-4 border border-glg-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-glg-900">Rate Change</h4>
                              <p className="text-glg-600 text-sm">{fee.reason}</p>
                            </div>
                            <Badge className={cn(
                              fee.status === "approved" ? "bg-glg-green text-white" : "bg-glg-amber text-white"
                            )}>
                              {fee.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-glg-600">Requested:</span>
                              <p className="font-medium text-glg-900">${fee.requested_rate}</p>
                            </div>
                            <div>
                              <span className="text-glg-600">Recommended:</span>
                              <p className="font-medium text-glg-900">${fee.recommended_rate}</p>
                            </div>
                            <div>
                              <span className="text-glg-600">Final:</span>
                              <p className="font-medium text-glg-900">${fee.renegotiate_rate}</p>
                            </div>
                          </div>
                          <p className="text-xs text-glg-500 mt-2">
                            Updated: {formatDate(fee.last_update_date)} by {fee.last_update_by}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.title === "Project History" && section.details.history && (
                    <div className="space-y-3">
                      {section.details.history.map((project: any, index: number) => (
                        <div key={index} className="p-4 border border-glg-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-glg-900">{project.title}</h4>
                              <p className="text-glg-600 text-sm">{project.description}</p>
                              <p className="text-glg-700 text-sm mt-1">{project.council_name}</p>
                            </div>
                            <Badge className="bg-glg-blue text-white">
                              ${project.cm_rate_for_project}/hr
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                            <div>
                              <span className="text-glg-600">Duration:</span>
                              <p className="font-medium text-glg-900">{project.client_duration}min</p>
                            </div>
                            <div>
                              <span className="text-glg-600">Product:</span>
                              <p className="font-medium text-glg-900">{project.product_name}</p>
                            </div>
                            <div>
                              <span className="text-glg-600">RM:</span>
                              <p className="font-medium text-glg-900">{project.primary_rm}</p>
                            </div>
                            <div>
                              <span className="text-glg-600">Call Date:</span>
                              <p className="font-medium text-glg-900">
                                {project.first_call_occurred_date ? formatDate(project.first_call_occurred_date) : "Not scheduled"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.title === "TC History" && section.details.history && (
                    <div className="space-y-3">
                      {section.details.history.map((tc: any, index: number) => (
                        <div key={index} className="p-4 border border-glg-200 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-glg-600">Period Start:</span>
                              <p className="font-medium text-glg-900">{formatDate(tc.tc_start_date)}</p>
                            </div>
                            <div>
                              <span className="text-glg-600">Period End:</span>
                              <p className="font-medium text-glg-900">{formatDate(tc.tc_end_date)}</p>
                            </div>
                            <div>
                              <span className="text-glg-600">Next Period:</span>
                              <p className="font-medium text-glg-900">{formatDate(tc.next_tc_start_date)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
