import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import Button from './components/Button';
import { AppState, CelebOption } from './types';
import { CELEBRITIES } from './constants';
import { generateCelebrityPhotobomb } from './services/geminiService';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedCeleb, setSelectedCeleb] = useState<CelebOption | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = useCallback((base64: string) => {
    setOriginalImage(base64);
    setAppState(AppState.IDLE);
    setGeneratedImage(null);
    setErrorMsg(null);
  }, []);

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setSelectedCeleb(null);
    setErrorMsg(null);
  };

  const processImage = async () => {
    if (!originalImage) return;

    try {
      setAppState(AppState.PROCESSING);
      setErrorMsg(null);

      // Pick a random celebrity
      const randomCeleb = CELEBRITIES[Math.floor(Math.random() * CELEBRITIES.length)];
      setSelectedCeleb(randomCeleb);

      const resultImage = await generateCelebrityPhotobomb(originalImage, randomCeleb.name);
      
      setGeneratedImage(resultImage);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("Failed to generate image. The AI might be busy or the request was filtered. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 selection:bg-indigo-500 selection:text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl">📸</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              CelebBomb
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 flex flex-col items-center">
        
        {/* Intro Text */}
        {!originalImage && (
            <div className="text-center max-w-2xl mx-auto mb-12 mt-8 animate-fade-in-up">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                    Add a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Celebrity</span> to your photos instantly.
                </h2>
                <p className="text-lg text-slate-400">
                    Upload a photo and let our AI seamlessly blend a random famous person into your scene. 
                    Powered by <span className="text-slate-300 font-medium">Gemini Nano Banana Pro</span>.
                </p>
            </div>
        )}

        {/* Upload Stage */}
        {!originalImage && (
          <div className="w-full max-w-xl animate-fade-in-up delay-100">
            <ImageUploader onImageSelected={handleImageSelected} />
            
            {/* Quick Gallery */}
            <div className="mt-12">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Who might show up?</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {CELEBRITIES.slice(0, 5).map(c => (
                        <span key={c.name} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">
                            {c.name}
                        </span>
                    ))}
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-500 border border-slate-700">+ many more</span>
                </div>
            </div>
          </div>
        )}

        {/* Processing/Result Stage */}
        {originalImage && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
            
            {/* Left Column: Original */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-300">Original Image</h3>
                    <button 
                        onClick={handleReset}
                        className="text-xs text-red-400 hover:text-red-300 hover:underline"
                        disabled={appState === AppState.PROCESSING}
                    >
                        Remove
                    </button>
                </div>
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                     <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                </div>
                
                {appState === AppState.IDLE && (
                    <div className="mt-6">
                         <Button 
                            onClick={processImage} 
                            className="w-full text-lg py-4"
                         >
                            ✨ Add Random Celebrity
                         </Button>
                         <p className="text-center text-xs text-slate-500 mt-3">
                             This will use 1 generation credit
                         </p>
                    </div>
                )}
            </div>

            {/* Right Column: Result */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 backdrop-blur-sm relative min-h-[400px] flex flex-col">
                <h3 className="font-semibold text-slate-300 mb-4">
                    {appState === AppState.SUCCESS ? "AI Enhanced Result" : "Preview"}
                </h3>

                {/* State: Processing */}
                {appState === AppState.PROCESSING && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 rounded-2xl backdrop-blur-sm">
                         <div className="relative w-20 h-20 mb-4">
                            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                         </div>
                         <h4 className="text-white font-medium text-lg animate-pulse">Inviting {selectedCeleb?.name}...</h4>
                         <p className="text-slate-400 text-sm mt-2">Enhancing reality with Nano Banana Pro</p>
                    </div>
                )}

                {/* State: Error */}
                {appState === AppState.ERROR && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-500/5 rounded-xl border border-red-500/20">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h4 className="text-white font-bold mb-2">Generation Failed</h4>
                        <p className="text-slate-400 text-sm mb-6">{errorMsg}</p>
                        <Button onClick={processImage} variant="secondary">Try Again</Button>
                    </div>
                )}

                {/* State: Empty/Idle */}
                {appState === AppState.IDLE && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-700 rounded-xl">
                        <span className="text-4xl mb-4 opacity-50">❓</span>
                        <p className="text-slate-500">Click the button to see the magic happen.</p>
                    </div>
                )}

                {/* State: Success */}
                {appState === AppState.SUCCESS && generatedImage && (
                    <div className="flex flex-col h-full">
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-indigo-500/50 shadow-2xl shadow-indigo-500/20 group">
                             <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                             <a 
                                href={generatedImage} 
                                download={`celebbomb-${selectedCeleb?.name}.png`}
                                className="absolute bottom-4 right-4 bg-white text-slate-900 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                title="Download"
                             >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                             </a>
                        </div>
                        <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Guest Star</p>
                                <p className="text-white font-bold text-lg">{selectedCeleb?.name}</p>
                            </div>
                            <Button onClick={processImage} variant="secondary" className="text-sm px-4 py-2">
                                🔄 Randomize Again
                            </Button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-12 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} CelebBomb. Generated images are for entertainment purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;