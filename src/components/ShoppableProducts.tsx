import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, Check, Star, Sparkles, Tag, Layers } from 'lucide-react';
import { ShoppableProduct } from '../types';

interface ShoppableProductsProps {
  products: ShoppableProduct[];
  onAddToProject?: (product: ShoppableProduct) => void;
}

export const ShoppableProducts: React.FC<ShoppableProductsProps> = ({
  products,
  onAddToProject,
}) => {
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(new Set());

  const handleSave = (product: ShoppableProduct) => {
    setSavedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
    if (onAddToProject) {
      onAddToProject(product);
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div id="shoppable-products-section" className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              Shoppable AI Design Matches
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-900 rounded-full border border-amber-500/20">
                {products.length} Curated Items
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Sourced to match the proportions, color values, and materiality of your makeover
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((item) => {
          const isSaved = savedProductIds.has(item.id);

          return (
            <div
              key={item.id}
              id={`product-card-${item.id}`}
              className="group bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image & Match Tag */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-[11px] font-bold flex items-center gap-1 border border-amber-400/30">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {item.matchScore}% Match
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 text-[11px] font-medium shadow-xs">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-amber-800 tracking-wide uppercase text-[10px]">
                      {item.brand}
                    </span>
                    <div className="flex items-center gap-1 text-amber-600 font-medium">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-stone-400">({item.reviewCount})</span>
                    </div>
                  </div>

                  <h4 className="font-serif font-bold text-stone-900 text-sm line-clamp-1 mb-1 group-hover:text-amber-800 transition-colors">
                    {item.name}
                  </h4>

                  <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1 bg-stone-50 p-2.5 rounded-lg text-[11px] text-stone-600 mb-3 border border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-400 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Dimensions:
                      </span>
                      <span className="font-medium text-stone-700">{item.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Material:
                      </span>
                      <span className="font-medium text-stone-700">{item.material}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action footer */}
              <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-stone-100">
                <div>
                  <div className="text-base font-bold text-stone-900">
                    ${item.price.toLocaleString()}
                    {item.originalPrice && (
                      <span className="ml-1.5 text-xs text-stone-400 line-through font-normal">
                        ${item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={item.retailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                    title="View Product at Retailer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    id={`btn-add-ffe-${item.id}`}
                    type="button"
                    onClick={() => handleSave(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                      isSaved
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-stone-900 text-amber-100 hover:bg-stone-800'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to FF&E
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to FF&E
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
