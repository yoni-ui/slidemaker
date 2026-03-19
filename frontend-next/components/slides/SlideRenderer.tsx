import { pollinationsUrl } from "@/lib/pollinations"
import { HeroSlide } from "./HeroSlide"
import { BulletListSlide } from "./BulletListSlide"
import { TwoColumnSlide } from "./TwoColumnSlide"
import { ImageTextSlide } from "./ImageTextSlide"
import { TitleOnlySlide } from "./TitleOnlySlide"
import { QuoteSlide } from "./QuoteSlide"
import { StatsSlide } from "./StatsSlide"
import { TitleCardSlide } from "./TitleCardSlide"
import { AgendaSlide } from "./AgendaSlide"
import { ProcessFlowSlide } from "./ProcessFlowSlide"
import { CompanyValuesSlide } from "./CompanyValuesSlide"
import { NextStepsSlide } from "./NextStepsSlide"
import { ThankYouSlide } from "./ThankYouSlide"
import { PartnerLogosSlide } from "./PartnerLogosSlide"
import { SwotSlide } from "./SwotSlide"
import { TeamOverviewSlide } from "./TeamOverviewSlide"
import { TestimonialsSlide } from "./TestimonialsSlide"
import { CaseStudySlide } from "./CaseStudySlide"
import { ProductFeaturesSlide } from "./ProductFeaturesSlide"
import { PricingSlide } from "./PricingSlide"
import { DataChartSlide } from "./DataChartSlide"
import { TimelineSlide } from "./TimelineSlide"
import { MilestonesSlide } from "./MilestonesSlide"
import { GlobalPresenceSlide } from "./GlobalPresenceSlide"
import { FreeformSlide } from "./FreeformSlide"
import type { EditableSlide } from "./types"
import type { LayoutKey } from "@/lib/design-system"

type Props = {
  slide: EditableSlide
  editMode?: boolean
  onUpdate?: (patch: Partial<EditableSlide>) => void
  onUpdateBullet?: (index: number, value: string) => void
  onAddBullet?: () => void
  onRemoveBullet?: (index: number) => void
}

const renderLayout = (
  slide: EditableSlide,
  editProps?: Omit<Props, "slide">
) => {
  const layout = slide.layout

  const passEdit = editProps
    ? {
        editMode: editProps.editMode,
        onUpdate: editProps.onUpdate,
        onUpdateBullet: editProps.onUpdateBullet,
        onAddBullet: editProps.onAddBullet,
        onRemoveBullet: editProps.onRemoveBullet,
      }
    : {}

  switch (layout) {
    case "hero":
      return <HeroSlide slide={slide} {...passEdit} />
    case "title-card":
      return <TitleCardSlide slide={slide} {...passEdit} />
    case "bullet-list":
      return <BulletListSlide slide={slide} {...passEdit} />
    case "agenda":
      return <AgendaSlide slide={slide} {...passEdit} />
    case "two-column":
      return <TwoColumnSlide slide={slide} {...passEdit} />
    case "process-flow":
      return <ProcessFlowSlide slide={slide} {...passEdit} />
    case "image-text":
      return <ImageTextSlide slide={slide} {...passEdit} />
    case "product-features":
      return <ProductFeaturesSlide slide={slide} {...passEdit} />
    case "title-only":
      return <TitleOnlySlide slide={slide} {...passEdit} />
    case "quote":
      return <QuoteSlide slide={slide} {...passEdit} />
    case "stats":
      return <StatsSlide slide={slide} {...passEdit} />
    case "team-overview":
      return <TeamOverviewSlide slide={slide} {...passEdit} />
    case "testimonials":
      return <TestimonialsSlide slide={slide} {...passEdit} />
    case "case-study":
      return <CaseStudySlide slide={slide} {...passEdit} />
    case "company-values":
      return <CompanyValuesSlide slide={slide} {...passEdit} />
    case "pricing":
      return <PricingSlide slide={slide} {...passEdit} />
    case "data-chart":
      return <DataChartSlide slide={slide} {...passEdit} />
    case "timeline":
      return <TimelineSlide slide={slide} {...passEdit} />
    case "milestones":
      return <MilestonesSlide slide={slide} {...passEdit} />
    case "swot":
      return <SwotSlide slide={slide} {...passEdit} />
    case "global-presence":
      return <GlobalPresenceSlide slide={slide} {...passEdit} />
    case "next-steps":
      return <NextStepsSlide slide={slide} {...passEdit} />
    case "partner-logos":
      return <PartnerLogosSlide slide={slide} {...passEdit} />
    case "thank-you":
      return <ThankYouSlide slide={slide} {...passEdit} />
    case "freeform":
      return <FreeformSlide slide={slide} {...passEdit} />
    default:
      return <BulletListSlide slide={slide} />
  }
}

export const SlideRenderer = (props: Props) => {
  const { slide } = props
  const content = renderLayout(slide, props)

  const wrapped = (
    <div className="font-slide h-full w-full">{content}</div>
  )

  if (slide.backgroundPrompt) {
    const bgUrl = pollinationsUrl(slide.backgroundPrompt, 960, 540)
    return (
      <div className="relative h-full w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
        <div className="relative z-10 h-full w-full">{wrapped}</div>
      </div>
    )
  }

  return wrapped
}
