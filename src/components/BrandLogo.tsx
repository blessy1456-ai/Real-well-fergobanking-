import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'red-banner' | 'standalone' | 'white-text';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md', 
  variant = 'standalone',
  showTagline = false 
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          box: 'px-2.5 py-1',
          text: 'text-xs tracking-wider',
          sub: 'text-[8px]',
          iconSize: 'w-3.5 h-3.5'
        };
      case 'lg':
        return {
          box: 'px-4 py-2',
          text: 'text-lg sm:text-xl tracking-wide',
          sub: 'text-[10px]',
          iconSize: 'w-6 h-6'
        };
      case 'xl':
        return {
          box: 'px-5 py-2.5',
          text: 'text-2xl sm:text-3xl tracking-wide',
          sub: 'text-xs',
          iconSize: 'w-8 h-8'
        };
      case 'md':
      default:
        return {
          box: 'px-3.5 py-1.5',
          text: 'text-sm sm:text-base tracking-wide',
          sub: 'text-[9px]',
          iconSize: 'w-4 h-4'
        };
    }
  };

  const dims = getDimensions();

  return (
    <div className="inline-flex items-center gap-2 select-none">
      {/* Classic Wells Fargo Red Box with Gold/Yellow Serif Typography */}
      <div className={`bg-[#D71E28] rounded-xs shadow-sm flex items-center justify-center font-serif font-black uppercase text-[#FFCD00] border border-[#b3141d] ${dims.box}`}>
        <span className={`font-serif font-black tracking-widest leading-none drop-shadow-xs ${dims.text}`}>
          WELL FERGO
        </span>
      </div>

      {showTagline && (
        <div className="hidden sm:flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
            Online Banking
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Member FDIC
          </span>
        </div>
      )}
    </div>
  );
};
