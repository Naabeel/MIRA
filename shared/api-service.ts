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
      // This will be replaced with actual API call when backend is ready
      // const response = await fetch('/classify_tickets');
      // return await response.json();

      // Mock data for now - structured exactly like the API response
      return this.getMockClassificationData();
    } catch (error) {
      console.error('Error fetching ticket classification:', error);
      throw error;
    }
  }

  async getTicketDetails(ticketId: string): Promise<TicketDetailsResponse> {
    try {
      // This will be replaced with actual API call when backend is ready
      // const response = await fetch(`${this.baseUrl}/ticket_details/${ticketId}`);
      // return await response.json();

      // Mock data for now - structured exactly like the API response
      return this.getMockTicketDetails(ticketId);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      throw error;
    }
  }

  async generateAutoResponse(request: AutoResponseRequest): Promise<AutoResponseResponse> {
    try {
      // This will be replaced with actual API call when backend is ready
      // const response = await fetch('/generate_auto_response', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request)
      // });
      // return await response.json();

      // Mock data for now - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
      return this.getMockAutoResponse(request);
    } catch (error) {
      console.error('Error generating auto response:', error);
      throw error;
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
                },
                {
                  id: "1234567891",
                  url: "https://example.com/ticket/1234567891.json",
                  Subject: "Annual rate review discussion",
                  Description: "Annual rate review based on performance metrics",
                  channel: "portal",
                  from_address: "sarah.chen@glg.com",
                  created_at: "2024-01-13T14:00:00Z",
                  updated_at: "2024-01-15T16:00:00Z",
                  priority: "medium",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456790
                },
                {
                  id: "1234567892",
                  url: "https://example.com/ticket/1234567892.json",
                  Subject: "Specialist rate premium request",
                  Description: "Request for specialist premium rate for niche expertise",
                  channel: "email",
                  from_address: "emily.johnson@glg.com",
                  created_at: "2024-01-12T10:00:00Z",
                  updated_at: "2024-01-14T14:00:00Z",
                  priority: "medium",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456791
                },
                {
                  id: "1234567893",
                  url: "https://example.com/ticket/1234567893.json",
                  Subject: "Consulting rate adjustment",
                  Description: "Requesting adjustment to consulting hourly rate",
                  channel: "phone",
                  from_address: "david.kim@glg.com",
                  created_at: "2024-01-11T09:30:00Z",
                  updated_at: "2024-01-13T11:20:00Z",
                  priority: "low",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456792
                }
              ]
            },
            {
              catalyst: "Reduction",
              total_tickets: 1,
              tickets: [
                {
                  id: "1234567894",
                  url: "https://example.com/ticket/1234567894.json",
                  Subject: "Rate reduction compliance issue",
                  Description: "Compliance team requested rate reduction due to policy changes",
                  channel: "internal",
                  from_address: "compliance@glg.com",
                  created_at: "2024-01-10T15:00:00Z",
                  updated_at: "2024-01-12T09:00:00Z",
                  priority: "urgent",
                  ticket_language: "en",
                  medium: "internal",
                  network_member_id: 123456793
                }
              ]
            }
          ]
        },
        {
          category: "Profile",
          total_catalysts: 2,
          catalysts: [
            {
              catalyst: "Information Update",
              total_tickets: 6,
              tickets: [
                {
                  id: "2234567890",
                  url: "https://example.com/ticket/2234567890.json",
                  Subject: "Update professional profile information",
                  Description: "Need to update education and work experience on profile",
                  channel: "email",
                  from_address: "sarah.chen@glg.com",
                  created_at: "2024-01-15T09:30:00Z",
                  updated_at: "2024-01-15T14:20:00Z",
                  priority: "medium",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456789
                },
                {
                  id: "2234567891",
                  url: "https://example.com/ticket/2234567891.json",
                  Subject: "Add new certification to profile",
                  Description: "Recently obtained PMP certification, need to add to profile",
                  channel: "portal",
                  from_address: "michael.rodriguez@glg.com",
                  created_at: "2024-01-13T10:00:00Z",
                  updated_at: "2024-01-14T15:30:00Z",
                  priority: "low",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456790
                },
                {
                  id: "2234567892",
                  url: "https://example.com/ticket/2234567892.json",
                  Subject: "Contact information update",
                  Description: "Changed phone number and address, need profile update",
                  channel: "email",
                  from_address: "emily.johnson@glg.com",
                  created_at: "2024-01-12T14:00:00Z",
                  updated_at: "2024-01-15T11:00:00Z",
                  priority: "medium",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456791
                },
                {
                  id: "2234567893",
                  url: "https://example.com/ticket/2234567893.json",
                  Subject: "Profile photo update request",
                  Description: "Need to update professional headshot on profile",
                  channel: "portal",
                  from_address: "david.kim@glg.com",
                  created_at: "2024-01-11T09:00:00Z",
                  updated_at: "2024-01-11T09:00:00Z",
                  priority: "low",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456792
                },
                {
                  id: "2234567894",
                  url: "https://example.com/ticket/2234567894.json",
                  Subject: "Skills section enhancement",
                  Description: "Add new technical skills acquired in recent training",
                  channel: "email",
                  from_address: "sarah.chen@glg.com",
                  created_at: "2024-01-10T16:00:00Z",
                  updated_at: "2024-01-12T10:00:00Z",
                  priority: "medium",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456789
                },
                {
                  id: "2234567895",
                  url: "https://example.com/ticket/2234567895.json",
                  Subject: "Experience section correction",
                  Description: "Fix incorrect dates in work experience section",
                  channel: "portal",
                  from_address: "michael.rodriguez@glg.com",
                  created_at: "2024-01-09T11:00:00Z",
                  updated_at: "2024-01-10T14:00:00Z",
                  priority: "low",
                  ticket_language: "en",
                  medium: "nmhome",
                  network_member_id: 123456790
                }
              ]
            },
            {
              catalyst: "Verification",
              total_tickets: 2,
              tickets: [
                {
                  id: "2234567896",
                  url: "https://example.com/ticket/2234567896.json",
                  Subject: "ID verification documentation required",
                  Description: "Additional identity verification documents needed for compliance",
                  channel: "internal",
                  from_address: "compliance@glg.com",
                  created_at: "2024-01-10T14:20:00Z",
                  updated_at: "2024-01-14T09:15:00Z",
                  priority: "high",
                  ticket_language: "en",
                  medium: "internal",
                  network_member_id: 123456793
                },
                {
                  id: "2234567897",
                  url: "https://example.com/ticket/2234567897.json",
                  Subject: "Background check renewal",
                  Description: "Annual background check renewal required",
                  channel: "internal",
                  from_address: "hr@glg.com",
                  created_at: "2024-01-09T10:00:00Z",
                  updated_at: "2024-01-13T15:00:00Z",
                  priority: "medium",
                  ticket_language: "en",
                  medium: "internal",
                  network_member_id: 123456794
                }
              ]
            }
          ]
        },
        {
          category: "Projects",
          total_catalysts: 1,
          catalysts: [
            {
              catalyst: "Assignment",
              total_tickets: 3,
              tickets: [
                {
                  id: "3234567890",
                  url: "https://example.com/ticket/3234567890.json",
                  Subject: "Project assignment - Healthcare Analytics",
                  Description: "New project assignment in healthcare analytics domain",
                  channel: "email",
                  from_address: "projects@glg.com",
                  created_at: "2024-01-16T16:00:00Z",
                  updated_at: "2024-01-16T16:00:00Z",
                  priority: "urgent",
                  ticket_language: "en",
                  medium: "internal",
                  network_member_id: 123456789
                },
                {
                  id: "3234567891",
                  url: "https://example.com/ticket/3234567891.json",
                  Subject: "FinTech consultation project",
                  Description: "Financial technology consulting project for startup",
                  channel: "portal",
                  from_address: "projects@glg.com",
                  created_at: "2024-01-15T12:00:00Z",
                  updated_at: "2024-01-16T09:00:00Z",
                  priority: "high",
                  ticket_language: "en",
                  medium: "internal",
                  network_member_id: 123456790
                },
                {
                  id: "3234567892",
                  url: "https://example.com/ticket/3234567892.json",
                  Subject: "Manufacturing efficiency study",
                  Description: "Project to analyze manufacturing process improvements",
                  channel: "email",
                  from_address: "projects@glg.com",
                  created_at: "2024-01-14T08:30:00Z",
                  updated_at: "2024-01-15T17:45:00Z",
                  priority: "medium",
                  ticket_language: "en",
                  medium: "internal",
                  network_member_id: 123456791
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
          LOCALIZED_NAME: "陈莎拉",
          COUNTRY: "United States",
          ADDRESS: "123 Business Ave",
          CITY: "New York",
          STATE: "NY",
          ZIP: "10001",
          REGION: "North America",
          PHONE: "+1-555-0123",
          EMAIL: "sarah.chen@glg.com",
          TERMS_CONDITIONS_ACTIVE: "true",
          LATEST_TERMS_CONDITIONS_START_DATE: "2024-01-01",
          DAILY_RATE: "1200.0000",
          CONSULTATION_RATE: "350.0000",
          MIN_PROJECT_AMOUNT: "5000",
          RECOMMENDED_CONSULTATION_RATE: "300.0000",
          BIOGRAPHY: "Sarah Chen is a seasoned healthcare consultant with over 8 years of experience in digital transformation initiatives. She currently serves as Senior Consultant at GLG, specializing in healthcare analytics and process optimization. Previously, Sarah held positions at McKinsey & Company and worked extensively with Fortune 500 healthcare organizations.",
          COUNCIL_NAME: "Healthcare & Life Sciences",
          PRACTICE_AREA: "Healthcare Analytics",
          IS_DNC: "false",
          DNC_REASON: "UNKNOWN",
          CURRENTLY_RETIRED: "false",
          PREFERRED_CULTURE: "en",
          CURRENT_PRIMARY_LANGUAGE: "English",
          PROFILE_CREATE_DATE: "2022-03-15",
          NPI_NUMBER: "1234567890",
          LINKED_IN_PROFILE_URL: "https://linkedin.com/in/sarahchen",
          PUBLIC_OFFICIAL_IND: "false",
          PERSONA_VERIFICATION_DATE: "2024-01-01"
        },
        sections: [
          {
            title: "Work History",
            summary: "Current Senior Healthcare Consultant at GLG with 8+ years experience. Previously at McKinsey & Company and Deloitte Consulting specializing in healthcare analytics and digital transformation.",
            details: {
              network_member_id: 123456789,
              history: [
                {
                  job_title: "Senior Healthcare Consultant",
                  description: "Leading digital transformation initiatives for healthcare providers",
                  company_name: "GLG",
                  current_ind: true,
                  start_month: "3",
                  end_month: null,
                  start_year: "2022",
                  end_year: null,
                  affiliation: "Full-time Employee",
                  company_type: "private"
                },
                {
                  job_title: "Management Consultant",
                  description: "Healthcare strategy and operations consulting",
                  company_name: "McKinsey & Company",
                  current_ind: false,
                  start_month: "6",
                  end_month: "2",
                  start_year: "2019",
                  end_year: "2022",
                  affiliation: "Full-time Employee",
                  company_type: "private"
                },
                {
                  job_title: "Business Analyst",
                  description: "Healthcare analytics and process improvement",
                  company_name: "Deloitte Consulting",
                  current_ind: false,
                  start_month: "8",
                  end_month: "5",
                  start_year: "2017",
                  end_year: "2019",
                  affiliation: "Full-time Employee",
                  company_type: "private"
                }
              ]
            }
          },
          {
            title: "Fee History",
            summary: "Current consultation rate: $365/hr (approved). Recent rate increases in 2024 and 2023 based on performance metrics and market adjustments.",
            details: {
              network_member_id: 123456789,
              history: [
                {
                  create_date: "2024-01-15",
                  last_update_date: "2024-01-16",
                  last_update_by: "Rate Committee",
                  requested_rate: 375,
                  recommended_rate: 350,
                  renegotiate_rate: 365,
                  status: "approved",
                  reason: "Performance-based increase for Q2 2024"
                },
                {
                  create_date: "2023-06-01",
                  last_update_date: "2023-06-15",
                  last_update_by: "Sarah Johnson",
                  requested_rate: 350,
                  recommended_rate: 325,
                  renegotiate_rate: 340,
                  status: "approved",
                  reason: "Annual rate review adjustment"
                },
                {
                  create_date: "2022-12-01",
                  last_update_date: "2022-12-10",
                  last_update_by: "Michael Torres",
                  requested_rate: 325,
                  recommended_rate: 300,
                  renegotiate_rate: 315,
                  status: "approved",
                  reason: "Initial rate setting for specialized expertise"
                }
              ]
            }
          },
          {
            title: "Project History",
            summary: "Active in Healthcare & Life Sciences council. Recent projects include digital transformation strategy ($350/hr) and telemedicine implementation assessment. High performance with 120+ minute consultations.",
            details: {
              network_member_id: 123456789,
              history: [
                {
                  project_create_date: "2024-01-01",
                  project_id: 754663456,
                  project_meeting_id: 134534523,
                  consultation_participant_id: 1234,
                  title: "Healthcare Digital Transformation Strategy",
                  description: "Strategic consulting for major healthcare provider's digital transformation initiative",
                  rm_headline: "Digital Health Innovation for Regional Healthcare System",
                  council_name: "Healthcare & Life Sciences",
                  zone_region_name: "North America",
                  primary_rm: "Jennifer Walsh",
                  product_name: "Strategic Consultation",
                  product_type: "Extended Consultation",
                  client_duration: 120,
                  cm_duration: 90,
                  cm_prep_time: 30,
                  client_billable_minutes: 110,
                  pay_cm_duration: 85,
                  cm_rate_for_project: 350,
                  first_invite_date: "2024-01-02",
                  first_accept_date: "2024-01-03",
                  first_stc_date: "2024-01-04",
                  first_decline_date: null,
                  first_scheduled_date: "2024-01-08",
                  first_call_occurred_date: "2024-01-08"
                },
                {
                  project_create_date: "2023-11-15",
                  project_id: 754663457,
                  project_meeting_id: 134534524,
                  consultation_participant_id: 1235,
                  title: "Telemedicine Implementation Assessment",
                  description: "Evaluation of telemedicine platform implementation for mid-size healthcare network",
                  rm_headline: "Telemedicine Strategy and Implementation",
                  council_name: "Healthcare & Life Sciences",
                  zone_region_name: "North America",
                  primary_rm: "David Park",
                  product_name: "Expert Interview",
                  product_type: "Phone Consultation",
                  client_duration: 60,
                  cm_duration: 45,
                  cm_prep_time: 15,
                  client_billable_minutes: 55,
                  pay_cm_duration: 40,
                  cm_rate_for_project: 325,
                  first_invite_date: "2023-11-16",
                  first_accept_date: "2023-11-17",
                  first_stc_date: "2023-11-18",
                  first_decline_date: null,
                  first_scheduled_date: "2023-11-22",
                  first_call_occurred_date: "2023-11-22"
                }
              ]
            }
          },
          {
            title: "TC History",
            summary: "Current terms period: 2024-01-01 to 2024-12-31. Next renewal: 2025-01-01. Consistent annual renewals since joining in 2022.",
            details: {
              network_member_id: 123456789,
              history: [
                {
                  tc_start_date: "2024-01-01",
                  tc_end_date: "2024-12-31",
                  next_tc_start_date: "2025-01-01"
                },
                {
                  tc_start_date: "2023-01-01",
                  tc_end_date: "2023-12-31",
                  next_tc_start_date: "2024-01-01"
                },
                {
                  tc_start_date: "2022-03-15",
                  tc_end_date: "2022-12-31",
                  next_tc_start_date: "2023-01-01"
                }
              ]
            }
          }
        ]
      }
    };
  }

  private getMockAutoResponse(request: AutoResponseRequest): AutoResponseResponse {
    const { ticket_id, ticket_subject, ticket_description, category, catalyst, ticket_details } = request;
    const member = ticket_details.network_member_details;

    // Generate realistic HTML email content based on request data
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
            Thank you for contacting GLG regarding your ${category.toLowerCase()} ${catalyst.toLowerCase()} request: "${ticket_subject}".
            We have reviewed your inquiry and are pleased to provide the following response.
          </p>
          <div style="background-color: #F9FAFB; padding: 15px; border-left: 4px solid #1E3A8A; margin: 15px 0;">
            <p style="color: #374151; margin: 0; font-style: italic;">"${ticket_description}"</p>
          </div>
        </div>

        ${category === "Rate" ? `
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1E3A8A; margin: 0 0 15px 0; font-size: 18px;">Rate Information</h3>
          <ul style="color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Current consultation rate: $${member.CONSULTATION_RATE}/hour</li>
            <li>Recommended rate: $${member.RECOMMENDED_CONSULTATION_RATE}/hour</li>
            <li>Council: ${member.COUNCIL_NAME}</li>
            <li>Practice area: ${member.PRACTICE_AREA}</li>
          </ul>
        </div>
        ` : ''}

        ${category === "Profile" ? `
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1E3A8A; margin: 0 0 15px 0; font-size: 18px;">Profile Update</h3>
          <p style="color: #374151; line-height: 1.6; margin: 0;">
            We have received your profile ${catalyst.toLowerCase()} request. Our team will review the submitted information
            and update your profile accordingly. You should see the changes reflected within 24-48 hours.
          </p>
        </div>
        ` : ''}

        <div style="margin-bottom: 25px;">
          <p style="color: #374151; line-height: 1.6; margin: 0 0 15px 0;">
            Based on your current standing as a ${member.PRACTICE_AREA} expert in our ${member.COUNCIL_NAME} council,
            we value your continued participation in the GLG network.
          </p>
          <p style="color: #374151; line-height: 1.6; margin: 0 0 15px 0;">
            If you have any additional questions or require further assistance, please don't hesitate to reach out to our support team.
          </p>
        </div>

        <div style="background-color: #1E3A8A; color: white; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <h4 style="margin: 0 0 10px 0; font-size: 16px;">Next Steps</h4>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>We will process your request within 2-3 business days</li>
            <li>You will receive email confirmation once completed</li>
            <li>Updates will be reflected in your GLG portal</li>
          </ul>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 12px; line-height: 1.4; margin: 0;">
            Best regards,<br>
            GLG Customer Success Team<br>
            <a href="mailto:support@glg.it" style="color: #1E3A8A;">support@glg.it</a>
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
