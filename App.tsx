
import React, { useState, useCallback } from 'react';
import { Niche, YouTubeScript } from './types';
import { generateScript, generateImage, generateThumbnail } from './services/geminiService';
import NicheSelector from './components/NicheSelector';
import ScriptView from './components/ScriptView';
import Button from './components/Button';

function App() {
  const [niche, setNiche] = useState<Niche>('Technology');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState<YouTubeScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateScript(topic, niche);
      setScript(generated);
    } catch (err) {
      setError('Failed to generate script. Please try a different topic or check your API key.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSegmentImage = async (index: number) => {
    if (!script) return;
    
    // Update local state to show loading for specific segment
    const newSegments = [...script.segments];
    newSegments[index].isGeneratingImage = true;
    setScript({ ...script, segments: newSegments });

    try {
      const imageUrl = await generateImage(newSegments[index].visualDescription);
      const updatedSegments = [...script.segments];
      updatedSegments[index].imageUrl = imageUrl;
      updatedSegments[index].isGeneratingImage = false;
      setScript({ ...script, segments: updatedSegments });
    } catch (err) {
      console.error(err);
      const resetSegments = [...script.segments];
      resetSegments[index].isGeneratingImage = false;
      setScript({ ...script, segments: resetSegments });
      setError('Failed to generate image for segment ' + (index + 1));
    }
  };

  const handleGenerateFullThumbnail = async () => {
    if (!script) return;
    setIsLoading(true);
    try {
      const thumbUrl = await generateThumbnail(script.thumbnailPrompt);
      setScript({ ...script, thumbnailUrl: thumbUrl });
    } catch (err) {
      setError('Failed to generate thumbnail.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            <h1 className="text-xl font-bold tracking-tighter uppercase brand-font">YT Mastermind</h1>
          </div>
          <div className="text-xs text-slate-500 font-medium bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Powered by Gemini
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        {!script ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-7xl font-bold brand-font tracking-tight">Create Viral Scripts <br/> <span className="text-red-600">Instantly</span></h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Select your niche, enter a topic, and let AI generate a high-retention script, SEO metadata, and cinematic visuals for your next masterpiece.
              </p>
            </div>

            <section className="space-y-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">1. Choose Your Niche</label>
                <NicheSelector selectedNiche={niche} onSelect={setNiche} />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">2. What's the video about?</label>
                <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. 10 Mistakes beginner programmers make in 2024"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
                  />
                  <Button type="submit" isLoading={isLoading} className="md:w-48 text-lg py-4">
                    Generate Script
                  </Button>
                </form>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" onClick={() => setScript(null)} className="flex items-center gap-2">
                <span>←</span> Create New Video
              </Button>
              <div className="flex gap-2">
                 <Button variant="secondary" onClick={() => window.print()} className="text-sm">Print / PDF</Button>
              </div>
            </div>
            
            <ScriptView 
              script={script} 
              onGenerateImage={handleGenerateSegmentImage} 
              onGenerateThumbnail={handleGenerateFullThumbnail}
              isGeneratingAny={isLoading}
            />
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-800 text-red-400 rounded-xl text-center">
            {error}
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-800 py-10 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} YT Mastermind Studio. All rights reserved.</p>
        <p className="mt-2">Made for Content Creators who want to lead the algorithm.</p>
      </footer>
    </div>
  );
}

export default App;
