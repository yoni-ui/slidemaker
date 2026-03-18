export type SlideContent = {
  title: string;
  subtitle?: string | null;
  bullets: string[];
  layout?: string | null;
  theme?: string | null;
};

export type GenerateResponse = {
  slides: SlideContent[];
};

