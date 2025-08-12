// API Service Layer - Ready for backend integration

// API Response Types based on provided JSON structures
export interface TicketClassificationResponse {
  ticket_categories: Array<{
    category: string;
    total_catalysts: number;
    catalysts: Array<{
      catalyst: string;
      total_tickets: number;
      tickets: Array<{
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
      }>;
    }>;
  }>;
}

export interface NetworkMemberDetails {
  NAME: string;
  LOCALIZED_NAME?: string;
  COUNTRY: string;
  ADDRESS?: string;
  CITY?: string;
  STATE?: string;
  ZIP?: string;
  REGION: string;
  PHONE: string;
  EMAIL: string;
  TERMS_CONDITIONS_ACTIVE: string;
  LATEST_TERMS_CONDITIONS_START_DATE: string;
  DAILY_RATE?: string;
  CONSULTATION_RATE: string;
  MIN_PROJECT_AMOUNT: string;
  RECOMMENDED_CONSULTATION_RATE: string;
  BIOGRAPHY: string;
  COUNCIL_NAME: string;
  PRACTICE_AREA: string;
  IS_DNC: string;
  DNC_REASON: string;
  CURRENTLY_RETIRED: string;
  PREFERRED_CULTURE: string;
  CURRENT_PRIMARY_LANGUAGE: string;
  PROFILE_CREATE_DATE: string;
  NPI_NUMBER?: string;
  LINKED_IN_PROFILE_URL?: string;
  PUBLIC_OFFICIAL_IND: string;
  PERSONA_VERIFICATION_DATE?: string;
}

export interface TicketSection {
  title: string;
  summary: string; // New summary field for collapsed view
  details: any; // Flexible structure based on section type
}

export interface TicketDetailsResponse {
  ticket_details: {
    id: string;
    linked_network_member_id: number;
    network_member_details: NetworkMemberDetails;
    sections: TicketSection[];
  };
}

export interface AutoResponseRequest {
  ticket_id: number;
  ticket_subject: string;
  ticket_description: string;
  category: string;
  catalyst: string;
  ticket_details: TicketDetailsResponse['ticket_details'];
}

export interface AutoResponseResponse {
  generated_auto_response: string;
}

// API Service Class
class ApiService {
  private baseUrl: string = '';

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  async classifyTickets(): Promise<TicketClassificationResponse> {
    try {
      const response = await fetch('/classify_tickets');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching ticket classification:", error);
      // Fallback to mock data in case of error
      return this.getMockClassificationData();
    }
  }

  async getTicketDetails(ticketId: string): Promise<TicketDetailsResponse> {
    try {
      const response = await fetch(`/ticket_details/${ticketId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      // Fallback to mock data in case of error
      return this.getMockTicketDetails(ticketId);
    }
  }

  async generateAutoResponse(
    request: AutoResponseRequest,
  ): Promise<AutoResponseResponse> {
    try {
      const response = await fetch('/generate_auto_response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error generating auto response:", error);
      // Fallback to mock data in case of error
      return this.getMockAutoResponse(request);
    }
  }

  private getMockClassificationData(): TicketClassificationResponse {
    return {
      ticket_categories: [
        {
          category: "Rate",
          total_catalysts: 2,
          catalysts: [
            {
              catalyst: "Negotiation",
              total_tickets: 4,
              tickets: [
                {
                  id: "1234567890",
                  url: "https://example.com/ticket/1234567890.json",
                  Subject: "Rate increase negotiation for Q2 projects",
                  Description: "Requesting rate adjustment based on experience and market conditions",
                  channel: "email",
                  from_address: "michael.rodriguez@glg.com",
                  created_at: "2024-01-14T11:15:00Z",
                  updated_at: "2024-01-16T10:45:00Z",
                  priority: "high",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456789
                }
              ]
            }
          ]
        }
      ]
    };
  }

  private getMockTicketDetails(ticketId: string): TicketDetailsResponse {
    return {
      ticket_details: {
        id: ticketId,
        linked_network_member_id: 123456789,
        network_member_details: {
          NAME: "Sarah Chen",
          COUNTRY: "United States",
          REGION: "North America",
          PHONE: "+1-555-0123",
          EMAIL: "sarah.chen@glg.com",
          TERMS_CONDITIONS_ACTIVE: "true",
          LATEST_TERMS_CONDITIONS_START_DATE: "2024-01-01",
          CONSULTATION_RATE: "350.0000",
          MIN_PROJECT_AMOUNT: "5000",
          RECOMMENDED_CONSULTATION_RATE: "300.0000",
          BIOGRAPHY: "Sarah Chen is a seasoned healthcare consultant.",
          COUNCIL_NAME: "Healthcare & Life Sciences",
          PRACTICE_AREA: "Healthcare Analytics",
          IS_DNC: "false",
          DNC_REASON: "UNKNOWN",
          CURRENTLY_RETIRED: "false",
          PREFERRED_CULTURE: "en",
          CURRENT_PRIMARY_LANGUAGE: "English",
          PROFILE_CREATE_DATE: "2022-03-15",
          PUBLIC_OFFICIAL_IND: "false"
        },
        sections: [
          {
            title: "Work History",
            summary: "Current Senior Healthcare Consultant at GLG with 8+ years experience.",
            details: {
              network_member_id: 123456789,
              history: []
            }
          }
        ]
      }
    };
  }

  private getMockAutoResponse(request: AutoResponseRequest): AutoResponseResponse {
    const { ticket_id, ticket_subject, ticket_description, category, catalyst, ticket_details } = request;
    const member = ticket_details.network_member_details;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="border-bottom: 3px solid #1E3A8A; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #1E3A8A; margin: 0; font-size: 24px;">GLG Response - ${category} ${catalyst}</h1>
          <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">Ticket #${ticket_id} - ${ticket_subject}</p>
          <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 12px;">Automated response generated by MIRA</p>
        </div>
        <div style="margin-bottom: 25px;">
          <p style="color: #374151; line-height: 1.6; margin: 0 0 15px 0;">Dear ${member.NAME},</p>
          <p style="color: #374151; line-height: 1.6; margin: 0 0 15px 0;">
            Thank you for your ${category.toLowerCase()} ${catalyst.toLowerCase()} request: "${ticket_subject}".
          </p>
        </div>
      </div>
    `;

    return {
      generated_auto_response: htmlContent.trim()
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default ApiService;
