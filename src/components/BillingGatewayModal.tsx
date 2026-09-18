import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  Calendar,
  Zap,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/mockData';

interface BillingGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId: string;
  onPlanUpdated: (newPlanId: string, interval: 'monthly' | 'annual') => void;
}

export const BillingGatewayModal: React.FC<BillingGatewayModalProps> = ({
  isOpen,
  onClose,
  currentPlanId,
  onPlanUpdated,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(currentPlanId || 'pro');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Form states
  const [cardName, setCardName] = useState('Julian Vance Studio');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('883');
  const [zipCode, setZipCode] = useState('10013');

  if (!isOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];
  const activePrice = billingInterval === 'annual' ? currentPlan.annualPrice : currentPlan.monthlyPrice;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          interval: billingInterval,
          cardholderName: cardName,
          cardLast4: cardNumber.replace(/\D/g, '').slice(-4) || '4242',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
        onPlanUpdated(selectedPlanId, billingInterval);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2500);
      }
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Subscription Activated Successfully!
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Your design studio now has unlimited access to the <strong>{currentPlan.name}</strong> tier with priority AI rendering pipeline and multi-client collaboration.
            </p>
            <div className="pt-2 text-xs text-stone-400">
              A recurring VAT tax invoice has been sent to your registered billing email.
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center max-w-lg mx-auto mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-900 border border-amber-500/20">
                RoomRevise Studio Subscription
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                Scale Your Interior Design Operations
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Accelerate turnarounds, impress clients with real-time AI styling, and manage firm expenses effortlessly.
              </p>

              {/* Cadence Toggle */}
              <div className="mt-4 inline-flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setBillingInterval('monthly')}
                  className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                    billingInterval === 'monthly'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval('annual')}
                  className={`px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    billingInterval === 'annual'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="px-1.5 py-0.2 bg-amber-200 text-stone-900 rounded-md text-[10px] font-bold">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const price = billingInterval === 'annual' ? plan.annualPrice : plan.monthlyPrice;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/40 ring-2 ring-amber-500/30 shadow-md'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 text-[10px] font-bold tracking-wider uppercase shadow-xs">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-sm">{plan.name}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{plan.tagline}</p>

                      <div className="my-3">
                        <span className="font-serif text-2xl font-bold text-stone-900">${price}</span>
                        <span className="text-xs text-stone-400">/month</span>
                      </div>

                      <ul className="space-y-1.5 text-[11px] text-stone-600 mb-3">
                        {plan.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className={`w-full py-1.5 text-center text-xs font-semibold rounded-lg ${
                        isSelected
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Choose Plan'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Secure Payment Gateway Checkout Form */}
            <form onSubmit={handleCheckout} className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200/80">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    256-Bit Encrypted Payment Gateway
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <CreditCard className="w-4 h-4 text-stone-400" />
                  <span>Visa, Mastercard, Amex, Apple Pay</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Cardholder Name / Studio</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-mono font-medium text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Expires (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">CVC Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Billing ZIP</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-stone-500">
                  Total Due Today:{' '}
                  <strong className="text-sm font-bold text-stone-900">
                    ${billingInterval === 'annual' ? activePrice * 12 : activePrice}
                  </strong>{' '}
                  <span className="text-[11px] text-stone-400">
                    ({billingInterval === 'annual' ? 'billed annually' : 'billed monthly'})
                  </span>
                </div>

                <button
                  id="btn-submit-payment"
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Authorizing Gateway...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Activate Subscription</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
