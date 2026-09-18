import React from 'react';
import { Sparkles, Check, ChevronRight } from 'lucide-react';
import { StyleOption } from '../types';

interface StyleCarouselProps {
  styles: StyleOption[];
  selectedStyleId: string;
  onSelectStyle: (style: StyleOption) => void;
  isGenerating?: boolean;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({
  styles,
  selectedStyleId,
  onSelectStyle,
  isGenerating = false,
}) => {
  return (
    <div id="style-carousel-container" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase text-stone-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Select Reimagined Architectural Style
          </h3>
          <p className="text-xs text-stone-500">
            Choose an aesthetic profile for AI to generate materials, lighting, and layout
          </p>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-200 focus:outline-none">
        {styles.map((style) => {
          const isSelected = style.id === selectedStyleId;

          return (
            <button
              key={style.id}
              id={`style-card-${style.id}`}
              type="button"
              onClick={() => onSelectStyle(style)}
              disabled={isGenerating}
              className={`flex-shrink-0 w-64 text-left rounded-xl border transition-all duration-200 overflow-hidden relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/50 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-sm'
              }`}
            >
              {/* Thumbnail image */}
              <div className="relative h-28 w-full overflow-hidden bg-stone-100">
                <img
                  src={style.thumbnail}
                  alt={style.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate drop-shadow-sm">
                    {style.vibe}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>

              {/* Card info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1 leading-tight">
                    {style.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-2.5">
                    {style.subtitle}
                  </p>
                </div>

                <div>
                  {/* Color Palette Swatches */}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 mr-1">
                      Palette:
                    </span>
                    {style.palette.slice(0, 4).map((hex, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>

                  {/* Key Element Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] text-stone-600">
                    <span className="truncate max-w-[170px] font-medium text-stone-700">
                      • {style.keyElements[0]}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
