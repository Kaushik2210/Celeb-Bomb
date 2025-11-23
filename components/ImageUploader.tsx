import React, { ChangeEvent, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImageSelected(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-slate-800/50 transition-all group"
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={inputRef} 
        onChange={handleFileChange} 
      />
      <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20">
        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Upload your photo</h3>
      <p className="text-slate-400 text-sm max-w-xs">Click here to browse your files. We support JPG and PNG.</p>
    </div>
  );
};

export default ImageUploader;