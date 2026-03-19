import type { EditableSlide } from "@/components/slides/types"
import type { LayoutKey } from "./design-system"

export type StitchTemplateMeta = {
  id: string
  name: string
  path: string
  layout: LayoutKey
}

const STITCH_TEMPLATES: StitchTemplateMeta[] = [
  { id: "title_slide_template", name: "Title Slide", path: "title_slide_template", layout: "hero" },
  { id: "agenda_slide_template", name: "Agenda", path: "agenda_slide_template", layout: "agenda" },
  { id: "two_column_text_slide_template", name: "Two Column", path: "two_column_text_slide_template", layout: "two-column" },
  { id: "process_flow_slide_template", name: "Process Flow", path: "process_flow_slide_template", layout: "process-flow" },
  { id: "image_text_slide_template", name: "Image + Text", path: "image_text_slide_template", layout: "image-text" },
  { id: "product_features_slide_template", name: "Product Features", path: "product_features_slide_template", layout: "product-features" },
  { id: "big_idea_quote_slide_template", name: "Quote", path: "big_idea_quote_slide_template", layout: "quote" },
  { id: "data_chart_slide_template", name: "Data Chart", path: "data_chart_slide_template", layout: "data-chart" },
  { id: "team_overview_slide_template", name: "Team Overview", path: "team_overview_slide_template", layout: "team-overview" },
  { id: "testimonials_slide_template", name: "Testimonials", path: "testimonials_slide_template", layout: "testimonials" },
  { id: "case_study_slide_template", name: "Case Study", path: "case_study_slide_template", layout: "case-study" },
  { id: "company_values_slide_template", name: "Company Values", path: "company_values_slide_template", layout: "company-values" },
  { id: "pricing_comparison_slide_template", name: "Pricing", path: "pricing_comparison_slide_template", layout: "pricing" },
  { id: "timeline_slide_template", name: "Timeline", path: "timeline_slide_template", layout: "timeline" },
  { id: "key_milestones_slide_template", name: "Milestones", path: "key_milestones_slide_template", layout: "milestones" },
  { id: "swot_analysis_slide_template", name: "SWOT Analysis", path: "swot_analysis_slide_template", layout: "swot" },
  { id: "global_presence_slide_template", name: "Global Presence", path: "global_presence_slide_template", layout: "global-presence" },
  { id: "next_steps_slide_template", name: "Next Steps", path: "next_steps_slide_template", layout: "next-steps" },
  { id: "partner_logos_slide_template", name: "Partner Logos", path: "partner_logos_slide_template", layout: "partner-logos" },
  { id: "thank_you_slide_template", name: "Thank You", path: "thank_you_slide_template", layout: "thank-you" },
]

export const getStitchTemplates = (): StitchTemplateMeta[] => STITCH_TEMPLATES

export const getStitchTemplateById = (id: string): StitchTemplateMeta | undefined =>
  STITCH_TEMPLATES.find((t) => t.id === id)

export const stitchToEditableSlide = (
  template: StitchTemplateMeta,
  overrides?: Partial<EditableSlide>
): EditableSlide => ({
  title: template.name,
  subtitle: null,
  bullets: [],
  layout: template.layout,
  theme: "default",
  ...overrides,
})
