
export interface ScriptSegment {
  type: 'HOOK' | 'INTRO' | 'BODY' | 'CTA' | 'OUTRO';
  text: string;
  visualDescription: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface YouTubeScript {
  title: string;
  seoTags: string[];
  description: string;
  targetAudience: string;
  segments: ScriptSegment[];
  thumbnailPrompt: string;
  thumbnailUrl?: string;
}

export type Niche = 'Technology' | 'Cooking' | 'Education' | 'Vlog' | 'Gaming' | 'Business' | 'Fitness' | 'True Crime' | 'Custom';

export interface NicheInfo {
  id: Niche;
  icon: string;
  label: string;
  color: string;
}
