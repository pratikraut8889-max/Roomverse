import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Maximize2, Minimize2, Columns, Eye, Sparkles } from 'lucide-react';

interface CompareSliderProps {
  originalImage: string;
  reimaginedImage: string;
  styleName: string;
  roomType?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  originalImage,
  reimaginedImage,
  styleName,
  roomType = 'Living Room',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSideBySide, setIsSideBySide] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      id="room-compare-slider-container"
      className={`relative rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-stone-900 select-none transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-xl max-w-none' : 'w-full'
      }`}
    >
      {/* Top action toolbar overlay */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-stone-900/80 backdrop-blur-md text-amber-300 rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {styleName} Style
          </span>
          <span className="hidden sm:inline-flex px-2.5 py-1 text-xs font-medium bg-black/60 backdrop-blur-md text-stone-200 rounded-full border border-white/10">
            {roomType}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            id="btn-toggle-side-by-side"
            type="button"
            onClick={() => setIsSideBySide(!isSideBySide)}
            className="px-2.5 py-1.5 text-xs font-medium bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-lg border border-white/15 transition-colors flex items-center gap-1.5"
            title="Toggle Split / Side-by-Side"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isSideBySide ? 'Slider Mode' : 'Side by Side'}</span>
          </button>
          <button
            id="btn-toggle-fullscreen"
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-xs font-medium bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-lg border border-white/15 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Compare'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isSideBySide ? (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 h-[460px] sm:h-[520px] bg-stone-950">
          <div className="relative h-full overflow-hidden group">
            <img
              src={originalImage}
              alt="Original Space"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-stone-300 text-xs font-medium border border-white/10">
              Original Space
            </div>
          </div>
          <div className="relative h-full overflow-hidden group">
            <img
              src={reimaginedImage}
              alt="AI Reimagined Space"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-stone-950 text-xs font-bold border border-amber-300/40">
              RoomRevise AI Makeover
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Draggable Split Slider */
        <div
          ref={containerRef}
          className="relative h-[440px] sm:h-[520px] w-full overflow-hidden cursor-ew-resize focus:outline-none"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }}
        >
          {/* Background: AI Reimagined Image (Full width underneath) */}
          <img
            src={reimaginedImage}
            alt="AI Reimagined Room"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Foreground: Original Image (Clipped from left to sliderPosition %) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none will-change-[width]"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="relative h-full"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw'
              }}
            >
              <img
                src={originalImage}
                alt="Original Room Before Makeover"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Draggable Divider Line & Knob */}
          <div
            className="absolute inset-y-0 pointer-events-none z-20 flex items-center justify-center will-change-[left]"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Vertical Line */}
            <div className="w-0.5 h-full bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.6)]" />

            {/* Handle Knob */}
            <div
              id="slider-drag-handle"
              className={`absolute w-11 h-11 -ml-5.5 rounded-full bg-white text-stone-900 shadow-2xl flex items-center justify-center border-2 border-amber-400 cursor-grab active:cursor-grabbing transition-transform ${
                isDragging ? 'scale-110 shadow-amber-500/30' : 'hover:scale-105'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-stone-700">
                <span>‹</span>
                <span className="text-amber-600 font-extrabold">|</span>
                <span>›</span>
              </div>
            </div>
          </div>

          {/* Bottom Labels */}
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-stone-200 text-xs font-semibold tracking-wide border border-white/10 shadow-lg">
              Original Photo ({Math.round(sliderPosition)}%)
            </span>
          </div>
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold tracking-wide shadow-lg border border-amber-300">
              AI Makeover ({Math.round(100 - sliderPosition)}%)
            </span>
          </div>

          {/* Hint Overlay when not dragging */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none z-10 opacity-70 hover:opacity-100 transition-opacity">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-stone-300 text-[11px] font-medium flex items-center gap-1.5 border border-white/10">
              <Eye className="w-3 h-3 text-amber-400" /> Drag slider to compare space transformation
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
