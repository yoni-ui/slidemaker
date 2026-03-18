import { HeroSlide } from "./HeroSlide"
import { BulletListSlide } from "./BulletListSlide"
import { TwoColumnSlide } from "./TwoColumnSlide"
import { ImageTextSlide } from "./ImageTextSlide"
import { TitleOnlySlide } from "./TitleOnlySlide"
import { QuoteSlide } from "./QuoteSlide"
import { StatsSlide } from "./StatsSlide"
import type { EditableSlide } from "./types"

type Props = { slide: EditableSlide }

export const SlideRenderer = ({ slide }: Props) => {
  switch (slide.layout) {
    case "hero":
      return <HeroSlide slide={slide} />
    case "bullet-list":
      return <BulletListSlide slide={slide} />
    case "two-column":
      return <TwoColumnSlide slide={slide} />
    case "image-text":
      return <ImageTextSlide slide={slide} />
    case "title-only":
      return <TitleOnlySlide slide={slide} />
    case "quote":
      return <QuoteSlide slide={slide} />
    case "stats":
      return <StatsSlide slide={slide} />
    default:
      return <BulletListSlide slide={slide} />
  }
}
