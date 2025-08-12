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
  X,
  Sparkles,
  Send,
  Copy,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Simple type definitions
interface Ticket {
  id: string;
  url: string;
  Subject: string;
  Description: string;
  channel: string;
  from_address: string;
  created_at: string;
  updated_at: string;
  priority: string;
  ticket_language: string;
  medium: string;
  network_member_id: number;
}

interface Catalyst {
  catalyst: string;
  total_tickets: number;
  tickets: Ticket[];
}

interface Category {
  category: string;
  total_catalysts: number;
  catalysts: Catalyst[];
}

interface ClassificationData {
  ticket_categories: Category[];
}

interface TicketDetails {
  id: string;
  linked_network_member_id: number;
  network_member_details: any;
  sections: Array<{
    title: string;
    summary: string;
    details: any;
  }>;
}

type ViewLevel = "categories" | "catalysts" | "tickets" | "details";

interface NavigationState {
  level: ViewLevel;
  selectedCategory?: string;
  selectedCatalyst?: string;
  selectedTicketId?: string;
}

const priorityColors = {
  low: "bg-gray-200 text-gray-800",
  medium: "bg-blue-500 text-white", 
  high: "bg-yellow-500 text-white",
  urgent: "bg-red-500 text-white",
};

const channelIcons = {
  email: Mail,
  phone: Phone,
  portal: User,
  internal: Building,
  chat: FileText,
};

