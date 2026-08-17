"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Settings2, Cpu, HardDrive, ShieldCheck, Zap } from "lucide-react";
import { ServiceConfig } from "@/context/CartContext";
import { MANAGED_ADDONS, GPU_MODELS, UNIT_RATES, calculateConfigPrice, formatPriceFCFA } from "@/lib/pricing";

/* ── Props ───────────────────────────────────────────────── */
type Props = {
  service: { id: string; name: string; category: string; basePrice?: number };
  fields: readonly string[];
  initial?: ServiceConfig;
  accent?: "primary-light" | "navy";
  onConfirm: (config: ServiceConfig) => void;
  onClose: () => void;
};

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function ServiceConfigModal({ service, fields, initial, accent = "primary-light", onConfirm, onClose }: Props) {
  const show = (f: string) => fields.includes(f);
  const isObjectStorage = service.id.includes("object-storage") || service.name.toLowerCase().includes("objet");

  const [designation, setDesignation] = useState(initial?.designation ?? "");
  const [vcpu, setVcpu]       = useState(initial?.vcpu     ?? (show("vcpu") ? 4 : 2));
  const [ram, setRam]         = useState(initial?.ram      ?? (show("ram") ? 16 : 8));
  const [storage, setStorage] = useState(initial?.storage  ?? (isObjectStorage ? 500 : 100));
  const [duration, setDuration] = useState(initial?.duration ?? 1);
  const [gpuType, setGpuType]  = useState(initial?.gpuType ?? "rtx4090");
  const [gpuCount, setGpuCount] = useState(initial?.gpuCount ?? 1);
  const [addons, setAddons]   = useState<string[]>(initial?.addons ?? []);

  const accentColor = accent === "navy" ? "#1A3A5C" : "#C78B2E";
  const accentBg    = accent === "navy" ? "bg-navy"  : "bg-primary-light";

  const toggleAddon = (id: string) =>
    setAddons((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);

  const currentConfig: ServiceConfig = useMemo(() => ({
    designation,
    vcpu:    show("vcpu")     ? vcpu     : undefined,
    ram:     show("ram")      ? ram      : undefined,
    storage: show("storage")  ? storage  : undefined,
    duration: show("duration") ? duration : undefined,
    gpuType: show("gpu_type") || show("gpu") ? gpuType : undefined,
    gpuCount: show("gpu_count") || show("gpu") ? gpuCount : undefined,
    isObjectStorage,
    addons,
  }), [designation, vcpu, ram, storage, duration, gpuType, gpuCount, addons, fields, isObjectStorage]);

  const estimatedMonthlyPrice = useMemo(() => {
    return calculateConfigPrice(currentConfig, service.basePrice ?? 0);
  }, [currentConfig, service.basePrice]);

  const handleConfirm = () => {
    onConfirm({
      ...currentConfig,
      monthlyPrice: estimatedMonthlyPrice,
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
        className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[90]"
      />

      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.45, ease }}
        className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-2xl bg-white z-[95] shadow-2xl overflow-hidden rounded-2xl md:rounded-3xl border border-taupe/10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className={`${accentBg} px-6 py-5 flex items-center justify-between text-white shadow-md`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">{service.category}</p>
              <h3 className="text-[16px] font-black text-white leading-tight">{service.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/15 rounded-full transition-colors">
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Live pricing banner */}
        <div className="bg-cream/90 px-6 py-3 border-b border-taupe/10 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-taupe/70">
            Estimation mensuelle :
          </span>
          <div className="text-right">
            <span className="text-lg font-black text-rouge-ambra">
              {formatPriceFCFA(estimatedMonthlyPrice, true)}
            </span>
            <span className="text-[10px] text-taupe/50 block font-medium">/ mois sans engagement</span>
          </div>
        </div>

        {/* Body — scrollable specs */}
        <div className="px-6 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">

          {/* Désignation */}
          {show("designation") && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70 flex justify-between">
                <span>Nom de l&apos;instance / Projet</span>
                <span className="text-taupe/40 font-normal normal-case">(facultatif)</span>
              </label>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Ex : Serveur Production ERP"
                className="w-full px-4 py-3 border border-taupe/20 rounded-xl text-[14px] text-navy placeholder:text-taupe/30 focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 outline-none transition-all"
              />
            </div>
          )}

          {/* GPU Type & Count */}
          {(show("gpu_type") || show("gpu")) && (
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-rouge-ambra" /> Modèle GPU Dédié
              </label>
              <div className="grid gap-2">
                {GPU_MODELS.map((gpu) => (
                  <button
                    key={gpu.id}
                    type="button"
                    onClick={() => setGpuType(gpu.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      gpuType === gpu.id
                        ? "border-rouge-ambra bg-rouge-ambra/5 ring-1 ring-rouge-ambra"
                        : "border-taupe/15 bg-white hover:border-taupe/40"
                    }`}
                  >
                    <span className="text-[13px] font-bold text-navy">{gpu.name}</span>
                    <span className="text-[12px] font-black text-rouge-ambra">
                      {formatPriceFCFA(gpu.monthlyPrice, false)}/mo
                    </span>
                  </button>
                ))}
              </div>

              {/* GPU Count */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-taupe/60">Nombre de GPU</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 4, 8].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setGpuCount(cnt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        gpuCount === cnt
                          ? "bg-navy text-white"
                          : "bg-taupe/10 text-taupe hover:bg-taupe/20"
                      }`}
                    >
                      {cnt}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* vCPU */}
          {show("vcpu") && (
            <SliderField
              label="Processeur (vCPU)"
              icon={<Cpu className="w-3.5 h-3.5 text-primary-light" />}
              value={vcpu}
              min={1} max={32} step={1}
              unit="vCPU"
              unitRateText={`${formatPriceFCFA(UNIT_RATES.vcpu, false)} / vCPU`}
              onChange={setVcpu}
              color={accentColor}
            />
          )}

          {/* RAM */}
          {show("ram") && (
            <SliderField
              label="Mémoire RAM (Go)"
              icon={<Cpu className="w-3.5 h-3.5 text-primary-light" />}
              value={ram}
              min={1} max={128} step={1}
              unit="Go"
              unitRateText={`${formatPriceFCFA(UNIT_RATES.ram, false)} / Go`}
              onChange={setRam}
              color={accentColor}
            />
          )}

          {/* Stockage */}
          {show("storage") && (
            <StepperField
              label={isObjectStorage ? "Stockage d'Objet S3 (Go)" : "Stockage NVMe SSD (Go)"}
              icon={<HardDrive className="w-3.5 h-3.5 text-primary-light" />}
              value={storage}
              min={isObjectStorage ? 50 : 20}
              max={isObjectStorage ? 10000 : 2000}
              step={isObjectStorage ? 50 : 20}
              unitRateText={`${formatPriceFCFA(isObjectStorage ? UNIT_RATES.objectStorage : UNIT_RATES.storage, false)} / Go`}
              onChange={setStorage}
              color={accentColor}
            />
          )}

          {/* Durée */}
          {show("duration") && (
            <SliderField
              label="Durée d'engagement (mois)"
              value={duration}
              min={1} max={36} step={1}
              unit="mois"
              unitRateText={duration >= 12 ? "Remise engagement annuel incluse" : "Facturation mensuelle"}
              onChange={setDuration}
              color={accentColor}
            />
          )}
        </div>

        {/* Add-ons */}
        <div className="px-6 sm:px-8 py-4 border-t border-taupe/10 bg-cream/40">
          <p className="text-[11px] font-bold uppercase tracking-widest text-navy/70 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rouge-ambra" /> Services & Options Managées additionnels
          </p>
          <div className="grid sm:grid-cols-3 gap-2">
            {MANAGED_ADDONS.map((addon) => {
              const checked = addons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-200 text-left ${
                    checked
                      ? "border-rouge-ambra bg-rouge-ambra/5 shadow-sm"
                      : "border-taupe/15 bg-white hover:border-taupe/30"
                  }`}
                >
                  <span className={`mt-0.5 w-4 h-4 shrink-0 border-2 rounded flex items-center justify-center transition-colors ${
                    checked ? "border-rouge-ambra bg-rouge-ambra" : "border-taupe/30"
                  }`}>
                    {checked && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-navy leading-tight">{addon.label}</p>
                    <p className="text-[10px] font-semibold text-rouge-ambra mt-0.5">
                      +{formatPriceFCFA(addon.monthlyPrice, false)}/mo
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-taupe/10 flex items-center justify-between gap-3 bg-white">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-taupe/50">Total configuré</p>
            <p className="text-[15px] font-black text-navy">{formatPriceFCFA(estimatedMonthlyPrice, true)}/mo</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-3 border border-taupe/20 rounded-xl text-[11px] font-bold uppercase tracking-widest text-taupe/60 hover:text-navy transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className={`px-6 py-3 ${accentBg} text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] hover:opacity-95 shadow-md transition-all`}
            >
              Ajouter au devis
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Slider field ────────────────────────────────────────── */
function SliderField({
  label, icon, value, min, max, step, unit, unitRateText, onChange, color,
}: {
  label: string; icon?: React.ReactNode; value: number; min: number; max: number;
  step: number; unit: string; unitRateText?: string; onChange: (v: number) => void; color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackStyle: React.CSSProperties = {
    background: `linear-gradient(to right, ${color} ${pct}%, #e5ddd5 ${pct}%)`,
    accentColor: color,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70 flex items-center gap-1.5">
          {icon} {label}
        </label>
        <div className="text-right">
          <span
            className="text-[13px] font-black px-2.5 py-0.5 border rounded-lg"
            style={{ borderColor: color, color }}
          >
            {value} {unit}
          </span>
          {unitRateText && (
            <span className="block text-[10px] text-taupe/50 mt-0.5">{unitRateText}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2.5 appearance-none rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
        style={trackStyle}
      />
      <div className="flex justify-between text-[10px] text-taupe/40 font-medium">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

/* ── Stepper field (+ saisie directe) ───────────────────── */
function StepperField({
  label, icon, value, min, max, step, unitRateText, onChange, color,
}: {
  label: string; icon?: React.ReactNode; value: number; min: number; max: number;
  step: number; unitRateText?: string; onChange: (v: number) => void; color: string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const snap = (n: number) => {
    const clamped = clamp(n);
    return Math.round((clamped - min) / step) * step + min;
  };

  const decrement = () => onChange(snap(value - step));
  const increment = () => onChange(snap(value + step));

  const commitInput = (raw: string) => {
    const parsed = parseInt(raw.trim(), 10);
    if (Number.isNaN(parsed)) {
      onChange(value);
      return;
    }
    onChange(snap(parsed));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-widest text-taupe/70 flex items-center gap-1.5">
          {icon} {label}
        </label>
        {unitRateText && (
          <span className="text-[10px] text-taupe/50">{unitRateText}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="w-10 h-10 border border-taupe/20 rounded-xl flex items-center justify-center hover:border-taupe/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Minus className="w-4 h-4 text-taupe/70" />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const next = e.target.valueAsNumber;
            if (!Number.isNaN(next)) onChange(clamp(next));
          }}
          onBlur={(e) => commitInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitInput((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="w-28 text-center text-[15px] font-black border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-light/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ borderColor: color, color }}
          aria-label={label}
        />
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="w-10 h-10 border border-taupe/20 rounded-xl flex items-center justify-center hover:border-taupe/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Plus className="w-4 h-4 text-taupe/70" />
        </button>
        <span className="text-[11px] text-taupe/50">({min} – {max} Go)</span>
      </div>
    </div>
  );
}
