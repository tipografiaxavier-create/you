
import React from 'react';
import { YouTubeScript } from '../types';
import Button from './Button';

interface ScriptViewProps {
  script: YouTubeScript;
  onGenerateImage: (index: number) => void;
  onGenerateThumbnail: () => void;
  isGeneratingAny: boolean;
}

const ScriptView: React.FC<ScriptViewProps> = ({ 
  script, 
  onGenerateImage, 
  onGenerateThumbnail, 
  isGeneratingAny 
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          {script.title}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {script.seoTags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium border border-slate-700">
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-slate-400 text-sm italic">Target Audience: {script.targetAudience}</p>
      </section>

      {/* Thumbnail Area */}
      <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>🖼️</span> Thumbnail Concept
          </h3>
          <Button 
            variant="secondary" 
            onClick={onGenerateThumbnail} 
            isLoading={isGeneratingAny}
            className="text-sm py-2"
          >
            {script.thumbnailUrl ? 'Regenerate Thumbnail' : 'Generate Thumbnail'}
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
            <p className="text-slate-300 text-sm leading-relaxed">{script.thumbnailPrompt}</p>
          </div>
          <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center border-2 border-slate-700">
            {script.thumbnailUrl ? (
              <img src={script.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            ) : (
              <p className="text-slate-500 text-sm">Image will appear here</p>
            )}
          </div>
        </div>
      </section>

      {/* Script Segments */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold brand-font tracking-wider">The Content Roadmap</h3>
        {script.segments.map((segment, index) => (
          <div key={index} className="grid md:grid-cols-[1fr_300px] gap-6 bg-slate-900/30 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                  segment.type === 'HOOK' ? 'bg-red-600' :
                  segment.type === 'INTRO' ? 'bg-indigo-600' :
                  segment.type === 'BODY' ? 'bg-slate-700' :
                  segment.type === 'CTA' ? 'bg-emerald-600' : 'bg-slate-500'
                }`}>
                  {segment.type}
                </span>
                <span className="text-slate-500 text-xs font-mono uppercase">Segment {index + 1}</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-lg">{segment.text}</p>
              <div className="mt-4 p-3 bg-slate-950/40 rounded-lg">
                <p className="text-slate-500 text-xs uppercase font-bold mb-1">Visual Direction</p>
                <p className="text-slate-400 text-sm italic">{segment.visualDescription}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden relative border border-slate-800">
                {segment.imageUrl ? (
                  <img src={segment.imageUrl} alt={`Scene ${index}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    {segment.isGeneratingImage ? (
                      <div className="animate-pulse flex flex-col items-center gap-2">
                         <div className="w-10 h-10 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                         <p className="text-slate-500 text-xs">Sketching scene...</p>
                      </div>
                    ) : (
                      <p className="text-slate-600 text-xs">No visual generated</p>
                    )}
                  </div>
                )}
              </div>
              <Button 
                variant="ghost" 
                className="w-full text-xs py-2" 
                onClick={() => onGenerateImage(index)}
                isLoading={segment.isGeneratingImage}
              >
                {segment.imageUrl ? 'Retry Visual' : 'Generate Visual'}
              </Button>
            </div>
          </div>
        ))}
      </section>

      {/* SEO Box */}
      <section className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-4 text-red-500 uppercase tracking-tighter">YouTube SEO Dashboard</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Video Description (Optimized)</label>
            <div className="bg-slate-950 p-4 rounded-xl text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">
              {script.description}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScriptView;
