"use client";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";
import SignupContext from "../../../Context/ClientSide/SignUp/SignupContext"; 

const Check = () => (
  <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4 shrink-0">
    <path
      d="M7.5 13.3 3.9 9.7l-1.4 1.4 5 5 10-10-1.4-1.4-8.6 8.6z"
      fill="currentColor"
    />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4 shrink-0">
    <path
      d="M5.7 4.3 4.3 5.7 8.6 10l-4.3 4.3 1.4 1.4L10 11.4l4.3 4.3 1.4-1.4L11.4 10l4.3-4.3-1.4-1.4L10 8.6 5.7 4.3z"
      fill="currentColor"
    />
  </svg>
);

const Divider = () => <div className="my-3 h-px w-full bg-white/10" />;

function Feature({ label, enabled }) {
  return (
    <li
      className={
        "flex items-start gap-3 text-sm leading-6 " +
        (enabled ? "text-white" : "text-white/50")
      }
    >
      <span
        className={
          "mt-1 inline-flex h-5 w-5 items-center justify-center rounded " +
          (enabled
            ? "bg-emerald-400/20 text-emerald-400 ring-1 ring-inset ring-emerald-400/30"
            : "bg-white/5 text-white/60 ring-1 ring-inset ring-white/10")
        }
      >
        {enabled ? <Check /> : <Cross />}
      </span>
      <span>{label}</span>
    </li>
  );
}

function PlanCard({ tone, name, price, billedCopy, cta, features, planId, handlePlan }) {
  const isPlusPlan = name === "Plus";
  const isPremiumPlan = name === "Premium";
  
  return (
    <div
      className="rounded-2xl border border-gray-100 bg-gradient-to-b p-2 shadow-2xl shadow-black/40 md:p-7"
      style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,.7)" }}
    >
      <div className="rounded-2xl min-h-[700px] bg-[#03232B] p-4 ring-1 ring-white/10">
        <div className="mb-5 flex items-start justify-between">
          <div className="w-full">
            <div className="text-sm font-medium uppercase tracking-wide text-white/80">
              {name}
            </div>
            <div className="mt-2 flex items-end gap-1">
              <div className="text-3xl font-semibold text-white sm:text-4xl">
                {price}
              </div>
              <div className="pb-1 text-sm text-white/70">/year</div>
            </div>
            <div className="mt-1 text-xs text-white/70">{billedCopy}</div>
            
            {isPlusPlan && (
              <div className="mt-3 space-y-2">
                <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-3 py-2 text-sm font-bold text-white shadow-lg">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Up to 5 Drivers
                </div>
                <div className="inline-block rounded-md bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30">
                  + $25 per additional driver
                </div>
              </div>
            )}
            
            {isPremiumPlan && (
              <div className="mt-3">
                <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2 text-sm font-bold text-white shadow-lg">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Unlimited Drivers
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => handlePlan(planId)}
          className="mt-2 w-full rounded-md bg-white px-2 py-2 text-sm font-medium text-gray-900 shadow-md transition hover:translate-y-[-4px] hover:shadow"
        >
          {cta}
        </button>

        <ul className="mt-6 space-y-2">
          {features.map((f, idx) => {
            if (f === "divider") return <Divider key={idx} />;
            const item = typeof f === "string" ? { label: f, enabled: true } : f;
            return <Feature key={idx} label={item.label} enabled={item.enabled} />;
          })}
        </ul>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const { t, locale } = useTranslation();
  const { setSelectedPlan } = useContext(SignupContext);
  const navigate = useNavigate();

 
  const handlePlan = (planId) => {
    setSelectedPlan(planId);
    navigate("/signup");
  };

  const essentialFeatures = [
    { label: "NON-DOT Account", enabled: true },
    { label: "Occupation Health Service Plan", enabled: true },
    { label: "Drug Account Only", enabled: true },
    { label: "For All Employees", enabled: true },
    { label: "$75 Per Drug Test", enabled: true },
    { label: "$65 Per Alcohol Test", enabled: true },
    { label: "Online 24/7 Access", enabled: true },
    { label: "Access to 20,000 labs Nationwide", enabled: true },
  ];

  const plusFeatures = [
    { label: "1 Year Random Enrollment", enabled: true },
    { label: "DOT Random Drug & Alcohol Testing Program", enabled: true },
    "divider",
    { label: "✓ Up to 5 Drivers Included", enabled: true },
    { label: "+ $25 per additional driver", enabled: true },
    "divider",
    { label: "DOT Random Enrollment", enabled: true },
    { label: "Random Enrollment Certificate", enabled: true },
    { label: "For DOT Regulated Companies", enabled: true },
    { label: "Mixed Large Pool", enabled: true },
    { label: "Eligible for Individual Pool", enabled: true },
    { label: "Access to 50,000+ Labs Nationwide", enabled: true },
    { label: "DOT Drug Test $79", enabled: true },
    { label: "Alcohol Test $65", enabled: true },
    { label: "Dedicated Account Manager", enabled: true },
    { label: "DOT Safety Audit Support", enabled: true },
    { label: "24/7 Online Access", enabled: true },
  ];

  const premiumFeatures = [
    { label: "3 Year Random Enrollment", enabled: true },
    { label: "Perfect for Trucking Companies", enabled: true },
    "divider",
    { label: "✓ Unlimited Drivers Included", enabled: true },
    "divider",
    { label: "DOT Random Enrollment", enabled: true },
    { label: "Instant Random Enrollment Certificate", enabled: true },
    { label: "Larger Fleet Owner", enabled: true },
    { label: "Access to 50,000+ Labs Nationwide", enabled: true },
    { label: "Drug Test $75", enabled: true },
    { label: "Alcohol Test $65", enabled: true },
    { label: "Dedicated Account Manager", enabled: true },
    { label: "Audit Support", enabled: true },
    { label: "Unlimited Drivers/Employees", enabled: true },
    { label: "One-Time Setup - No renewal cost", enabled: true },
  ];

  return (
    <section className="w-full bg-[#03151A] px-4 py-8 sm:py-10 md:py-14">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          PRICING
          <br className="hidden sm:block" />
          <span> </span>
          <span className="text-[#2563EB]">DRUG TESTING PLANS</span>
        </h2>
        <p className="text-base sm:text-lg text-white max-w-2xl mx-auto">
          Pay by the month or the year, and cancel at any time.
        </p>
      </motion.div>

      <div className="mx-auto max-w-6xl rounded-3xl ring-1 ring-teal-400/40">
        <div className="grid grid-cols-1 gap-5 p-3 sm:grid-cols-2 md:grid-cols-3 md:p-6">
          <PlanCard
            planId={1}
            tone="indigo"
            name="Essential"
            price="$99"
            billedCopy="Every Year"
            cta="Get Started"
            features={essentialFeatures}
            handlePlan={handlePlan}
          />
          <PlanCard
            planId={2}
            tone="violet"
            name="Plus"
            price="$150"
            billedCopy="Every Year"
            cta="Get Started"
            features={plusFeatures}
            handlePlan={handlePlan}
          />
          <PlanCard
            planId={3}
            tone="purple"
            name="Premium"
            price="$499"
            billedCopy="Every Year"
            cta="Get Started"
            features={premiumFeatures}
            handlePlan={handlePlan}
          />
        </div>
      </div>
    </section>
  );
}
