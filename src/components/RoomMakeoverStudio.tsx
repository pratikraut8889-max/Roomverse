import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  RefreshCw,
  Layers,
  Palette,
  Compass,
  Lightbulb,
  CheckCircle2,
  Share2,
  BookmarkPlus
} from 'lucide-react';
import { CompareSlider } from './CompareSlider';
import { StyleCarousel } from './StyleCarousel';
import { DesignRefineChat } from './DesignRefineChat';
import { ShoppableProducts } from './ShoppableProducts';
import { StyleOption, ShoppableProduct, DesignRevisionMessage, DesignProject } from '../types';
import { STYLE_CATALOG, SAMPLE_ROOMS, INITIAL_SHOPPABLE_PRODUCTS } from '../data/mockData';

interface RoomMakeoverStudioProps {
  activeProject: DesignProject;
  onUpdateProject: (updated: DesignProject) => void;
  onNavigateToCollaboration: () => void;
}

export const RoomMakeoverStudio: React.FC<RoomMakeoverStudioProps> = ({
  activeProject,
  onUpdateProject,
  onNavigateToCollaboration,
}) => {
  const [selectedSampleRoomId, setSelectedSampleRoomId] = useState<string>(SAMPLE_ROOMS[0].id);
  const [originalImage, setOriginalImage] = useState<string>(
    activeProject.originalImageUrl || SAMPLE_ROOMS[0].originalImage
  );
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(STYLE_CATALOG[0]);
  const [activeReimaginedImage, setActiveReimaginedImage] = useState<string>(
    activeProject.activeImageUrl || SAMPLE_ROOMS[0].styles['mid-century']
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Chat conversation history
  const [messages, setMessages] = useState<DesignRevisionMessage[]>([
    {
      id: 'initial-greeting',
      sender: 'assistant',
      timestamp: '10:00 AM',
      text: `Welcome to the RoomRevise AI Studio. I've initialized the ${selectedStyle.name} spatial makeover for this space.

The layout emphasizes generous sightlines, 2700K warm layered illumination, and textural bouclé/walnut contrast. How would you like to refine the architectural finishes or furnishings?`,
      suggestedChanges: [
        'Curated 2700K dimmable brass pendant lighting above seating island',
        'Substituted cold commercial drywall with warm alabaster lime-wash finish',
        'Introduced organic fluted coffee table with rounded safety corners'
      ],
      shoppableProducts: INITIAL_SHOPPABLE_PRODUCTS.slice(0, 3),
      updatedStyleSummary: {
        colorUpdate: 'Teak, Olive & Brass accents',
        lightingUpdate: 'Warm 2700K ambient glow',
        furnitureUpdate: '3 verified trade items ready for FF&E'
      }
    }
  ]);

  // Handle uploading custom photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setOriginalImage(result);
      // Trigger AI generation on uploaded photo
      triggerReimagine(result, selectedStyle);
    };
    reader.readAsDataURL(file);
  };

  // Switch sample room preset
  const handleSelectSampleRoom = (room: typeof SAMPLE_ROOMS[0]) => {
    setSelectedSampleRoomId(room.id);
    setOriginalImage(room.originalImage);
    const styleKey = (selectedStyle.id in room.styles) ? (selectedStyle.id as keyof typeof room.styles) : 'mid-century';
    const styledImage = room.styles[styleKey] || room.styles['mid-century'];
    setActiveReimaginedImage(styledImage);
  };

  // Generate / switch style
  const triggerReimagine = async (imgUrl: string, targetStyle: StyleOption) => {
    setIsGenerating(true);
    setSelectedStyle(targetStyle);

    try {
      const response = await fetch('/api/room/reimagine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleId: targetStyle.id,
          styleName: targetStyle.name,
          roomType: 'Living Space',
          originalImageUrl: imgUrl,
          imageBase64: imgUrl.startsWith('data:') ? imgUrl : undefined,
        }),
      });

      const data = await response.json();

      // Find matching preset image for the active room or use fallback
      const currentRoom = SAMPLE_ROOMS.find((r) => r.id === selectedSampleRoomId) || SAMPLE_ROOMS[0];
      const targetStyleKey = (targetStyle.id in currentRoom.styles)
        ? (targetStyle.id as keyof typeof currentRoom.styles)
        : 'mid-century';
      const styledImg = currentRoom.styles[targetStyleKey] || targetStyle.thumbnail;
      setActiveReimaginedImage(styledImg);

      // Add assistant response to chat thread
      if (data.analysis) {
        const newMsg: DesignRevisionMessage = {
          id: `reimagine-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.analysis.summary || `Rendered new makeover in ${targetStyle.name} aesthetic.`,
          suggestedChanges: data.analysis.architecturalEdits || targetStyle.keyElements,
          shoppableProducts: INITIAL_SHOPPABLE_PRODUCTS.slice(1, 4),
          updatedStyleSummary: {
            colorUpdate: targetStyle.palette.slice(0, 3).join(', '),
            lightingUpdate: data.analysis.lightingConcept || targetStyle.lighting,
          }
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (err) {
      console.error('Reimagine error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Context-aware chat refinement
  const handleSendMessage = async (text: string) => {
    // Append user message
    const userMsg: DesignRevisionMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/room/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          styleName: selectedStyle.name,
          currentImageUrl: activeReimaginedImage,
          history: [...messages, userMsg],
        }),
      });
      const data = await response.json();

      const assistantMsg: DesignRevisionMessage = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.text || "I've refined the design parameters according to your specifications.",
        suggestedChanges: data.suggestedChanges || [],
        shoppableProducts: data.shoppableProducts || [],
        updatedStyleSummary: data.updatedStyleSummary,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Refinement error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save current makeover to project version
  const handleSaveVersion = () => {
    const nextVerNumber = `v${(activeProject.versions.length + 1).toFixed(1)}`;
    const newVersion = {
      version: nextVerNumber,
      label: `${selectedStyle.name} Revision`,
      style: selectedStyle.name,
      imageUrl: activeReimaginedImage,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated: DesignProject = {
      ...activeProject,
      activeImageUrl: activeReimaginedImage,
      activeStyle: selectedStyle.name,
      currentVersion: nextVerNumber,
      versions: [...activeProject.versions, newVersion],
    };

    onUpdateProject(updated);
    setSaveToast(`Saved current design as ${nextVerNumber} for client review.`);
    setTimeout(() => setSaveToast(null), 4000);
  };

  return (
    <div id="room-makeover-studio" className="space-y-8">
      {/* Toast alert */}
      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
          <button
            onClick={onNavigateToCollaboration}
            className="underline hover:text-amber-200 text-xs font-bold"
          >
            Open Client Collaboration Board →
          </button>
        </div>
      )}

      {/* Top Controls: Upload or Select Preset Space */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-900 border border-amber-500/20">
              Interactive AI Makeover
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs font-medium text-stone-500">
              {activeProject.title}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Spatial Reimagining & Compare Slider
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Upload a photo of your existing space or test with preset rooms. Drag the slider to review the AI transformation.
          </p>
        </div>

        {/* Action Buttons: Upload & Save Version */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Upload Button */}
          <label className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold flex items-center gap-2 shadow-2xs cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-amber-700" />
            <span>Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>

          {/* Save to Project Version */}
          <button
            id="btn-save-design-version"
            type="button"
            onClick={handleSaveVersion}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Save to Client Version</span>
          </button>
        </div>
      </div>

      {/* Preset Spaces Selector Bar */}
      <div className="bg-stone-100/80 p-3 rounded-2xl border border-stone-200/80 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 shrink-0 pl-1">
          Sample Rooms:
        </span>
        {SAMPLE_ROOMS.map((room) => {
          const isSelected = room.id === selectedSampleRoomId;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => handleSelectSampleRoom(room)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-stone-900 text-amber-300 shadow-xs border border-stone-950'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{room.name}</span>
            </button>
          );
        })}
      </div>

      {/* Style Carousel Selector */}
      <StyleCarousel
        styles={STYLE_CATALOG}
        selectedStyleId={selectedStyle.id}
        onSelectStyle={(style) => triggerReimagine(originalImage, style)}
        isGenerating={isGenerating}
      />

      {/* Visualization Canvas: Interactive Before & After Compare Slider */}
      <div className="space-y-3">
        <CompareSlider
          originalImage={originalImage}
          reimaginedImage={activeReimaginedImage}
          styleName={selectedStyle.name}
          roomType={activeProject.roomType}
        />

        {/* Architectural Palette & Material Specs Bar */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-stone-700 uppercase tracking-wider">
              Harmonized Palette:
            </span>
            <div className="flex items-center gap-2">
              {selectedStyle.palette.map((hex, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-stone-300 shadow-xs"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="font-mono text-[11px] text-stone-600">{hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span className="flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              {selectedStyle.lighting}
            </span>
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-stone-600" />
              {selectedStyle.vibe}
            </span>
          </div>
        </div>
      </div>

      {/* Context-Aware Design Refinement Chat & Shoppable Links (Directly Below Visualization) */}
      <DesignRefineChat
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isGenerating}
        activeStyleName={selectedStyle.name}
        onAddToProject={(item) => {
          setSaveToast(`Added "${item.name}" to Project FF&E schedule.`);
          setTimeout(() => setSaveToast(null), 3500);
        }}
      />
    </div>
  );
};
