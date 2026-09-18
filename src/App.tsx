import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RoomMakeoverStudio } from './components/RoomMakeoverStudio';
import { CollaborativeDashboard } from './components/CollaborativeDashboard';
import { ProjectManagement } from './components/ProjectManagement';
import { ExpenseScanner } from './components/ExpenseScanner';
import { BillingGatewayModal } from './components/BillingGatewayModal';
import { INITIAL_PROJECTS, INITIAL_RECEIPTS, SUBSCRIPTION_PLANS } from './data/mockData';
import { DesignProject, ScannedReceipt } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'collaboration' | 'projects' | 'expenses'>('studio');
  const [projects, setProjects] = useState<DesignProject[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [receipts, setReceipts] = useState<ScannedReceipt[]>(INITIAL_RECEIPTS);
  const [activeRole, setActiveRole] = useState<'Designer' | 'Client' | 'Department Head'>('Designer');
  const [activePlanId, setActivePlanId] = useState<string>('pro');
  const [isBillingOpen, setIsBillingOpen] = useState<boolean>(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activePlan = SUBSCRIPTION_PLANS.find((p) => p.id === activePlanId) || SUBSCRIPTION_PLANS[1];

  const handleUpdateProject = (updated: DesignProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddReceipt = (newReceipt: ScannedReceipt) => {
    setReceipts((prev) => [newReceipt, ...prev]);
    // Also increment budget spent on active project
    const updatedSpent = activeProject.budgetSpent + newReceipt.total;
    handleUpdateProject({
      ...activeProject,
      budgetSpent: updatedSpent,
    });
  };

  const handlePlanUpdated = (newPlanId: string) => {
    setActivePlanId(newPlanId);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        activePlanName={activePlan.name}
        onOpenBilling={() => setIsBillingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'studio' && (
          <RoomMakeoverStudio
            activeProject={activeProject}
            onUpdateProject={handleUpdateProject}
            onNavigateToCollaboration={() => setActiveTab('collaboration')}
          />
        )}

        {activeTab === 'collaboration' && (
          <CollaborativeDashboard
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            activeRole={activeRole}
            onChangeRole={setActiveRole}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectManagement
            project={activeProject}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseScanner
            receipts={receipts}
            onAddReceipt={handleAddReceipt}
            projectBudgetTotal={activeProject.budgetTotal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-900">RoomRevise™</span>
            <span>— AI Interior Design Consultant & SaaS Platform</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>SOC-2 & PCI-DSS Compliant</span>
            <span>•</span>
            <span>Gemini Vision AI Engine</span>
            <span>•</span>
            <button
              onClick={() => setIsBillingOpen(true)}
              className="text-amber-800 hover:text-amber-950 font-medium underline"
            >
              Subscription Billing
            </button>
          </div>
        </div>
      </footer>

      {/* Recurring Billing & Payment Gateway Modal */}
      <BillingGatewayModal
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        currentPlanId={activePlanId}
        onPlanUpdated={handlePlanUpdated}
      />
    </div>
  );
}
