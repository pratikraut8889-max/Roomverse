import React, { useState } from 'react';
import {
  MessageSquare,
  Pin,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Layers,
  FileCheck,
  AlertCircle,
  Eye,
  Download,
  Share2,
  Plus
} from 'lucide-react';
import { DesignProject, AnnotationPin } from '../types';

interface CollaborativeDashboardProps {
  project: DesignProject;
  onUpdateProject: (updated: DesignProject) => void;
  activeRole: 'Designer' | 'Client' | 'Department Head';
  onChangeRole: (role: 'Designer' | 'Client' | 'Department Head') => void;
}

export const CollaborativeDashboard: React.FC<CollaborativeDashboardProps> = ({
  project,
  onUpdateProject,
  activeRole,
  onChangeRole,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string>(project.currentVersion || 'v2.2');
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [isAddingPin, setIsAddingPin] = useState<boolean>(false);
  const [newPinCoords, setNewPinCoords] = useState<{ x: number; y: number } | null>(null);
  const [newPinText, setNewPinText] = useState<string>('');
  const [newPinTag, setNewPinTag] = useState<AnnotationPin['tag']>('Furniture');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const currentVersionData =
    project.versions.find((v) => v.version === selectedVersion) || project.versions[project.versions.length - 1];

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingPin) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setNewPinCoords({ x, y });
  };

  const handleSavePin = () => {
    if (!newPinCoords || !newPinText.trim()) return;

    const newPin: AnnotationPin = {
      id: `pin-${Date.now()}`,
      xPercent: newPinCoords.x,
      yPercent: newPinCoords.y,
      author: activeRole === 'Client' ? project.clientName : 'Elena Rostova',
      role: activeRole,
      comment: newPinText.trim(),
      timestamp: 'Just now',
      resolved: false,
      tag: newPinTag,
    };

    const updated = {
      ...project,
      annotations: [newPin, ...project.annotations],
    };

    onUpdateProject(updated);
    setIsAddingPin(false);
    setNewPinCoords(null);
    setNewPinText('');
    setActivePinId(newPin.id);
  };

  const handleToggleResolve = (pinId: string) => {
    const updated = {
      ...project,
      annotations: project.annotations.map((pin) =>
        pin.id === pinId ? { ...pin, resolved: !pin.resolved } : pin
      ),
    };
    onUpdateProject(updated);
  };

  const handleStatusChange = (status: DesignProject['status']) => {
    onUpdateProject({
      ...project,
      status,
    });
  };

  return (
    <div id="collaborative-dashboard-container" className="space-y-6">
      {/* Top Header & Role Switcher */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-900 border border-amber-500/20">
              Live Revision Studio
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs font-medium text-stone-500">
              Project: {project.title}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Real-Time Design Review & Client Annotations
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Click directly onto the visual render to pin revision notes, specify material changes, or approve milestone mockups.
          </p>
        </div>

        {/* Action Controls & Role Simulator */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200 text-xs">
            <span className="px-2 font-medium text-stone-500">Viewing as:</span>
            {(['Designer', 'Client', 'Department Head'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onChangeRole(role)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeRole === role
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Client Dossier
          </button>
        </div>
      </div>

      {/* Main Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Visual Canvas with interactive pins */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
          {/* Version Selector Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                Revision Versions:
              </span>
              <div className="flex items-center gap-1.5">
                {project.versions.map((ver) => (
                  <button
                    key={ver.version}
                    type="button"
                    onClick={() => setSelectedVersion(ver.version)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedVersion === ver.version
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {ver.version}
                  </button>
                ))}
              </div>
            </div>

            {/* Pin Dropping Toggle */}
            <button
              id="btn-toggle-add-pin"
              type="button"
              onClick={() => {
                setIsAddingPin(!isAddingPin);
                setNewPinCoords(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isAddingPin
                  ? 'bg-amber-500 text-stone-950 font-bold ring-2 ring-amber-400'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
              {isAddingPin ? 'Click Image to Place Pin' : 'Drop Revision Pin'}
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div
            id="collaborative-canvas"
            onClick={handleImageClick}
            className={`relative rounded-xl overflow-hidden aspect-[16/10] bg-stone-900 select-none ${
              isAddingPin ? 'cursor-crosshair ring-2 ring-amber-500' : 'cursor-default'
            }`}
          >
            <img
              src={currentVersionData?.imageUrl || project.activeImageUrl}
              alt="Design Version Render"
              className="w-full h-full object-cover pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Hint when in pin-dropping mode */}
            {isAddingPin && !newPinCoords && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-stone-900/90 backdrop-blur-md text-amber-300 text-xs font-semibold shadow-xl border border-amber-400/40 pointer-events-none animate-pulse">
                Click anywhere on the room image to attach your comment
              </div>
            )}

            {/* Render Existing Pins */}
            {project.annotations.map((pin, index) => {
              const isActive = activePinId === pin.id;

              return (
                <div
                  key={pin.id}
                  style={{
                    left: `${pin.xPercent}%`,
                    top: `${pin.yPercent}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePinId(isActive ? null : pin.id);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xl transition-transform ${
                      pin.resolved
                        ? 'bg-emerald-600 text-white border-2 border-white'
                        : isActive
                        ? 'bg-amber-500 text-stone-950 scale-125 ring-4 ring-amber-400/40 border-2 border-stone-950'
                        : 'bg-stone-950 text-amber-300 border-2 border-amber-400 hover:scale-110'
                    }`}
                  >
                    {pin.resolved ? '✓' : index + 1}
                  </div>

                  {/* Hover Tag Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block pointer-events-none z-30">
                    <span className="px-2 py-1 rounded bg-stone-950 text-white text-[10px] whitespace-nowrap shadow-md">
                      {pin.author} ({pin.tag || 'Note'})
                    </span>
                  </div>
                </div>
              );
            })}

            {/* New Pin Temporary Marker & Form */}
            {newPinCoords && (
              <div
                style={{
                  left: `${newPinCoords.x}%`,
                  top: `${newPinCoords.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xl border-2 border-white animate-bounce">
                  <Plus className="w-5 h-5" />
                </div>

                {/* Popup Input Card */}
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-stone-300 p-3.5 z-40 text-stone-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Add Design Revision Note
                    </span>
                    <select
                      value={newPinTag}
                      onChange={(e) => setNewPinTag(e.target.value as any)}
                      className="text-[11px] px-2 py-0.5 rounded border border-stone-200 bg-stone-50 font-medium"
                    >
                      <option value="Furniture">Furniture</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Color">Color / Finish</option>
                      <option value="Flooring">Flooring</option>
                      <option value="Dimension">Dimensions</option>
                    </select>
                  </div>

                  <textarea
                    value={newPinText}
                    onChange={(e) => setNewPinText(e.target.value)}
                    placeholder="e.g. 'Can we verify if this fabric has stain guard treatment for pets?'"
                    rows={3}
                    autoFocus
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:border-amber-500 mb-2"
                  />

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setNewPinCoords(null)}
                      className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                    <button
                      id="btn-save-annotation-pin"
                      type="button"
                      onClick={handleSavePin}
                      disabled={!newPinText.trim()}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-40"
                    >
                      Post Note
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current Version Detail Caption */}
          <div className="flex items-center justify-between px-2 pt-1 text-xs text-stone-500">
            <div>
              <span className="font-semibold text-stone-800">{currentVersionData?.label}</span>
              <span className="mx-2">•</span>
              <span>Rendered on {currentVersionData?.createdAt}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-700 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Style: {currentVersionData?.style}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Annotation Thread & Status Approvals */}
        <div className="lg:col-span-4 space-y-4">
          {/* Client Sign-off Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4.5 shadow-xs">
            <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
              Client Design Sign-Off
            </h3>
            <p className="text-xs text-stone-500 mb-3.5">
              Current Project Status: <strong className="text-amber-800">{project.status}</strong>
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleStatusChange('Approved')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                  project.status === 'Approved'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {project.status === 'Approved' ? 'Client Approved (Locked)' : 'Sign-off & Approve Design'}
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Review')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  project.status === 'Review'
                    ? 'bg-amber-500 text-stone-950 font-extrabold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                Request Architectural Revision
              </button>
            </div>
          </div>

          {/* Annotation Notes Feed */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4.5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-700" />
                Pin Comments ({project.annotations.length})
              </h3>
              <span className="text-[11px] text-stone-400">
                {project.annotations.filter((a) => a.resolved).length} Resolved
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {project.annotations.map((pin, idx) => {
                const isSelected = activePinId === pin.id;

                return (
                  <div
                    key={pin.id}
                    onClick={() => setActivePinId(pin.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                        : pin.resolved
                        ? 'border-stone-200 bg-stone-50/70 opacity-70'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-xs text-stone-900">
                          {pin.author}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-stone-100 text-stone-600 font-medium">
                          {pin.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400">{pin.timestamp}</span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed mb-2">
                      {pin.comment}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                      {pin.tag && (
                        <span className="text-amber-800 font-medium text-[10px]">
                          #{pin.tag}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleResolve(pin.id);
                        }}
                        className={`text-xs font-semibold flex items-center gap-1 ${
                          pin.resolved
                            ? 'text-emerald-700 hover:text-emerald-900'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {pin.resolved ? 'Resolved' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {project.annotations.length === 0 && (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No annotation pins yet. Click "Drop Revision Pin" above to add comments directly on the design.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Export Dossier Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
              Export Client Presentation Dossier
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Generated dossier includes the 4K AI Reimagined concept render, Before/After spatial overlay, approved FF&E specification schedule, and client sign-off audit log.
            </p>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-stone-500">Project:</span>
                <span className="font-semibold text-stone-800">{project.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Client:</span>
                <span className="font-semibold text-stone-800">{project.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Active Version:</span>
                <span className="font-semibold text-stone-800">{selectedVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Sign-off Status:</span>
                <span className="font-bold text-emerald-700">{project.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Dossier for ${project.title} has been prepared for print & client PDF download.`);
                  setShowExportModal(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF Pack
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
