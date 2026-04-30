"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Settings2 } from "lucide-react";
import { ServiceConfig } from "@/context/CartContext";

/* ── Managed add-ons (mirrors ManagedServices data) ──────── */
export const MANAGED_ADDONS = [
  { id: "backup",     label: "Sauvegarde managée",      sub: "Protection sans intervention" },
  { id: "monitoring", label: "Supervision & Monitoring", sub: "Veille 24h/24 et 7j/7" },
  { id: "security",   label: "Sécurité managée",         sub: "Protection multicouche" },
];

/* ── Props ───────────────────────────────────────────────── */
type Props = {
  service: { id: string; name: string; category: string };
  fields: readonly string[];
  initial?: ServiceConfig;
  accent?: "primary-light" | "navy";
  onConfirm: (config: ServiceConfig) => void;
  onClose: () => void;
};

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function ServiceConfigModal({ service, fields, initial, accent = "primary-light", onConfirm, onClose }: Props) {
  const show = (f: string) => fields.includes(f);

  const [designation, setDesignation] = useState(initial?.designation ?? "");
  const [vcpu, setVcpu]       = useState(initial?.vcpu     ?? 2);
  const [ram, setRam]         = useState(initial?.ram      ?? 8);
  const [storage, setStorage] = useState(initial?.storage  ?? 100);
  const [duration, setDuration] = useState(initial?.duration ?? 1);
  const [addons, setAddons]   = useState<string[]>(initial?.addons ?? []);

  const accentColor = accent === "navy" ? "#1A3A5C" : "#C78B2E";
  const accentBg    = accent === "navy" ? "bg-navy"  : "bg-primary-light";

  const toggleAddon = (id: string) =>
    setAddons((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);

  const handleConfirm = () => {
    onConfirm({
      designation,
      vcpu:    show("vcpu")     ? vcpu     : undefined,
      ram:     show("ram")      ? ram      : undefined,
      storage: show("storage")  ? storage  : undefined,
      duration: show("duration") ? duration : undefined,
      addons,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-[90]"
      />

      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.45, ease }}
        className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-2xl bg-white z-[95] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className={`${accentBg} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Settings2 className="w-4 h-4 text-white/70" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">{service.category}</p>
              <h3 className="text-[15px] font-black text-white leading-tight">{service.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded transition-colors">
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Body — scrollable specs only */}
        <div className="px-8 py-6 space-y-6 max-h-[40vh] overflow-y-auto">

          {/* Désignation */}
          {show("designation") && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/60">
                Désignation
              </label>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Ex : Serveur Marketing"
                className="w-full px-4 py-3 border border-taupe/20 text-[14px] text-navy placeholder:text-taupe/30 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all"
              />
            </div>
          )}

          {/* vCPU */}
          {show("vcpu") && (
            <SliderField
              label="vCPU"
              value={vcpu}
              min={1} max={32} step={1}
              unit=""
              onChange={setVcpu}
              color={accentColor}
            />
          )}

          {/* RAM */}
          {show("ram") && (
            <SliderField
              label="RAM"
              value={ram}
              min={1} max={128} step={1}
              unit="Go"
              onChange={setRam}
              color={accentColor}
            />
          )}

          {/* Stockage */}
          {show("storage") && (
            <StepperField
              label="Stockage (Go)"
              value={storage}
              min={10} max={1000} step={10}
              onChange={setStorage}
              color={accentColor}
            />
          )}

          {/* Durée */}
          {show("duration") && (
            <SliderField
              label="Durée"
              value={duration}
              min={1} max={36} step={1}
              unit="mois"
              onChange={setDuration}
              color={accentColor}
            />
          )}
        </div>

        {/* Add-ons — always visible, outside scroll zone */}
        <div className="px-8 py-5 border-t border-taupe/8 bg-cream/30">
          <p className="text-[11px] font-bold uppercase tracking-widest text-taupe/50 mb-3">
            Services additionnels <span className="text-taupe/30 normal-case font-normal tracking-normal">(inclus avec toute formule)</span>
          </p>
          <div className="grid sm:grid-cols-3 gap-2">
            {MANAGED_ADDONS.map((addon) => {
              const checked = addons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex items-start gap-2.5 p-3 border transition-all duration-200 text-left ${
                    checked
                      ? "border-primary-light bg-primary-light/5"
                      : "border-taupe/15 bg-white hover:border-taupe/30"
                  }`}
                >
                  <span className={`mt-0.5 w-4 h-4 shrink-0 border-2 flex items-center justify-center transition-colors ${
                    checked ? "border-primary-light bg-primary-light" : "border-taupe/30"
                  }`}>
                    {checked && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-navy leading-tight">{addon.label}</p>
                    <p className="text-[10px] text-taupe/50 mt-0.5">{addon.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-taupe/10 flex gap-3">
          <button
            onClick={handleConfirm}
            className={`flex-1 flex items-center justify-center gap-2 ${accentBg} text-white text-[12px] font-black uppercase tracking-[0.2em] py-3.5 hover:opacity-90 transition-opacity`}
          >
            Confirmer la sélection
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3.5 border border-taupe/20 text-[12px] font-bold uppercase tracking-widest text-taupe/50 hover:text-navy hover:border-taupe/40 transition-colors"
          >
            Annuler
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Slider field ────────────────────────────────────────── */
function SliderField({
  label, value, min, max, step, unit, onChange, color,
}: {
  label: string; value: number; min: number; max: number;
  step: number; unit: string; onChange: (v: number) => void; color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackStyle: React.CSSProperties = {
    background: `linear-gradient(to right, ${color} ${pct}%, #e5ddd5 ${pct}%)`,
    accentColor: color,
    // custom property for thumb color via CSS
    ["--thumb-color" as string]: color,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/60">{label}</label>
        <span
          className="text-[13px] font-black px-2.5 py-0.5 border"
          style={{ borderColor: color, color }}
        >
          {value}{unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 appearance-none rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
        style={trackStyle}
      />
      <div className="flex justify-between text-[10px] text-taupe/30 font-medium">
        <span>{min}{unit ? ` ${unit}` : ""}</span>
        <span>{max}{unit ? ` ${unit}` : ""}</span>
      </div>
    </div>
  );
}

/* ── Stepper field ───────────────────────────────────────── */
function StepperField({
  label, value, min, max, step, onChange, color,
}: {
  label: string; value: number; min: number; max: number;
  step: number; onChange: (v: number) => void; color: string;
}) {
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/60">{label}</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          className="w-9 h-9 border border-taupe/20 flex items-center justify-center hover:border-taupe/40 transition-colors"
        >
          <Minus className="w-3.5 h-3.5 text-taupe/60" />
        </button>
        <span
          className="min-w-[60px] text-center text-[15px] font-black border px-3 py-1.5"
          style={{ borderColor: color, color }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={increment}
          className="w-9 h-9 border border-taupe/20 flex items-center justify-center hover:border-taupe/40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-taupe/60" />
        </button>
        <span className="text-[11px] text-taupe/40">({min} – {max})</span>
      </div>
    </div>
  );
}