export default function HierarchicalTicketBrowser() {
  const [navigationState, setNavigationState] = useState<NavigationState>({ level: "categories" });
  const [classificationData, setClassificationData] = useState<ClassificationData | null>(null);
  const [ticketDetails, setTicketDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [selectedCatalystForModal, setSelectedCatalystForModal] = useState("");
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<string>("");

  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadClassificationData();
  }, []);

  const loadClassificationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/classify_tickets");
      if (!response.ok) throw new Error("Failed to load data");
      const data = await response.json();
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
    setShowTicketsModal(false);
    try {
      const response = await fetch(`/ticket_details/${ticketId}`);
      if (!response.ok) throw new Error("Failed to load ticket details");
      const data = await response.json();
      setTicketDetails(data.ticket_details);
      setNavigationState(prev => ({
        ...prev,
        level: "details",
        selectedTicketId: ticketId,
      }));
      
      // All sections closed by default
      const allClosed: Record<string, boolean> = {};
      data.ticket_details.sections.forEach((section: any) => {
        allClosed[section.title] = false;
      });
      setExpandedSections(allClosed);
    } catch (err) {
      setError("Failed to load ticket details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateAutoResponse = async () => {
    if (!ticketDetails || !classificationData || !navigationState.selectedTicketId) {
      toast({
        title: "Error",
        description: "Missing ticket details for auto-response generation",
        variant: "destructive",
      });
      return;
    }

    const selectedTicket = getSelectedTicket();
    if (!selectedTicket) {
      toast({
        title: "Error", 
        description: "Could not find ticket information",
        variant: "destructive",
      });
      return;
    }

    // Find category and catalyst for the selected ticket
    let ticketCategory = "";
    let ticketCatalyst = "";
    
    for (const category of classificationData.ticket_categories) {
      for (const catalyst of category.catalysts) {
        if (catalyst.tickets.some(t => t.id === navigationState.selectedTicketId)) {
          ticketCategory = category.category;
          ticketCatalyst = catalyst.catalyst;
          break;
        }
      }
      if (ticketCategory) break;
    }

    const requestPayload = {
      ticket_id: parseInt(navigationState.selectedTicketId),
      ticket_subject: selectedTicket.Subject,
      ticket_description: selectedTicket.Description,
      category: ticketCategory,
      catalyst: ticketCatalyst,
      ticket_details: ticketDetails,
    };

    setGeneratingResponse(true);
    
    try {
      const response = await fetch("/generate_auto_response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      
      if (!response.ok) throw new Error("Failed to generate response");
      
      const data = await response.json();
      setGeneratedResponse(data.generated_auto_response);
      setShowResponseModal(true);
      
      toast({
        title: "Success",
        description: "Auto-response generated successfully!",
      });
    } catch (error) {
      console.error('Error generating auto response:', error);
      toast({
        title: "Error",
        description: "Failed to generate auto-response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingResponse(false);
    }
  };

  const copyResponseToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedResponse);
      toast({
        title: "Copied",
        description: "Response copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const navigateToCategories = () => {
    setNavigationState({ level: "categories" });
    setTicketDetails(null);
    setError(null);
    setShowTicketsModal(false);
  };

  const navigateToCatalysts = (category: string) => {
    setNavigationState({
      level: "catalysts",
      selectedCategory: category,
    });
    setTicketDetails(null);
    setError(null);
    setShowTicketsModal(false);
  };

  const openTicketsModal = (catalyst: string) => {
    setSelectedCatalystForModal(catalyst);
    setShowTicketsModal(true);
  };

  const navigateBack = () => {
    const { level } = navigationState;
    if (level === "details") {
      setNavigationState(prev => ({ ...prev, level: "catalysts" }));
      setTicketDetails(null);
    } else if (level === "catalysts") {
      setNavigationState({ level: "categories" });
    }
    setError(null);
    setShowTicketsModal(false);
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

  const getSelectedCategory = () => {
    if (!classificationData || !navigationState.selectedCategory) return null;
    return classificationData.ticket_categories.find(
      cat => cat.category === navigationState.selectedCategory
    );
  };

  const getCurrentCatalyst = () => {
    const category = getSelectedCategory();
    if (!category || !selectedCatalystForModal) return null;
    return category.catalysts.find(cat => cat.catalyst === selectedCatalystForModal);
  };

  const getSelectedTicket = () => {
    if (!classificationData || !navigationState.selectedTicketId) return null;
    for (const category of classificationData.ticket_categories) {
      for (const catalyst of category.catalysts) {
        const ticket = catalyst.tickets.find(t => t.id === navigationState.selectedTicketId);
        if (ticket) return ticket;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading MIRA data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadClassificationData} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {navigationState.level !== "categories" && (
              <Button variant="ghost" size="sm" onClick={navigateBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MIRA</h1>
              <p className="text-sm text-gray-600">Unified Ticket Management System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Categories View */}
        {navigationState.level === "categories" && classificationData && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ticket Categories</h2>
              <p className="text-gray-600">Browse tickets by category and catalyst</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classificationData.ticket_categories.map((category) => (
                <Card 
                  key={category.category}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
                  onClick={() => navigateToCatalysts(category.category)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{category.category}</h3>
                      <Badge className="bg-blue-100 text-blue-800">{category.total_catalysts} catalysts</Badge>
                    </div>
                    <div className="space-y-2">
                      {category.catalysts.slice(0, 3).map((catalyst) => (
                        <div key={catalyst.catalyst} className="flex justify-between text-sm">
                          <span className="text-gray-600">{catalyst.catalyst}</span>
                          <span className="text-gray-900 font-medium">{catalyst.total_tickets} tickets</span>
                        </div>
                      ))}
                      {category.catalysts.length > 3 && (
                        <p className="text-sm text-gray-500">+{category.catalysts.length - 3} more catalysts</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Catalysts View */}
        {navigationState.level === "catalysts" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{navigationState.selectedCategory} Catalysts</h2>
                <p className="text-gray-600">Select a catalyst to view tickets</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getSelectedCategory()?.catalysts.map((catalyst) => (
                <Card 
                  key={catalyst.catalyst}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openTicketsModal(catalyst.catalyst)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{catalyst.catalyst}</h3>
                      <Badge variant="secondary">{catalyst.total_tickets} tickets</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Ticket Details View */}
        {navigationState.level === "details" && ticketDetails && (
          <div className="space-y-6">
            {/* Ticket Header */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Details</h2>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline" className="text-sm">
                        ID: {ticketDetails.id}
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        Network Member: {ticketDetails.linked_network_member_id}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Network Member Profile */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {ticketDetails.network_member_details.NAME.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {ticketDetails.network_member_details.NAME}
                      </h3>
                      {ticketDetails.network_member_details.LOCALIZED_NAME && (
                        <p className="text-gray-600 mb-2">
                          {ticketDetails.network_member_details.LOCALIZED_NAME}
                        </p>
                      )}
                      <p className="text-blue-600 font-medium mb-2">
                        {ticketDetails.network_member_details.PRACTICE_AREA}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {ticketDetails.network_member_details.EMAIL}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {ticketDetails.network_member_details.PHONE}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {[
                            ticketDetails.network_member_details.CITY,
                            ticketDetails.network_member_details.STATE,
                            ticketDetails.network_member_details.COUNTRY,
                          ].filter(Boolean).join(", ")}
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm">
                        <span className="font-medium text-gray-700">Council: </span>
                        {ticketDetails.network_member_details.COUNCIL_NAME}
                      </div>
                      {ticketDetails.network_member_details.LINKED_IN_PROFILE_URL && (
                        <div className="mt-2">
                          <a
                            href={ticketDetails.network_member_details.LINKED_IN_PROFILE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <ExternalLink className="h-3 w-3" />
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right text-sm space-y-2">
                      <div>
                        <span className="text-gray-600">Consultation Rate:</span>
                        <p className="font-bold text-green-600">
                          ${ticketDetails.network_member_details.CONSULTATION_RATE}/hr
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Language:</span>
                        <p className="font-medium text-gray-900">
                          {ticketDetails.network_member_details.CURRENT_PRIMARY_LANGUAGE}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Member Since:</span>
                        <p className="font-medium text-gray-900">
                          {formatDate(ticketDetails.network_member_details.PROFILE_CREATE_DATE)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {ticketDetails.network_member_details.BIOGRAPHY && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Biography</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {ticketDetails.network_member_details.BIOGRAPHY}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Sections */}
            {ticketDetails.sections.map((section: any) => (
              <Card key={section.title} className="border border-gray-200">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSection(section.title)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      {section.title}
                    </CardTitle>
                    {expandedSections[section.title] ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  {!expandedSections[section.title] && (
                    <p className="text-sm text-gray-600 mt-2">{section.summary}</p>
                  )}
                </CardHeader>
                {expandedSections[section.title] && (
                  <CardContent>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(section.details, null, 2)}
                    </pre>
                  </CardContent>
                )}
              </Card>
            ))}

            {/* Auto Generate Response Button */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">AI Response Generator</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Generate an intelligent, personalized response for this ticket using AI
                  </p>
                  <Button 
                    onClick={generateAutoResponse}
                    disabled={generatingResponse}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    size="lg"
                  >
                    {generatingResponse ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                        Generating Response...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-3" />
                        Auto Generate Response
                      </>
                    )}
                  </Button>
                  {generatingResponse && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-3 text-gray-700">
                        <div className="animate-pulse flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animation-delay-200"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animation-delay-400"></div>
                        </div>
                        <span className="text-sm">AI is analyzing ticket details and generating personalized response...</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tickets Modal */}
        <Dialog open={showTicketsModal} onOpenChange={setShowTicketsModal}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-500" />
                {selectedCatalystForModal} Tickets
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              {getCurrentCatalyst() ? (
                <div className="space-y-4 pr-4">
                  {getCurrentCatalyst()!.tickets.map((ticket) => {
                    const ChannelIcon = channelIcons[ticket.channel as keyof typeof channelIcons] || FileText;
                    
                    return (
                      <div
                        key={ticket.id}
                        className="p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-500 transition-all cursor-pointer"
                        onClick={() => loadTicketDetails(ticket.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {ticket.Subject}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              {ticket.Description}
                            </p>
                          </div>
                          <Badge className={cn("ml-4", priorityColors[ticket.priority as keyof typeof priorityColors])}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ChannelIcon className="h-3 w-3" />
                              {ticket.channel}
                            </div>
                            <span>ID: {ticket.id}</span>
                            <span>{ticket.from_address}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span>Created: {formatDate(ticket.created_at)}</span>
                            <span>Updated: {formatDate(ticket.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tickets found for this catalyst.</p>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Response Modal */}
        <Dialog open={showResponseModal} onOpenChange={setShowResponseModal}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Generated Auto-Response
              </DialogTitle>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={copyResponseToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh] border border-gray-200 rounded-lg">
              <div 
                className="p-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: generatedResponse }}
              />
            </ScrollArea>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowResponseModal(false)}>
                Close
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
