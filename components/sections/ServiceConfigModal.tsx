"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Settings2,
  Cpu,
  HardDrive,
  ShieldCheck,
  Zap,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Server,
  MemoryStick,
} from "lucide-react";
import { ServiceConfig } from "@/context/CartContext";
import {
  MANAGED_ADDONS,
  GPU_MODELS,
  UNIT_RATES,
  calculateConfigPrice,
  formatPriceFCFA,
  getDurationDiscountRate,
} from "@/lib/pricing";

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

export function ServiceConfigModal({
  service,
  fields,
  initial,
  accent = "primary-light",
  onConfirm,
  onClose,
}: Props) {
  const show = (f: string) => fields.includes(f);
  const isObjectStorage =
    service.id.includes("object-storage") ||
    service.name.toLowerCase().includes("objet");

  const [mounted, setMounted] = useState(false);
  const addonsSlideRef = useRef<HTMLDivElement>(null);

  const [designation, setDesignation] = useState(initial?.designation ?? "");
  const [vcpu, setVcpu] = useState(initial?.vcpu ?? (show("vcpu") ? 4 : 2));
  const [ram, setRam] = useState(initial?.ram ?? (show("ram") ? 16 : 8));
  const [storage, setStorage] = useState(
    initial?.storage ?? (isObjectStorage ? 500 : 100)
  );
  const [duration, setDuration] = useState(initial?.duration ?? 1);
  const [gpuType, setGpuType] = useState(initial?.gpuType ?? "rtx4090");
  const [gpuCount, setGpuCount] = useState(initial?.gpuCount ?? 1);
  const [addons, setAddons] = useState<string[]>(initial?.addons ?? []);

  useEffect(() => {
    setMounted(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const accentColor = accent === "navy" ? "#1A3A5C" : "#D86C24";
  const accentBg = accent === "navy" ? "bg-navy" : "bg-primary-light";

  const toggleAddon = (id: string) =>
    setAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const slideAddons = (dir: "left" | "right") => {
    if (!addonsSlideRef.current) return;
    addonsSlideRef.current.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  const currentConfig: ServiceConfig = useMemo(
    () => ({
      designation,
      vcpu: show("vcpu") ? vcpu : undefined,
      ram: show("ram") ? ram : undefined,
      storage: show("storage") ? storage : undefined,
      duration: show("duration") ? duration : undefined,
      gpuType: show("gpu_type") || show("gpu") ? gpuType : undefined,
      gpuCount: show("gpu_count") || show("gpu") ? gpuCount : undefined,
      isObjectStorage,
      addons,
    }),
    [
      designation,
      vcpu,
      ram,
      storage,
      duration,
      gpuType,
      gpuCount,
      addons,
      fields,
      isObjectStorage,
    ]
  );

  const estimatedMonthlyPrice = useMemo(() => {
    return calculateConfigPrice(currentConfig, service.basePrice ?? 0);
  }, [currentConfig, service.basePrice]);

  const discountRate = getDurationDiscountRate(
    show("duration") ? duration : undefined
  );

  const handleConfirm = () => {
    onConfirm({
      ...currentConfig,
      monthlyPrice: estimatedMonthlyPrice,
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4">
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy/65 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.35, ease }}
          className="relative z-10 w-full max-w-3xl bg-white shadow-2xl rounded-2xl md:rounded-3xl border border-taupe/15 flex flex-col max-h-[92dvh] overflow-hidden"
        >
          {/* Compact Header + Live Price Badge */}
          <div
            className={`${accentBg} px-4 sm:px-6 py-3 flex items-center justify-between gap-3 text-white shadow-sm shrink-0`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-white/15 rounded-xl shrink-0">
                <Settings2 className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/75 truncate">
                  {service.category}
                </p>
                <h3 className="text-[14px] sm:text-[16px] font-black text-white leading-tight truncate">
                  {service.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="hidden sm:block text-right bg-black/20 px-3 py-1.5 rounded-xl border border-white/15">
                <span className="text-[9px] uppercase tracking-wider text-white/75 block font-bold">
                  Estimation mensuelle
                </span>
                <span className="text-xs font-black text-white">
                  {formatPriceFCFA(estimatedMonthlyPrice, true)}/mo
                </span>
              </div>
              <button
                onClick={onClose}
                type="button"
                aria-label="Fermer"
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* MAIN FORM BODY — Highlighted & Prominent */}
          <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1 min-h-0 bg-cream/35 space-y-3.5">
            {/* Section Title & Base Info */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-taupe/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rouge-ambra" />
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-navy">
                  Configuration du formulaire principal
                </h4>
              </div>
              {service.basePrice !== undefined && service.basePrice > 0 && (
                <span className="text-[10px] font-bold text-taupe/70 bg-white px-2.5 py-0.5 rounded-full border border-taupe/15">
                  Socle de base : {formatPriceFCFA(service.basePrice, false)}/mo
                </span>
              )}
            </div>

            {/* Désignation (Nom de l'instance / Projet) */}
            {show("designation") && (
              <div className="bg-white p-3 rounded-xl border border-taupe/15 shadow-2xs flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5 shrink-0">
                  <Server className="w-3.5 h-3.5 text-primary-light" />
                  <span>Nom de l&apos;instance / Projet</span>
                  <span className="text-taupe/40 font-normal normal-case text-[10px]">
                    (optionnel)
                  </span>
                </label>
                <input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Ex : Serveur Production ERP, Cluster K8s..."
                  className="w-full px-3 py-2 bg-cream/30 border border-taupe/20 rounded-lg text-[13px] font-medium text-navy placeholder:text-taupe/35 focus:bg-white focus:border-primary-light focus:ring-2 focus:ring-primary-light/15 outline-none transition-all"
                />
              </div>
            )}

            {/* GPU Type & Count */}
            {(show("gpu_type") || show("gpu")) && (
              <div className="bg-white p-3.5 rounded-xl border border-taupe/15 shadow-2xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-rouge-ambra" /> Modèle &
                    Nombre de GPU Dédiés
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-taupe/60 mr-1">
                      Quantité :
                    </span>
                    {[1, 2, 4, 8].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setGpuCount(cnt)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                          gpuCount === cnt
                            ? "bg-navy text-white shadow-xs"
                            : "bg-cream text-taupe hover:bg-taupe/15"
                        }`}
                      >
                        {cnt}x
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {GPU_MODELS.map((gpu) => (
                    <button
                      key={gpu.id}
                      type="button"
                      onClick={() => setGpuType(gpu.id)}
                      className={`flex flex-col justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        gpuType === gpu.id
                          ? "border-rouge-ambra bg-rouge-ambra/5 ring-1 ring-rouge-ambra"
                          : "border-taupe/15 bg-cream/20 hover:border-taupe/40"
                      }`}
                    >
                      <span className="text-[12px] font-bold text-navy leading-snug">
                        {gpu.name}
                      </span>
                      <span className="text-[11px] font-black text-rouge-ambra mt-1">
                        {formatPriceFCFA(gpu.monthlyPrice, false)}/mo
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2-Column Resource Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* vCPU */}
              {show("vcpu") && (
                <SliderField
                  label="Processeur (vCPU)"
                  icon={<Cpu className="w-4 h-4 text-primary-light" />}
                  value={vcpu}
                  min={1}
                  max={32}
                  step={1}
                  unit="vCPU"
                  presets={[2, 4, 8, 16, 32]}
                  unitRateText={`${formatPriceFCFA(UNIT_RATES.vcpu, false)} / vCPU`}
                  subtotalText={formatPriceFCFA(vcpu * UNIT_RATES.vcpu, false)}
                  onChange={setVcpu}
                  color={accentColor}
                />
              )}

              {/* RAM */}
              {show("ram") && (
                <SliderField
                  label="Mémoire RAM (Go)"
                  icon={<MemoryStick className="w-4 h-4 text-primary-light" />}
                  value={ram}
                  min={1}
                  max={128}
                  step={1}
                  unit="Go"
                  presets={[4, 8, 16, 32, 64, 128]}
                  unitRateText={`${formatPriceFCFA(UNIT_RATES.ram, false)} / Go`}
                  subtotalText={formatPriceFCFA(ram * UNIT_RATES.ram, false)}
                  onChange={setRam}
                  color={accentColor}
                />
              )}

              {/* Stockage */}
              {show("storage") && (
                <StepperField
                  label={
                    isObjectStorage
                      ? "Stockage d'Objet S3 (Go)"
                      : "Stockage NVMe SSD (Go)"
                  }
                  icon={<HardDrive className="w-4 h-4 text-primary-light" />}
                  value={storage}
                  min={isObjectStorage ? 50 : 20}
                  max={isObjectStorage ? 10000 : 2000}
                  step={isObjectStorage ? 50 : 20}
                  presets={
                    isObjectStorage
                      ? [250, 500, 1000, 2500, 5000]
                      : [100, 250, 500, 1000, 2000]
                  }
                  unitRateText={`${formatPriceFCFA(
                    isObjectStorage
                      ? UNIT_RATES.objectStorage
                      : UNIT_RATES.storage,
                    false
                  )} / Go`}
                  subtotalText={formatPriceFCFA(
                    storage *
                      (isObjectStorage
                        ? UNIT_RATES.objectStorage
                        : UNIT_RATES.storage),
                    false
                  )}
                  onChange={setStorage}
                  color={accentColor}
                />
              )}

              {/* Durée */}
              {show("duration") && (
                <SliderField
                  label="Durée d'engagement"
                  icon={<Calendar className="w-4 h-4 text-primary-light" />}
                  value={duration}
                  min={1}
                  max={36}
                  step={1}
                  unit="mois"
                  presets={[1, 6, 12, 24, 36]}
                  unitRateText={
                    discountRate > 0
                      ? `Remise -${Math.round(discountRate * 100)}% appliquée`
                      : "Sans engagement (-10% dès 12 mois)"
                  }
                  subtotalText={
                    discountRate > 0
                      ? `-${Math.round(discountRate * 100)}%`
                      : "Standard"
                  }
                  onChange={setDuration}
                  color={accentColor}
                />
              )}
            </div>
          </div>

          {/* ADD-ONS — Single-line horizontal slide */}
          <div className="px-4 sm:px-6 py-2.5 border-t border-taupe/15 bg-white shrink-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/80 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rouge-ambra shrink-0" />
                <span>Services & Options Managées</span>
                {addons.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-rouge-ambra text-white rounded-full text-[9px]">
                    {addons.length}
                  </span>
                )}
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => slideAddons("left")}
                  aria-label="Défiler à gauche"
                  className="w-6 h-6 rounded-md border border-taupe/20 flex items-center justify-center text-taupe hover:text-navy hover:border-navy/40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => slideAddons("right")}
                  aria-label="Défiler à droite"
                  className="w-6 h-6 rounded-md border border-taupe/20 flex items-center justify-center text-taupe hover:text-navy hover:border-navy/40 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={addonsSlideRef}
              className="flex flex-nowrap items-stretch gap-2 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:thin]"
            >
              {MANAGED_ADDONS.map((addon) => {
                const checked = addons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`shrink-0 w-[195px] sm:w-[205px] flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-150 text-left snap-start cursor-pointer ${
                      checked
                        ? "border-rouge-ambra bg-rouge-ambra/5 shadow-2xs ring-1 ring-rouge-ambra/30"
                        : "border-taupe/15 bg-cream/25 hover:border-taupe/35 hover:bg-cream/50"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 shrink-0 border-2 rounded flex items-center justify-center transition-colors ${
                        checked
                          ? "border-rouge-ambra bg-rouge-ambra"
                          : "border-taupe/35 bg-white"
                      }`}
                    >
                      {checked && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 10 8"
                        >
                          <path
                            d="M1 4l3 3 5-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-navy truncate leading-tight">
                        {addon.label}
                      </p>
                      <p className="text-[10px] font-extrabold text-rouge-ambra leading-tight mt-0.5">
                        +{formatPriceFCFA(addon.monthlyPrice, false)}/mo
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-4 sm:px-6 py-3 border-t border-taupe/15 flex flex-wrap items-center justify-between gap-3 bg-cream/60 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-taupe/60">
                  Total mensuel configuré
                </p>
                {discountRate > 0 && (
                  <span className="text-[9px] font-black uppercase bg-rouge-ambra/10 text-rouge-ambra px-2 py-0.5 rounded-full">
                    -{Math.round(discountRate * 100)}% engagement {duration}m
                  </span>
                )}
              </div>
              <p className="text-[16px] sm:text-[18px] font-black text-rouge-ambra leading-tight">
                {formatPriceFCFA(estimatedMonthlyPrice, true)}
                <span className="text-[11px] font-semibold text-taupe/60 ml-1">
                  / mois
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-taupe/20 rounded-xl text-[11px] font-bold uppercase tracking-widest text-taupe/70 hover:text-navy hover:border-navy/30 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-5 py-2.5 ${accentBg} text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] hover:opacity-95 shadow-md transition-all cursor-pointer`}
              >
                Ajouter au devis
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

/* ── Slider field card ───────────────────────────────────── */
function SliderField({
  label,
  icon,
  value,
  min,
  max,
  step,
  unit,
  presets,
  unitRateText,
  subtotalText,
  onChange,
  color,
}: {
  label: string;
  icon?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  presets?: number[];
  unitRateText?: string;
  subtotalText?: string;
  onChange: (v: number) => void;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackStyle = {
    background: `linear-gradient(to right, ${color} ${pct}%, #e5ddd5 ${pct}%)`,
    accentColor: color,
    ["--thumb-color" as string]: color,
  } as React.CSSProperties;

  return (
    <div className="bg-white p-3.5 rounded-xl border border-taupe/15 shadow-2xs flex flex-col justify-between gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
            {icon}
            <span>{label}</span>
          </label>
          {unitRateText && (
            <span className="block text-[10px] text-taupe/55 mt-0.5">
              {unitRateText}
            </span>
          )}
        </div>

        <div className="text-right shrink-0">
          <span
            className="inline-block text-[12px] font-black px-2.5 py-0.5 border rounded-lg bg-cream/40"
            style={{ borderColor: color, color }}
          >
            {value} {unit}
          </span>
          {subtotalText && (
            <span className="block text-[10px] font-bold text-navy/60 mt-0.5">
              {subtotalText}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 appearance-none rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
          style={trackStyle}
        />

        {presets ? (
          <div className="flex items-center justify-between gap-1 pt-0.5">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  value === p
                    ? "bg-navy text-white"
                    : "bg-cream/70 text-taupe/70 hover:bg-taupe/15 hover:text-navy"
                }`}
              >
                {p} {unit}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex justify-between text-[10px] text-taupe/45 font-medium">
            <span>
              {min} {unit}
            </span>
            <span>
              {max} {unit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Stepper field card (+ saisie directe & presets) ──────── */
function StepperField({
  label,
  icon,
  value,
  min,
  max,
  step,
  presets,
  unitRateText,
  subtotalText,
  onChange,
  color,
}: {
  label: string;
  icon?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  presets?: number[];
  unitRateText?: string;
  subtotalText?: string;
  onChange: (v: number) => void;
  color: string;
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
    <div className="bg-white p-3.5 rounded-xl border border-taupe/15 shadow-2xs flex flex-col justify-between gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
            {icon}
            <span>{label}</span>
          </label>
          {unitRateText && (
            <span className="block text-[10px] text-taupe/55 mt-0.5">
              {unitRateText}
            </span>
          )}
        </div>
        {subtotalText && (
          <span className="text-[10px] font-bold text-navy/60 shrink-0">
            {subtotalText}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5 text-navy" />
        </button>
        <div className="relative flex-1">
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
            className="w-full text-center text-[13px] font-black border rounded-lg px-2 py-1 outline-none bg-cream/20 focus:bg-white focus:ring-2 focus:ring-primary-light/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{ borderColor: color, color }}
            aria-label={label}
          />
        </div>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-navy" />
        </button>
      </div>

      {presets && (
        <div className="flex items-center justify-between gap-1">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                value === p
                  ? "bg-navy text-white"
                  : "bg-cream/70 text-taupe/70 hover:bg-taupe/15 hover:text-navy"
              }`}
            >
              {p >= 1000 ? `${p / 1000} To` : `${p} Go`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
