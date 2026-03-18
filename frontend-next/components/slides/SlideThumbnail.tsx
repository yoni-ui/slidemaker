import { SLIDE_W, SLIDE_H } from "@/lib/design-system"
import { SlideRenderer } from "./SlideRenderer"
import type { EditableSlide } from "./types"

type Props = {
  slide: EditableSlide
  /** Width in px of the thumbnail container */
  width?: number
}

export const SlideThumbnail = ({ slide, width = 168 }: Props) => {
  const scale = width / SLIDE_W
  const height = SLIDE_H * scale

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{ width, height }}
    >
      <div
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
      >
        <SlideRenderer slide={slide} />
      </div>
    </div>
  )
}
