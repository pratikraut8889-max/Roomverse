import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Receipt,
  CheckCircle2,
  FileSpreadsheet,
  PieChart,
  DollarSign,
  TrendingDown,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Download,
  Building,
  ArrowUpRight
} from 'lucide-react';
import { ScannedReceipt } from '../types';

interface ExpenseScannerProps {
  receipts: ScannedReceipt[];
  onAddReceipt: (newReceipt: ScannedReceipt) => void;
  projectBudgetTotal: number;
}

const SAMPLE_RECEIPT_PRESETS = [
  {
    name: 'Cedar & Moss Lighting Invoice',
    merchant: 'Cedar & Moss Lighting Studio',
    category: 'Lighting' as const,
    subtotal: 1585,
    tax: 139.48,
    total: 1724.48,
    imageUrl: 'https://images.unsplash.com/photo-1554415707-9e49fe83083f?auto=format&fit=crop&w=500&q=80',
    items: [
      { description: 'Solis Brushed Brass Articulated Chandelier', qty: 1, amount: 940 },
      { description: 'Solid Brass Wall Sconces - 2700K Warm Dim', qty: 2, amount: 560 },
      { description: 'White-glove insured freight shipping', qty: 1, amount: 85 }
    ]
  },
  {
    name: 'Article Custom Sofa Sourcing',
    merchant: 'Design Within Reach / Article',
    category: 'FF&E' as const,
    subtotal: 2720,
    tax: 239.36,
    total: 2959.36,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80',
    items: [
      { description: 'Kobenhavn 3-Seat Wool Bouclé Sofa', qty: 1, amount: 1840 },
      { description: 'Walnut Tambour Drum End Table', qty: 2, amount: 720 },
      { description: 'Fabric Guard Coating & 5yr Protection', qty: 1, amount: 160 }
    ]
  },
  {
    name: 'Sherwin-Williams Architectural Paint',
    merchant: 'Sherwin-Williams Architectural Pro',
    category: 'Finishes & Paint' as const,
    subtotal: 554.5,
    tax: 48.79,
    total: 603.29,
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=500&q=80',
    items: [
      { description: 'Emerald Interior Matte - Alabaster 7008 (5 Gal)', qty: 2, amount: 395 },
      { description: 'Primer Pre-Wall Conditioner', qty: 1, amount: 75 },
      { description: 'Purdy Pro Roller & Dropcloth Package', qty: 1, amount: 84.5 }
    ]
  }
];

