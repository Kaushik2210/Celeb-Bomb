import React, { useEffect, useState } from 'react';
import Button from './Button';

interface ApiKeyCheckerProps {
  onKeySelected: () => void;
}

const ApiKeyChecker: React.FC<ApiKeyCheckerProps> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkKey = async () => {
    try {
      setLoading(true);
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
        if (selected) {
          onKeySelected();
        }
      } else {
        // Fallback for dev environments where window.aistudio might not exist yet
        console.warn("window.aistudio not found");
      }
    } catch (e) {
      console.error("Error checking API key", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Assume success as per instructions and re-check immediately
        await checkKey();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-95 backdrop-blur-sm">
        <div className="animate-pulse text-indigo-400 font-medium">Checking permissions...</div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-95 backdrop-blur-sm p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl text-center">
            <div className="mb-6 flex justify-center">
                <div className="p-3 bg-indigo-500/10 rounded-full">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.636 11.364 8.364 8.364 6.828 6.828 5.364 5.364 4.092 4.092 2.536 2.536 1.258 1.258A6 6 0 0115 7z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Access Required</h2>
            <p className="text-slate-400 mb-6">
                To use the high-quality <span className="text-indigo-400 font-mono text-sm">gemini-3-pro-image-preview</span> model for realistic image editing, you need to select a paid API key.
            </p>
            
            <Button onClick={handleSelectKey} className="w-full">
                Select API Key
            </Button>
            
            <p className="mt-4 text-xs text-slate-500">
                Learn more about billing at <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google AI Studio Billing</a>.
            </p>
        </div>
      </div>
    );
  }

  return null;
};

export default ApiKeyChecker;