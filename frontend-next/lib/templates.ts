import type { EditableSlide } from "@/components/slides/types"
import type { LayoutKey } from "./design-system"

export type DeckTemplate = {
  id: string
  name: string
  category: string
  description: string
  slides: EditableSlide[]
}

const slide = (
  layout: LayoutKey,
  title: string,
  subtitle: string | null,
  bullets: string[],
  extra?: Partial<EditableSlide>
): EditableSlide => ({
  title,
  subtitle,
  bullets,
  layout,
  theme: "default",
  ...extra,
})

export const TEMPLATES: DeckTemplate[] = [
  {
    id: "pitch-deck",
    name: "Startup Pitch",
    category: "Pitch",
    description: "Classic investor pitch deck with problem, solution, market, and team",
    slides: [
      slide("hero", "Your Company Name", "Tagline that captures your vision", []),
      slide("bullet-list", "The Problem", null, [
        "Current solutions fall short",
        "Market gap worth $X billion",
        "Users are frustrated with alternatives",
      ]),
      slide("image-text", "Our Solution", "A better way to solve the problem", [
        "Key benefit 1",
        "Key benefit 2",
        "Key benefit 3",
      ], { imagePrompt: "modern startup office team collaboration" }),
      slide("stats", "Traction", null, [
        "10K+ | Active Users",
        "$500K | MRR",
        "150% | YoY Growth",
      ]),
      slide("team-overview", "Meet the Team", "Industry veterans driving innovation", [
        "Jane Doe | CEO | Vision leads the way",
        "John Smith | CTO | Build for scale",
        "Alex Lee | Head of Design | Form follows function",
      ]),
      slide("pricing", "Pricing Plans", "Choose the right plan for your team", [
        "Starter | $0 | Up to 3 projects, Basic analytics, Community forum",
        "Professional | $49 | Unlimited projects, Advanced analytics, Priority support",
        "Enterprise | Custom | Everything in Pro, Dedicated success manager, SLA",
      ]),
      slide("quote", "The best way to predict the future is to create it.", "Peter Drucker", []),
    ],
  },
  {
    id: "company-report",
    name: "Company Report",
    category: "Business",
    description: "Quarterly business review with metrics, timeline, and next steps",
    slides: [
      slide("title-card", "Q4 Business Review", null, [
        "Sarah Chen | VP of Strategy",
        "Dec 15, 2024 | HQ Conference Room",
      ]),
      slide("agenda", "Agenda", null, [
        "01 | Overview | Key highlights and wins",
        "02 | Metrics | Performance dashboard",
        "03 | Timeline | Roadmap and milestones",
        "04 | Next Steps | Action items",
      ]),
      slide("data-chart", "Market Growth Analysis", "Fiscal Year 2024 • Quarterly Performance", [
        "Total Revenue | $12.4M | +12.5%",
        "Active Users | 842K | +8.2%",
        "Churn Rate | 2.4% | -0.4%",
      ]),
      slide("timeline", "Strategic Implementation Roadmap", "A 5-phase approach to delivering value", [
        "Q1 2024 | Discovery | Stakeholder interviews and market analysis",
        "Q2 2024 | Ideation | Conceptual design and prototyping",
        "Q3 2024 | Development | Build and iterate",
        "Q4 2024 | Launch | Go-to-market execution",
        "Q1 2025 | Scale | Optimize and expand",
      ]),
      slide("next-steps", "Next Steps", "Immediate actions to move forward", [
        "✓ Review and sign the service agreement",
        "○ Schedule kickoff meeting with stakeholders",
        "○ Allocate budget for Q1 initiatives",
        "○ Finalize hiring plan",
      ]),
      slide("thank-you", "Thank You!", "We appreciate your time and attention.", [
        "mail | Email | hello@company.com",
        "language | Website | www.company.com",
        "alternate_email | Twitter | @company_handle",
        "share | LinkedIn | linkedin.com/company",
      ]),
    ],
  },
  {
    id: "product-launch",
    name: "Product Launch",
    category: "Product",
    description: "Product announcement with features, testimonials, and pricing",
    slides: [
      slide("hero", "Introducing Product X", "The future of workflow management", []),
      slide("product-features", "The Future of Workflow Management", "Deep analytics with a seamless UI", [
        "Instant Sync | Data updates across all devices in real-time",
        "Secure Core | Enterprise-grade encryption",
        "Smart Automation | AI-powered workflows",
        "Team Collaboration | Real-time co-editing",
      ]),
      slide("testimonials", "Client Testimonials", "Trusted by 500+ industry leaders", [
        "The implementation was seamless and results exceeded expectations. Truly a game-changer. | Sarah Jenkins | CEO at TechFlow",
        "A truly professional team that understands enterprise architecture. Unparalleled insight. | Michael Chen | Director at Innovate Inc",
        "Best investment we made this year. ROI in the first quarter. | Emma Wilson | VP Operations",
      ]),
      slide("pricing", "Scale with the right tools", "Choose a plan that fits your needs", [
        "Starter | $0 | 3 projects, Basic analytics, Community support",
        "Pro | $49 | Unlimited projects, Advanced analytics, Priority support",
        "Enterprise | Custom | Everything + Dedicated manager, SLA",
      ]),
      slide("thank-you", "Thank You!", "Questions? Let's connect.", [
        "mail | Email | product@company.com",
        "language | Website | product.company.com",
      ]),
    ],
  },
  {
    id: "strategy-swot",
    name: "Strategy & SWOT",
    category: "Strategy",
    description: "Strategic analysis with SWOT, case study, and global presence",
    slides: [
      slide("hero", "Strategic Analysis 2024", "Market positioning and growth opportunities", []),
      slide("swot", "Strategic SWOT Analysis", "Project Performance & Market Positioning", [
        "S: Market leadership in core technology",
        "S: Highly skilled R&D team",
        "S: Strong brand recognition",
        "W: Limited marketing budget",
        "W: Dependency on single supply chain",
        "O: Emerging markets expansion",
        "O: Strategic partnerships",
        "T: Increased competition",
        "T: Regulatory changes",
      ]),
      slide("case-study", "Project Aurora: Digital Transformation", "Critical bottlenecks in legacy infrastructure led to 15% customer churn", [
        "Efficiency Increase | +42%",
        "Cost Reduction | -$1.2M",
        "Implemented cloud-native architecture",
        "Developed AI-driven dashboards",
        "Seamless ERP/CRM integration",
      ], { imagePrompt: "modern office team collaborating around computer" }),
      slide("global-presence", "Global Presence", "Strategic Market Reach & Operational Hubs", [
        "North America | 15 Offices | 500+ Employees",
        "Europe | 8 Hubs | 200+ Staff",
        "Middle East | 5 Branches | 100+ Team",
        "Asia Pacific | 12 Centers | 400+ People",
      ]),
      slide("thank-you", "Thank You", "Let's discuss next steps.", []),
    ],
  },
  {
    id: "onboarding",
    name: "Team Onboarding",
    category: "Internal",
    description: "New hire onboarding with values, process, and team intro",
    slides: [
      slide("title-card", "Welcome to the Team!", null, [
        "New Hire | Starting Today",
        "Jan 2025 | HQ",
      ]),
      slide("company-values", "Our Culture & Values", null, [
        "Innovation | Pioneering new solutions and embracing creative risks",
        "Integrity | Uncompromising honesty and ethical transparency",
        "Collaboration | Leveraging diverse perspectives to achieve more",
      ]),
      slide("process-flow", "Your First 90 Days", null, [
        "Week 1-2 | Onboarding | Meet the team, setup, and orientation",
        "Week 3-4 | Training | Product and process deep-dive",
        "Month 2 | Contribution | First projects and mentorship",
        "Month 3 | Ownership | Lead your first initiative",
      ]),
      slide("team-overview", "Meet Your Team", "Your go-to people", [
        "Manager Name | Your Manager | Here to help",
        "Buddy Name | Onboarding Buddy | Day-to-day support",
        "HR Contact | People Team | Questions and benefits",
      ]),
      slide("next-steps", "Next Steps", "Your action items", [
        "○ Complete HR paperwork",
        "○ Set up your workspace",
        "○ Schedule 1:1 with manager",
        "○ Join team standup",
      ]),
      slide("thank-you", "Welcome Aboard!", "We're excited to have you.", []),
    ],
  },
  {
    id: "partner-ecosystem",
    name: "Partner Ecosystem",
    category: "Business",
    description: "Partner and client showcase with logos and testimonials",
    slides: [
      slide("hero", "Our Partner Ecosystem", "Trusted by industry leaders worldwide", []),
      slide("partner-logos", "Trusted by Industry Leaders", "50+ global organizations rely on us", [
        "ACME",
        "TechCorp",
        "GlobalInc",
        "InnovateCo",
        "DataFlow",
        "CloudSync",
      ]),
      slide("testimonials", "What Partners Say", "Exceptional results and excellence", [
        "Seamless integration and outstanding support. | Partner A | CTO",
        "Best partnership we've ever had. | Partner B | CEO",
        "Transformed our operations. | Partner C | VP",
      ]),
      slide("next-steps", "Become a Partner", "Join our growing network", [
        "○ Submit partnership application",
        "○ Technical integration review",
        "○ Joint go-to-market planning",
      ]),
      slide("thank-you", "Let's Connect", "Ready to partner?", [
        "mail | partnerships@company.com",
        "language | partners.company.com",
      ]),
    ],
  },
]

export const getTemplateById = (id: string): DeckTemplate | undefined =>
  TEMPLATES.find((t) => t.id === id)

export const getTemplatesByCategory = (category: string): DeckTemplate[] =>
  TEMPLATES.filter((t) => t.category === category)

export const TEMPLATE_CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))]