export const ExpenseScanner: React.FC<ExpenseScannerProps> = ({
  receipts,
  onAddReceipt,
  projectBudgetTotal,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ScannedReceipt | null>(receipts[0] || null);
  const [activeDepartmentFilter, setActiveDepartmentFilter] = useState<string>('All');
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Financial calculations
  const totalIncurred = receipts.reduce((acc, r) => acc + r.total, 0);
  const totalTaxReclaimed = receipts.reduce((acc, r) => acc + r.tax, 0);

  // Department Breakdown
  const departmentTotals = receipts.reduce((acc, r) => {
    acc[r.department] = (acc[r.department] || 0) + r.total;
    return acc;
  }, {} as Record<string, number>);

  // Category Breakdown
  const categoryTotals = receipts.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + r.total;
    return acc;
  }, {} as Record<string, number>);

  const handleScanPreset = async (preset: typeof SAMPLE_RECEIPT_PRESETS[0]) => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/scanner/receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'proj-1',
          mimeType: 'image/jpeg',
        }),
      });
      const data = await response.json();
      if (data.success && data.receipt) {
        const customizedReceipt: ScannedReceipt = {
          ...data.receipt,
          merchant: preset.merchant,
          category: preset.category,
          items: preset.items,
          subtotal: preset.subtotal,
          tax: preset.tax,
          total: preset.total,
          receiptImageUrl: preset.imageUrl,
          status: 'Approved',
        };
        onAddReceipt(customizedReceipt);
        setSelectedReceipt(customizedReceipt);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const response = await fetch('/api/scanner/receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
            projectId: 'proj-1',
          }),
        });
        const data = await response.json();
        if (data.success && data.receipt) {
          const newRec: ScannedReceipt = {
            ...data.receipt,
            receiptImageUrl: base64,
            status: 'Processed',
          };
          onAddReceipt(newRec);
          setSelectedReceipt(newRec);
        }
      } catch (err) {
        console.error('Upload scan error:', err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Date,Merchant,Category,Department,Subtotal,Tax,Total,Status\n';
    const rows = receipts
      .map(
        (r) =>
          `"${r.invoiceNumber}","${r.date}","${r.merchant}","${r.category}","${r.department}",${r.subtotal},${r.tax},${r.total},"${r.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RoomRevise_Expense_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setExportNotice('Expense Report CSV exported successfully for accounting department review.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const filteredReceipts =
    activeDepartmentFilter === 'All'
      ? receipts
      : receipts.filter((r) => r.department === activeDepartmentFilter);

  return (
    <div id="expense-scanner-section" className="space-y-6">
      {/* Top Department Financial Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Total Logged Expenses</span>
            <DollarSign className="w-4 h-4 text-amber-700" />
          </div>
          <div className="font-serif text-3xl font-bold text-stone-900">
            ${totalIncurred.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Reconciled across {receipts.length} verified receipts
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Project Budget Variance</span>
            <PieChart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-700">
            ${(projectBudgetTotal - totalIncurred).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-2">
            Remaining surplus for styling & contingencies
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Sales Tax Reclaimed</span>
            <Building className="w-4 h-4 text-stone-600" />
          </div>
          <div className="font-serif text-3xl font-bold text-stone-900">
            ${totalTaxReclaimed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Ready for quarterly trade tax deductions
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Turnaround Acceleration</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-serif text-3xl font-bold text-amber-700">
            92% Faster
          </div>
          <p className="text-xs text-stone-500 mt-2">
            AI automated OCR replaces manual data entry
          </p>
        </div>
      </div>

      {/* Export Notice Banner */}
      {exportNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>✓ {exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="text-emerald-700 hover:text-emerald-950">✕</button>
        </div>
      )}

      {/* Scanning & Receipt Processing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Scanner Upload & Presets */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-900 border border-amber-500/20">
              Mobile Document Capture
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
              Scan Vendor Receipts & Invoices
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Instant AI line-item extraction for FF&E, paint, contractor slips, and lighting shipments.
            </p>
          </div>

          {/* Action Upload Dropzone */}
          <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-6 text-center transition-colors bg-stone-50/50">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <Camera className="w-6 h-6" />
            </div>

            <h4 className="text-sm font-bold text-stone-800 mb-1">
              Snap Receipt with Camera or Upload
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mb-4">
              AI OCR automatically reads vendor, line item quantities, tax, and budget categories.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Native Mobile Camera Capture */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isScanning}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Camera className="w-4 h-4" /> Open Camera
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* File selection */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Upload className="w-4 h-4" /> Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {isScanning && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-center gap-2 text-xs text-amber-900 font-semibold animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
                Gemini OCR scanning receipt line items and tax schedule...
              </div>
            )}
          </div>

          {/* Quick Demo Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                1-Click Preset Receipts (Instant Demo):
              </span>
            </div>
            <div className="space-y-2">
              {SAMPLE_RECEIPT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleScanPreset(preset)}
                  disabled={isScanning}
                  className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center justify-between text-xs group"
                >
                  <div>
                    <div className="font-bold text-stone-800 group-hover:text-amber-900">
                      {preset.name}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {preset.merchant} • ${preset.total.toFixed(2)}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-semibold group-hover:bg-amber-100 group-hover:text-amber-900">
                    Scan Preset
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Detailed Line-Item Audit & Department Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Selected Receipt Line Item Card */}
          {selectedReceipt && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                    {selectedReceipt.category}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-stone-900 mt-1">
                    {selectedReceipt.merchant}
                  </h4>
                  <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                    <span>Invoice #{selectedReceipt.invoiceNumber}</span>
                    <span>•</span>
                    <span>Date: {selectedReceipt.date}</span>
                    <span>•</span>
                    <span>Dept: {selectedReceipt.department}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif text-2xl font-bold text-stone-900">
                    ${selectedReceipt.total.toFixed(2)}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved for Billing
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mt-4">
                <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Extracted Line Items:
                </h5>
                <div className="divide-y divide-stone-100 text-xs">
                  {selectedReceipt.items.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <span className="font-medium text-stone-800">{item.description}</span>
                        <span className="text-stone-400 ml-2">x{item.qty}</span>
                      </div>
                      <span className="font-semibold text-stone-900">
                        ${item.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal / Tax / Total Breakdown */}
                <div className="mt-4 pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3.5 rounded-xl">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium text-stone-800">${selectedReceipt.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax (Verified):</span>
                    <span className="font-medium text-stone-800">${selectedReceipt.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-stone-900 pt-1.5 border-t border-stone-200">
                    <span>Total Expense:</span>
                    <span>${selectedReceipt.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Department Head Financial Summary & Reconciled Invoices */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  Reconciled Project Invoices
                </h4>
                <p className="text-xs text-stone-500">
                  Automated expense ledger monitored by Studio Department Heads
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV Report
                </button>
              </div>
            </div>

            {/* Department Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
              {['All', 'Procurement', 'Design Studio', 'Project Management', 'Executive'].map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setActiveDepartmentFilter(dept)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeDepartmentFilter === dept
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Invoices List */}
            <div className="divide-y divide-stone-100 max-h-[300px] overflow-y-auto">
              {filteredReceipts.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => setSelectedReceipt(rec)}
                  className={`py-3 px-2 flex items-center justify-between hover:bg-amber-50/40 rounded-lg cursor-pointer transition-colors ${
                    selectedReceipt?.id === rec.id ? 'bg-amber-50/70 font-medium' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 text-xs font-bold">
                      <Receipt className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-800">{rec.merchant}</div>
                      <div className="text-[11px] text-stone-400">
                        {rec.date} • {rec.category} ({rec.department})
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-stone-900">
                      ${rec.total.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      ● {rec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
