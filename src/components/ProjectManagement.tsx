import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  DollarSign,
  TrendingUp,
  UserCheck,
  FileText,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { DesignProject, ProjectMilestone } from '../types';

interface ProjectManagementProps {
  project: DesignProject;
  onUpdateProject: (updated: DesignProject) => void;
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({
  project,
  onUpdateProject,
}) => {
  const [showAddMilestone, setShowAddMilestone] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAssignee, setNewAssignee] = useState('Elena Rostova (Senior Designer)');

  const totalBudget = project.budgetTotal;
  const spentBudget = project.budgetSpent;
  const remainingBudget = totalBudget - spentBudget;
  const spentPercentage = Math.round((spentBudget / totalBudget) * 100);

  const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length;
  const overallProgress = Math.round(
    project.milestones.reduce((acc, m) => acc + m.progress, 0) / (project.milestones.length || 1)
  );

  const handleToggleMilestone = (milestoneId: string) => {
    const updated = {
      ...project,
      milestones: project.milestones.map((m) => {
        if (m.id === milestoneId) {
          const nextStatus: 'completed' | 'in-progress' = m.status === 'completed' ? 'in-progress' : 'completed';
          return {
            ...m,
            status: nextStatus,
            progress: nextStatus === 'completed' ? 100 : 50,
          };
        }
        return m;
      }),
    };
    onUpdateProject(updated);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newM: ProjectMilestone = {
      id: `m-${Date.now()}`,
      title: newTitle.trim(),
      description: 'Newly defined studio milestone for delivery schedule.',
      dueDate: newDueDate || '2026-11-01',
      status: 'upcoming',
      progress: 0,
      assignedTo: newAssignee,
      deliverables: ['Milestone Documentation', 'Sign-off Sheet']
    };

    onUpdateProject({
      ...project,
      milestones: [...project.milestones, newM],
    });

    setNewTitle('');
    setNewDueDate('');
    setShowAddMilestone(false);
  };

  return (
    <div id="project-management-section" className="space-y-6">
      {/* Top Banner & Budget Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Project Health / Milestone Progress */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Overall Completion
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif text-3xl font-bold text-stone-900">
              {overallProgress}%
            </span>
            <span className="text-xs text-stone-500 font-medium">
              ({completedMilestones}/{project.milestones.length} Milestones)
            </span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Total Budget Target */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Allocated Budget
          </span>
          <div className="font-serif text-3xl font-bold text-stone-900 mt-1">
            ${totalBudget.toLocaleString()}
          </div>
          <span className="text-xs text-stone-500 mt-2 block">
            Approved client project ceiling
          </span>
        </div>

        {/* Spent to Date */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Incurred Expenses
          </span>
          <div className="font-serif text-3xl font-bold text-stone-900 mt-1">
            ${spentBudget.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{spentPercentage}% of total committed</span>
          </div>
        </div>

        {/* Contingency Buffer */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Remaining Buffer
          </span>
          <div className="font-serif text-3xl font-bold text-emerald-700 mt-1">
            ${remainingBudget.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-600 mt-2 block font-medium">
            On track — Healthy financial variance
          </span>
        </div>
      </div>

      {/* Main Milestones & Timelines List */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Project Timelines & Phased Milestones
            </h3>
            <p className="text-xs text-stone-500">
              Track turnarounds from AI conceptualization to final contractor handover and procurement.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMilestone(!showAddMilestone)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Studio Milestone
          </button>
        </div>

        {/* Add Milestone Inline Drawer */}
        {showAddMilestone && (
          <form
            onSubmit={handleAddMilestone}
            className="p-4.5 mb-6 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Milestone Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Custom Millwork Elevation Review"
                required
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Assigned Team Lead
              </label>
              <select
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              >
                <option value="Elena Rostova (Senior Designer)">Elena Rostova (Senior Designer)</option>
                <option value="Marcus Reed (Lead Spatialist)">Marcus Reed (Lead Spatialist)</option>
                <option value="Tanya Chen (Procurement Head)">Tanya Chen (Procurement Head)</option>
                <option value="Client Approval Review">Client Approval Review</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 mt-1">
              <button
                type="button"
                onClick={() => setShowAddMilestone(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg"
              >
                Save Milestone
              </button>
            </div>
          </form>
        )}

        {/* Milestone Steps Timeline */}
        <div className="space-y-4">
          {project.milestones.map((m, index) => {
            const isCompleted = m.status === 'completed';
            const isInProgress = m.status === 'in-progress';

            return (
              <div
                key={m.id}
                id={`milestone-${m.id}`}
                className={`p-5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isInProgress
                    ? 'border-amber-400 bg-amber-50/30 shadow-xs'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : isInProgress
                          ? 'bg-amber-500 text-stone-950 hover:bg-amber-600'
                          : 'bg-stone-100 text-stone-400 hover:bg-stone-200 border border-stone-300'
                      }`}
                      title="Click to toggle completion"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </button>

                    <div>
                      <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                        {m.title}
                        {isInProgress && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-900 border border-amber-500/30">
                            Active Phase
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0 self-start sm:self-center">
                    <div className="text-right">
                      <div className="font-semibold text-stone-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        Due {m.dueDate}
                      </div>
                      <span className="text-stone-400 text-[11px]">{m.assignedTo}</span>
                    </div>

                    <div className="w-20 text-right">
                      <span className="font-bold text-stone-900">{m.progress}%</span>
                    </div>
                  </div>
                </div>

                {/* Deliverables tags */}
                {m.deliverables && m.deliverables.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase text-stone-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Deliverables:
                    </span>
                    {m.deliverables.map((del, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-2 py-0.5 rounded bg-white text-stone-700 text-[11px] font-medium border border-stone-200 shadow-2xs"
                      >
                        ✓ {del}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
