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
  Wifi,
  Check,
  Layers,
} from "lucide-react";
import { ServiceConfig } from "@/context/CartContext";
import {
  RESOURCE_RATES,
  OBJECT_STORAGE_RATES,
  MANAGED_SERVICES_CATALOG,
  GPU_MODELS,
  OS_CATALOG,
  calculateDetailedQuote,
  formatPriceFCFA,
} from "@/lib/pricing";

/* ── Props ───────────────────────────────────────────────── */
type Props = {
  service: { id: string; name: string; category: string; basePrice?: number };
  fields: readonly string[];
  initial?: Partial<ServiceConfig>;
  accent?: "primary-light" | "navy";
  onConfirm: (config: ServiceConfig, sourceCoords?: { x: number; y: number }) => void;
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

  const isColocation =
    service.id.includes("colocation") ||
    service.name.toLowerCase().includes("colocation") ||
    service.name.toLowerCase().includes("baie");

  const hasCompute =
    show("vcpu") ||
    show("ram") ||
    show("storage") ||
    show("gpu") ||
    show("gpu_type") ||
    show("rackUnits") ||
    isObjectStorage ||
    isColocation;

  const [mounted, setMounted] = useState(false);
  const addonsSlideRef = useRef<HTMLDivElement>(null);

  const [designation, setDesignation] = useState(initial?.designation ?? "");
  const [instanceCount, setInstanceCount] = useState(initial?.instanceCount ?? 1);
  const [os, setOs] = useState(initial?.os ?? "ubuntu-24");
  const [osFamily, setOsFamily] = useState<"linux" | "windows">(() => {
    const found = OS_CATALOG.find((o) => o.id === (initial?.os ?? "ubuntu-24"));
    return found?.family ?? "linux";
  });

  const handleFamilyChange = (family: "linux" | "windows") => {
    setOsFamily(family);
    const currentInFamily = OS_CATALOG.find((o) => o.id === os && o.family === family);
    if (!currentInFamily) {
      setOs(family === "linux" ? "ubuntu-24" : "win-2025");
    }
  };
  const [vcpu, setVcpu] = useState(initial?.vcpu ? Math.min(32, initial.vcpu) : (show("vcpu") ? 4 : 2));
  const [ram, setRam] = useState(initial?.ram ? Math.min(64, initial.ram) : (show("ram") ? 16 : 8));
  const [rackUnits, setRackUnits] = useState(initial?.rackUnits ?? 1);
  const [systemDisk, setSystemDisk] = useState(initial?.systemDisk ?? 100);
  const [systemDiskType, setSystemDiskType] = useState<"standard" | "advanced">(
    initial?.systemDiskType ?? initial?.storageType ?? "standard"
  );
  const [hasDataDisk, setHasDataDisk] = useState<boolean>(
    initial?.dataDisk !== undefined ? initial.dataDisk > 0 : true
  );
  const [dataDisk, setDataDisk] = useState(
    initial?.dataDisk && initial.dataDisk >= 100 ? initial.dataDisk : 100
  );
  const [dataDiskType, setDataDiskType] = useState<"standard" | "advanced">(
    initial?.dataDiskType ?? initial?.storageType ?? "standard"
  );
  const [storage, setStorage] = useState(
    initial?.storage ?? (isObjectStorage ? 1000 : 100)
  );
  const [storageType, setStorageType] = useState<"standard" | "advanced">(initial?.storageType ?? "standard");
  const [bandwidth, setBandwidth] = useState(initial?.bandwidth ?? 1);
  const [duration, setDuration] = useState(initial?.duration ?? (isColocation ? 12 : 3));
  const [gpuType, setGpuType] = useState(initial?.gpuType ?? "rtx4090");
  const [gpuCount, setGpuCount] = useState(initial?.gpuCount ?? 1);
  const [addons, setAddons] = useState<string[]>(() => {
    const base = initial?.addons ? [...initial.addons] : [];
    if (hasCompute && !isColocation && !base.includes("cloud-m")) {
      base.push("cloud-m");
    }
    return base;
  });

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
    setAddons((prev) => {
      if (prev.includes(id)) {
        return prev.filter((a) => a !== id);
      }
      let next = [...prev];
      // Exclusion mutuelle Acronis : Machine seule (10 000 F) vs Prise en charge intégrale (27 000 F)
      if (id === "backup-acronis-complete") {
        next = next.filter((a) => a !== "backup-acronis-vm");
      } else if (id === "backup-acronis-vm") {
        next = next.filter((a) => a !== "backup-acronis-complete");
      }
      // Exclusion mutuelle WAF Basic (Cloudflare Free) vs Advanced (Cloudflare Pro)
      if (id === "waf-advanced-cf") {
        next = next.filter((a) => a !== "waf-basic");
      } else if (id === "waf-basic") {
        next = next.filter((a) => a !== "waf-advanced-cf");
      }
      return [...next, id];
    });

  const slideAddons = (dir: "left" | "right") => {
    if (!addonsSlideRef.current) return;
    addonsSlideRef.current.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  const effectiveDataDisk = hasDataDisk ? Math.max(100, dataDisk) : 0;
  const computedTotalStorage = isObjectStorage ? storage : (systemDisk + effectiveDataDisk);

  const currentConfig: ServiceConfig = useMemo(
    () => ({
      designation,
      instanceCount: hasCompute && !isColocation && !isObjectStorage ? instanceCount : undefined,
      os: hasCompute && !isColocation && !isObjectStorage ? os : undefined,
      vcpu: show("vcpu") ? vcpu : undefined,
      ram: show("ram") ? ram : undefined,
      storage: show("storage") ? computedTotalStorage : undefined,
      systemDisk: show("storage") && !isObjectStorage ? systemDisk : undefined,
      systemDiskType: show("storage") && !isObjectStorage ? systemDiskType : undefined,
      dataDisk: show("storage") && !isObjectStorage ? effectiveDataDisk : undefined,
      dataDiskType: show("storage") && !isObjectStorage ? dataDiskType : undefined,
      storageType: show("storage") ? (systemDiskType || storageType) : undefined,
      rackUnits: isColocation || show("rackUnits") ? rackUnits : undefined,
      bandwidth: hasCompute ? bandwidth : undefined,
      duration: show("duration") ? duration : undefined,
      gpuType: show("gpu_type") || show("gpu") ? gpuType : undefined,
      gpuCount: show("gpu_count") || show("gpu") ? gpuCount : undefined,
      isObjectStorage,
      objectStorageTier: isObjectStorage ? storageType : undefined,
      addons,
    }),
    [
      designation,
      instanceCount,
      os,
      vcpu,
      ram,
      storage,
      systemDisk,
      systemDiskType,
      effectiveDataDisk,
      dataDiskType,
      computedTotalStorage,
      storageType,
      rackUnits,
      bandwidth,
      duration,
      gpuType,
      gpuCount,
      addons,
      fields,
      isObjectStorage,
      isColocation,
    ]
  );

  const quoteDetails = useMemo(() => {
    return calculateDetailedQuote(currentConfig);
  }, [currentConfig]);

  const effectiveMonthlyTotal = hasCompute
    ? quoteDetails.monthlyTotal
    : (service.basePrice && service.basePrice > 0 ? service.basePrice : quoteDetails.monthlyTotal);

  const [isValidating, setIsValidating] = useState(false);

  const handleConfirm = (e?: React.MouseEvent) => {
    if (isValidating) return;
    setIsValidating(true);

    const coords = e
      ? { x: e.clientX, y: e.clientY }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    onConfirm(
      {
        ...currentConfig,
        monthlyPrice: effectiveMonthlyTotal,
      },
      coords
    );

    setTimeout(() => {
      onClose();
    }, 450);
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
          {/* Header */}
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
                  Total Mensuel HT {instanceCount > 1 ? `(${instanceCount} machines)` : ""}
                </span>
                <span className="text-xs font-black text-white">
                  {formatPriceFCFA(effectiveMonthlyTotal, true)}
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

          {/* MAIN FORM BODY */}
          <div className="px-4 sm:px-6 py-3 overflow-y-auto flex-1 min-h-0 bg-cream/35 space-y-2.5 sm:space-y-3">
            {/* Titre & Sous-total Ressources si Compute, ou Présentation si Service managé */}
            {hasCompute ? (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-taupe/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rouge-ambra" />
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-navy">
                    Dimensionnement des Ressources Cloud
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-navy bg-white px-2.5 py-0.5 rounded-full border border-taupe/15">
                  Sous-total ressources : {formatPriceFCFA(quoteDetails.computeSubtotal, false)}
                </span>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-taupe/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-light block">
                    Service Managé &amp; Accompagnement Dédié
                  </span>
                  <h4 className="text-base font-bold text-navy">{service.name}</h4>
                  <p className="text-xs text-taupe/70 mt-0.5">
                    Prestation opérée 24h/24 et 7j/7 par nos ingénieurs certifiés avec SLA garanti.
                  </p>
                </div>
                {effectiveMonthlyTotal > 0 && (
                  <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-taupe/10">
                    <span className="text-[10px] uppercase font-bold text-taupe/50 block">Tarif mensuel HT</span>
                    <span className="text-sm font-black text-rouge-ambra">{formatPriceFCFA(effectiveMonthlyTotal, false)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Ligne compacte : Nom du serveur & Quantité de machines identiques */}
            {hasCompute && !isColocation && !isObjectStorage && (
              <div className="bg-white px-3.5 py-2.5 rounded-xl border border-taupe/15 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Server className="w-3.5 h-3.5 text-rouge-ambra shrink-0" />
                  <input
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Nom du serveur (ex : Serveur Web, Base de Données Prod, ERP...)"
                    className="w-full px-2.5 py-1 bg-cream/30 border border-taupe/20 rounded-lg text-xs font-bold text-navy placeholder:text-taupe/45 focus:bg-white focus:border-rouge-ambra outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-taupe/60">
                    Machines :
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 5, 10].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setInstanceCount(n)}
                        className={`px-2 py-0.5 rounded text-[10px] font-black transition-all cursor-pointer ${
                          instanceCount === n
                            ? "bg-navy text-white shadow-xs"
                            : "bg-cream/70 text-taupe/70 hover:bg-taupe/15 hover:text-navy"
                        }`}
                      >
                        {n}x
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-0.5 border border-taupe/20 rounded-md p-0.5 bg-cream/30">
                    <button
                      type="button"
                      onClick={() => setInstanceCount((prev) => Math.max(1, prev - 1))}
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-white text-navy cursor-pointer transition-colors"
                      aria-label="Diminuer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-navy">
                      {instanceCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInstanceCount((prev) => Math.min(50, prev + 1))}
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-white text-navy cursor-pointer transition-colors"
                      aria-label="Augmenter"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Colocation Rack Units (35 000 FCFA HT / U) */}
            {(isColocation || show("rackUnits")) && (
              <div className="bg-white p-3.5 rounded-xl border border-taupe/15 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-rouge-ambra" /> Emplacement Baie Datacenter Raxio Tier III
                    </label>
                    <span className="text-[10px] text-taupe/60 block mt-0.5">
                      Tarif officiel : 35 000 FCFA HT / U / mois (Énergie secourue &amp; Climatisation incluses)
                    </span>
                  </div>
                  <span className="text-xs font-black text-rouge-ambra">
                    {formatPriceFCFA(rackUnits * RESOURCE_RATES.rackUnit, false)} / mois
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRackUnits((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5 text-navy" />
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={1}
                      max={42}
                      value={rackUnits}
                      onChange={(e) => setRackUnits(Math.min(42, Math.max(1, e.target.valueAsNumber || 1)))}
                      className="w-full text-center text-[13px] font-black border rounded-lg px-2 py-1 outline-none bg-cream/20 focus:bg-white focus:ring-2 focus:ring-primary-light/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ borderColor: accentColor, color: accentColor }}
                      aria-label="Unités de Rack"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setRackUnits((prev) => Math.min(42, prev + 1))}
                    className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-navy" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-1 flex-wrap">
                  {[
                    { u: 1, label: "1U" },
                    { u: 2, label: "2U" },
                    { u: 4, label: "4U" },
                    { u: 10, label: "10U" },
                    { u: 21, label: "Demi-Baie (21U)" },
                    { u: 42, label: "Baie complète (42U)" },
                  ].map((preset) => (
                    <button
                      key={preset.u}
                      type="button"
                      onClick={() => setRackUnits(preset.u)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        rackUnits === preset.u
                          ? "bg-navy text-white shadow-xs"
                          : "bg-cream/70 text-taupe/70 hover:bg-taupe/15 hover:text-navy"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* GPU Type & Count */}
            {(show("gpu_type") || show("gpu")) && (
              <div className="bg-white p-3.5 rounded-xl border border-taupe/15 shadow-2xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-rouge-ambra" /> Modèle &amp; Nombre de GPU Dédiés
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
                        {formatPriceFCFA(gpu.monthlyPrice, false)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SÉLECTEUR DE SYSTÈME D'EXPLOITATION (OS) : COMPACT ET ÉLÉGANT */}
            {hasCompute && !isColocation && !isObjectStorage && (
              <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-taupe/15 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="p-1 rounded-md bg-navy/5 text-navy">
                    <Server className="w-3.5 h-3.5 text-rouge-ambra" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-navy block leading-tight">
                      Système d&apos;Exploitation (OS)
                    </label>
                    <span className="text-[9.5px] font-extrabold text-emerald-700">
                      ✓ Licences 100% Incluses (0 F HT)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-1 sm:justify-end min-w-0 flex-wrap">
                  {/* Bascule de famille : Linux / Windows */}
                  <div className="flex items-center p-0.5 bg-cream/60 rounded-lg border border-taupe/15 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleFamilyChange("linux")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        osFamily === "linux"
                          ? "bg-navy text-white shadow-xs"
                          : "text-taupe hover:text-navy"
                      }`}
                    >
                      🐧 Linux ({OS_CATALOG.filter((i) => i.family === "linux").length})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFamilyChange("windows")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        osFamily === "windows"
                          ? "bg-rouge-ambra text-white shadow-xs"
                          : "text-taupe hover:text-navy"
                      }`}
                    >
                      🪟 Windows ({OS_CATALOG.filter((i) => i.family === "windows").length})
                    </button>
                  </div>

                  {/* Sélection précise de la distribution ou de l'édition */}
                  <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                    <select
                      value={os}
                      onChange={(e) => setOs(e.target.value)}
                      className="w-full text-xs font-bold bg-cream/30 border border-taupe/20 rounded-lg px-2.5 py-1.5 text-navy outline-none cursor-pointer focus:border-rouge-ambra focus:bg-white shadow-2xs"
                      aria-label="Sélectionner la distribution ou édition"
                    >
                      {OS_CATALOG.filter((item) => item.family === osFamily).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} {item.version ? `(${item.version})` : ""} · Inclus
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 2-Column Resource Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* vCPU (2 à 32 vCPU, à partir de 32 sur devis) */}
              {show("vcpu") && (
                <SliderField
                  label="Processeur (vCPU)"
                  icon={<Cpu className="w-4 h-4 text-primary-light" />}
                  value={Math.min(vcpu, 32)}
                  min={2}
                  max={32}
                  step={2}
                  unit="vCPU"
                  presets={[2, 4, 8, 16, 32]}
                  unitRateText="11 000 FCFA HT / 2 vCPU"
                  subtotalText={formatPriceFCFA(Math.round((vcpu / 2) * RESOURCE_RATES.vcpuPair), false)}
                  footerNote="Au-delà   de 32 vCPU : sur devis"
                  onChange={setVcpu}
                  color={accentColor}
                />
              )}

              {/* RAM (1 500 FCFA / Go, max 64 Go, au-delà sur devis) */}
              {show("ram") && (
                <SliderField
                  label="Mémoire RAM (Go)"
                  icon={<MemoryStick className="w-4 h-4 text-primary-light" />}
                  value={Math.min(ram, 64)}
                  min={2}
                  max={64}
                  step={2}
                  unit="Go"
                  presets={[4, 8, 16, 32, 64]}
                  unitRateText="1 500 FCFA HT / Go"
                  subtotalText={formatPriceFCFA(ram * RESOURCE_RATES.ramPerGb, false)}
                  footerNote="Au-delà de 64 Go : sur devis"
                  onChange={setRam}
                  color={accentColor}
                />
              )}

              {/* CARTE DISQUE 1 : DISQUE SYSTÈME (OS / BOOT) */}
              {show("storage") && !isObjectStorage && (
                <div className="bg-white p-3.5 rounded-xl border border-taupe/15 shadow-2xs flex flex-col justify-between gap-2.5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-emerald-600" />
                        <span>Disque 1 : Système (OS / Boot)</span>
                      </label>
                      <span className="block text-[10px] text-taupe/55 mt-0.5">
                        Partition Boot, Système d&apos;Exploitation &amp; Swap (100 Go min)
                      </span>
                    </div>

                    {/* Sélecteur de technologie Standard vs NVMe pour Disque Système */}
                    <div className="flex items-center gap-1 p-0.5 bg-cream/70 rounded-lg border border-taupe/15">
                      <button
                        type="button"
                        onClick={() => setSystemDiskType("standard")}
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                          systemDiskType === "standard"
                            ? "bg-navy text-white"
                            : "text-taupe hover:text-navy"
                        }`}
                      >
                        Standard (50 F)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSystemDiskType("advanced")}
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                          systemDiskType === "advanced"
                            ? "bg-rouge-ambra text-white"
                            : "text-taupe hover:text-navy"
                        }`}
                      >
                        NVMe (70 F)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Stepper & input direct pour Disque Système */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSystemDisk((prev) => Math.max(100, prev - 50))}
                        className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors cursor-pointer"
                        aria-label="Diminuer disque système"
                      >
                        <Minus className="w-3.5 h-3.5 text-navy" />
                      </button>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={100}
                          max={2000}
                          step={50}
                          value={systemDisk}
                          onChange={(e) => setSystemDisk(Math.max(100, e.target.valueAsNumber || 100))}
                          className="w-full text-center text-[13px] font-black border rounded-lg px-2 py-1 outline-none bg-cream/20 focus:bg-white focus:ring-2 focus:ring-primary-light/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{ borderColor: accentColor, color: accentColor }}
                          aria-label="Disque Système en Go"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setSystemDisk((prev) => Math.min(2000, prev + 50))}
                        className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors cursor-pointer"
                        aria-label="Augmenter disque système"
                      >
                        <Plus className="w-3.5 h-3.5 text-navy" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-[11px]">
                      <div>
                        <span className="font-extrabold text-navy block leading-tight">
                          Disque Système : {systemDisk} Go ({systemDiskType === "advanced" ? "NVMe" : "Standard"})
                        </span>
                        <span className="text-[9.5px] text-emerald-700 font-bold block mt-0.5">
                          ✓ Obligatoire pour le bon fonctionnement de l&apos;OS
                        </span>
                      </div>
                      <span className="font-black text-navy text-right">
                        {formatPriceFCFA(
                          systemDisk * (systemDiskType === "advanced" ? RESOURCE_RATES.storageAdvPerGb : RESOURCE_RATES.storageStdPerGb),
                          false
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      {[100, 200, 300, 500].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSystemDisk(sz)}
                          className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                            systemDisk === sz
                              ? "bg-navy text-white shadow-xs"
                              : "bg-cream/70 text-taupe/70 hover:bg-taupe/15 hover:text-navy"
                          }`}
                        >
                          {sz} Go {sz === 100 ? "(Inclus)" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CARTE DISQUE 2 : DISQUE DE DONNÉES (DATA / APPLICATIF) */}
              {show("storage") && !isObjectStorage && (
                <div className="bg-white p-3.5 rounded-xl border border-taupe/15 shadow-2xs flex flex-col justify-between gap-2.5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-rouge-ambra" />
                        <span>Disque 2 : Données (Data / Applicatif)</span>
                      </label>
                      <span className="block text-[10px] text-taupe/55 mt-0.5">
                        Stockage applicatif dédié, bases de données &amp; fichiers (100 Go min)
                      </span>
                    </div>

                    {/* Sélecteur de technologie Standard vs NVMe pour Disque Données (si actif) */}
                    {hasDataDisk && (
                      <div className="flex items-center gap-1 p-0.5 bg-cream/70 rounded-lg border border-taupe/15">
                        <button
                          type="button"
                          onClick={() => setDataDiskType("standard")}
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                            dataDiskType === "standard"
                              ? "bg-navy text-white"
                              : "text-taupe hover:text-navy"
                          }`}
                        >
                          Standard (50 F)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDataDiskType("advanced")}
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                            dataDiskType === "advanced"
                              ? "bg-rouge-ambra text-white"
                              : "text-taupe hover:text-navy"
                          }`}
                        >
                          NVMe (70 F)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bascule Activer / Désactiver le disque de données */}
                  <div className="flex items-center gap-1.5 p-1 bg-cream/50 rounded-lg border border-taupe/15">
                    <button
                      type="button"
                      onClick={() => setHasDataDisk(true)}
                      className={`flex-1 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${
                        hasDataDisk
                          ? "bg-rouge-ambra text-white shadow-2xs"
                          : "text-taupe/70 hover:text-navy"
                      }`}
                    >
                      ✓ Disque de Données Actif
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasDataDisk(false)}
                      className={`flex-1 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${
                        !hasDataDisk
                          ? "bg-navy text-white shadow-2xs"
                          : "text-taupe/70 hover:text-navy"
                      }`}
                    >
                      Sans disque additionnel (0 Go)
                    </button>
                  </div>

                  {hasDataDisk ? (
                    <div className="space-y-2">
                      {/* Stepper & input direct pour Disque Données */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDataDisk((prev) => Math.max(100, prev - 50))}
                          className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors cursor-pointer"
                          aria-label="Diminuer disque données"
                        >
                          <Minus className="w-3.5 h-3.5 text-navy" />
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min={100}
                            max={10000}
                            step={50}
                            value={dataDisk}
                            onChange={(e) => setDataDisk(Math.max(100, e.target.valueAsNumber || 100))}
                            className="w-full text-center text-[13px] font-black border rounded-lg px-2 py-1 outline-none bg-cream/20 focus:bg-white focus:ring-2 focus:ring-primary-light/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{ borderColor: accentColor, color: accentColor }}
                            aria-label="Disque Données en Go"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setDataDisk((prev) => Math.min(10000, prev + 50))}
                          className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors cursor-pointer"
                          aria-label="Augmenter disque données"
                        >
                          <Plus className="w-3.5 h-3.5 text-navy" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-cream/60 border border-taupe/15 text-[11px]">
                        <div>
                          <span className="font-extrabold text-navy block leading-tight">
                            Capacité Données : {dataDisk >= 1000 ? `${dataDisk / 1000} To` : `${dataDisk} Go`} ({dataDiskType === "advanced" ? "NVMe" : "Standard"})
                          </span>
                          <span className="text-[9.5px] text-taupe/65 font-semibold block mt-0.5">
                            Volume isolé pour vos données métiers &amp; BDD
                          </span>
                        </div>
                        <span className="font-black text-rouge-ambra text-right">
                          {formatPriceFCFA(
                            dataDisk * (dataDiskType === "advanced" ? RESOURCE_RATES.storageAdvPerGb : RESOURCE_RATES.storageStdPerGb),
                            false
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        {[100, 250, 500, 1000, 2000].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setDataDisk(p)}
                            className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                              dataDisk === p
                                ? "bg-rouge-ambra text-white shadow-xs"
                                : "bg-cream/70 text-taupe/70 hover:bg-taupe/15 hover:text-navy"
                            }`}
                          >
                            {p >= 1000 ? `${p / 1000} To` : `${p} Go`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-cream/40 border border-taupe/15 text-center space-y-1">
                      <p className="text-[11px] font-bold text-navy">
                        Aucun disque secondaire sélectionné (0 Go)
                      </p>
                      <p className="text-[10px] text-taupe/60">
                        Vos applications et données seront stockées sur le disque système ({systemDisk} Go).
                      </p>
                    </div>
                  )}

                  {/* Synthèse du stockage total des 2 disques */}
                  <div className="pt-2 border-t border-taupe/15 flex items-center justify-between text-[10.5px] font-bold text-taupe/75">
                    <span>Stockage Total Alloué :</span>
                    <span className="text-navy font-black">
                      {systemDisk + effectiveDataDisk} Go ({formatPriceFCFA(
                        (systemDisk * (systemDiskType === "advanced" ? RESOURCE_RATES.storageAdvPerGb : RESOURCE_RATES.storageStdPerGb)) +
                        (effectiveDataDisk * (dataDiskType === "advanced" ? RESOURCE_RATES.storageAdvPerGb : RESOURCE_RATES.storageStdPerGb)),
                        false
                      )} / mois)
                    </span>
                  </div>
                </div>
              )}

              {/* Cas Stockage d'Objet S3 Souverain */}
              {show("storage") && isObjectStorage && (
                <div className="md:col-span-2 bg-white p-3.5 rounded-xl border border-taupe/15 shadow-2xs flex flex-col justify-between gap-2.5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-primary-light" />
                        <span>Stockage d&apos;Objet S3 Souverain</span>
                      </label>
                      <span className="block text-[10px] text-taupe/55 mt-0.5">
                        {storageType === "advanced" ? `${OBJECT_STORAGE_RATES.advanced} FCFA HT / Go (Avancé)` : `${OBJECT_STORAGE_RATES.standard} FCFA HT / Go (Standard)`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 p-0.5 bg-cream/70 rounded-lg border border-taupe/15">
                      <button
                        type="button"
                        onClick={() => setStorageType("standard")}
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                          storageType === "standard"
                            ? "bg-navy text-white"
                            : "text-taupe hover:text-navy"
                        }`}
                      >
                        Standard (15 F)
                      </button>
                      <button
                        type="button"
                        onClick={() => setStorageType("advanced")}
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                          storageType === "advanced"
                            ? "bg-rouge-ambra text-white"
                            : "text-taupe hover:text-navy"
                        }`}
                      >
                        Avancé (25 F)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setStorage((prev) => Math.max(50, prev - 100))}
                        className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5 text-navy" />
                      </button>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={50}
                          max={20000}
                          step={50}
                          value={storage}
                          onChange={(e) => setStorage(Math.max(50, e.target.valueAsNumber || 50))}
                          className="w-full text-center text-[13px] font-black border rounded-lg px-2 py-1 outline-none bg-cream/20 focus:bg-white focus:ring-2 focus:ring-primary-light/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{ borderColor: accentColor, color: accentColor }}
                          aria-label="Stockage S3"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setStorage((prev) => prev + 100)}
                        className="w-8 h-8 border border-taupe/20 rounded-lg flex items-center justify-center hover:border-taupe/40 bg-cream/30 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-navy" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      {[500, 1000, 2000, 5000].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setStorage(p)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                            storage === p
                              ? "bg-navy text-white"
                              : "bg-cream/70 text-taupe/70 hover:bg-taupe/15 hover:text-navy"
                          }`}
                        >
                          {p >= 1000 ? `${p / 1000} To` : `${p} Go`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Périodicité d'engagement (Pleine largeur, parfaitement centrée) */}
            {show("duration") && (
              <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-taupe/15 shadow-2xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-light shrink-0" />
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-navy block leading-tight">
                        Périodicité d&apos;engagement
                      </label>
                      <span className="text-[10px] text-taupe/60 block mt-0.5">
                        Minimum contractuel : dès 3 mois (Trimestriel)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Facturation trimestrielle ou annuelle
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 3, label: "3 Mois", sub: "Trimestriel (Min)" },
                    { val: 12, label: "12 Mois", sub: "Annuel (-10%)" },
                    { val: 36, label: "36 Mois", sub: "3 Ans (-20%)" },
                  ].map((d) => (
                    <button
                      key={d.val}
                      type="button"
                      onClick={() => setDuration(d.val)}
                      className={`h-full min-h-[54px] p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        duration === d.val
                          ? "border-rouge-ambra bg-rouge-ambra/5 ring-1 ring-rouge-ambra shadow-2xs"
                          : "border-taupe/15 bg-cream/20 hover:border-taupe/40 hover:bg-cream/40"
                      }`}
                    >
                      <span className="block text-[11px] font-black text-navy leading-tight">{d.label}</span>
                      <span className="block text-[9.5px] font-semibold text-taupe/65 mt-1 leading-tight">{d.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* INFOGÉRANCE & ACCOMPAGNEMENT DÉDIÉ (Compact & Lisible) */}
            {hasCompute && (
              <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-taupe/15 shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10.5px] font-black uppercase tracking-wider text-navy flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-rouge-ambra" /> Sérénité &amp; Accompagnement Technique AMBRA
                  </p>
                  <span className="text-[9.5px] text-taupe/60 hidden sm:inline">
                    Support 24/7 &amp; Exploitation certifiée à Abidjan
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* CLOUD-M : INCLUS D'OFFICE PAR DÉFAUT */}
                  <div className="p-2.5 rounded-lg border border-rouge-ambra/30 bg-rouge-ambra/5 text-left flex items-center justify-between gap-2 select-none">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-4 h-4 shrink-0 rounded border border-rouge-ambra bg-rouge-ambra text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-navy truncate block">
                          Cloud Management &amp; Support 24/7
                        </span>
                        <span className="text-[9.5px] text-emerald-700 font-bold block">
                          ✓ Inclus d&apos;office (+20%)
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-rouge-ambra shrink-0">
                      +{formatPriceFCFA(quoteDetails.managementFee, false)}
                    </span>
                  </div>

                  {/* CLOUD-SM : GRISÉ PAR DÉFAUT (Optionnel activable au clic) */}
                  <button
                    type="button"
                    onClick={() => toggleAddon("cloud-sm")}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      addons.includes("cloud-sm")
                        ? "border-navy bg-navy/5 ring-1 ring-navy"
                        : "border-taupe/15 bg-cream/25 hover:border-taupe/35"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center ${
                        addons.includes("cloud-sm") ? "bg-navy border-navy text-white" : "border-taupe/30 bg-white"
                      }`}>
                        {addons.includes("cloud-sm") && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <div className="min-w-0">
                        <span className={`text-[11px] font-bold truncate block ${addons.includes("cloud-sm") ? "text-navy" : "text-taupe/80"}`}>
                          Cybersécurité &amp; Vulnérabilités
                        </span>
                        <span className="text-[9.5px] text-taupe/60 font-semibold block">
                          Scan proactif &amp; durcissement (+10%)
                        </span>
                      </div>
                    </div>
                    <span className={`text-[11px] font-black shrink-0 ${addons.includes("cloud-sm") ? "text-navy" : "text-taupe/60"}`}>
                      {addons.includes("cloud-sm")
                        ? `+${formatPriceFCFA(quoteDetails.securityManagementFee, false)}`
                        : "En option"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ADD-ONS COMPLÉMENTAIRES (Slide horizontal) - Uniquement si ressources serveurs */}
          {hasCompute && (
            <div className="px-4 sm:px-6 py-2.5 border-t border-taupe/15 bg-white shrink-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-navy/80 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rouge-ambra shrink-0" />
                  <span>Options Managées &amp; Cybersécurité Additionnelles</span>
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
                {/* CARTE BANDE PASSANTE DÉDIÉE DIRECTEMENT DANS LE SLIDER */}
                <div
                  className={`shrink-0 w-[240px] flex items-center justify-between gap-2 px-3 py-2 rounded-xl border transition-all duration-150 text-left snap-start ${
                    bandwidth > 1
                      ? "border-rouge-ambra bg-rouge-ambra/5 shadow-2xs ring-1 ring-rouge-ambra/30"
                      : "border-taupe/15 bg-cream/25 hover:border-taupe/35"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-rouge-ambra shrink-0" />
                      <p className="text-[11px] font-bold text-navy truncate leading-tight">
                        Bande Passante Dédiée
                      </p>
                    </div>
                    <p
                      className={`text-[10px] font-extrabold leading-tight mt-0.5 ${
                        bandwidth <= 1 ? "text-emerald-700" : "text-rouge-ambra"
                      }`}
                    >
                      {bandwidth <= 1 ? "✓ 1M Offert (0 F)" : `+${formatPriceFCFA((bandwidth - 1) * 10000, false)}`}
                    </p>
                  </div>

                  {/* Sélecteur de débit en Mbps */}
                  <div className="shrink-0">
                    <select
                      value={bandwidth}
                      onChange={(e) => setBandwidth(Number(e.target.value))}
                      className="text-[10px] font-black bg-white border border-taupe/25 rounded-lg px-1.5 py-1 text-navy outline-none cursor-pointer focus:border-rouge-ambra shadow-2xs"
                      aria-label="Sélectionner le débit"
                    >
                      <option value={1}>1 Mbps (0 F)</option>
                      <option value={2}>2 Mbps (+10k)</option>
                      <option value={5}>5 Mbps (+40k)</option>
                      <option value={10}>10 Mbps (+90k)</option>
                      <option value={20}>20 Mbps (+190k)</option>
                      <option value={50}>50 Mbps (+490k)</option>
                    </select>
                  </div>
                </div>

                {MANAGED_SERVICES_CATALOG.filter(
                  (a) => !a.isPercentage && a.id !== "internet-bandwidth" && a.id !== "backup-snapshots"
                ).map((addon) => {
                  const checked = addons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`shrink-0 w-[240px] flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-150 text-left snap-start cursor-pointer ${
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
                        <p
                          className={`text-[10px] font-extrabold leading-tight mt-0.5 ${
                            addon.unitPrice === 0 ? "text-emerald-700" : "text-rouge-ambra"
                          }`}
                        >
                          {addon.unitPrice === 0
                            ? "✓ Offert / Inclus (0 F)"
                            : addon.id === "backup-acronis-vol"
                            ? "+110 FCFA HT / Go"
                            : `+${formatPriceFCFA(addon.unitPrice, false)}`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FOOTER RÉCAPITULATIF CONFORME AU DEVIS OFFICIEL */}
          <div className="px-4 sm:px-6 py-3 border-t border-taupe/15 flex flex-wrap items-center justify-between gap-3 bg-white shrink-0">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-taupe/60">
                  Total Mensuel HT {instanceCount > 1 ? `(${instanceCount} machines)` : ""}
                </p>
                {instanceCount > 1 && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {formatPriceFCFA(quoteDetails.unitMonthlyTotal, false)} / machine
                  </span>
                )}
                {duration > 1 && effectiveMonthlyTotal > 0 && (
                  <span className="text-[10px] font-bold text-navy bg-cream/70 px-2.5 py-0.5 rounded-full border border-taupe/15">
                    Coût total ({duration} mois) : {formatPriceFCFA(effectiveMonthlyTotal * duration, false)}
                  </span>
                )}
              </div>
              <p className="text-[16px] sm:text-[18px] font-black text-rouge-ambra leading-tight">
                {formatPriceFCFA(effectiveMonthlyTotal, true)}
                <span className="text-[11px] font-semibold text-taupe/60 ml-1">
                  / mois HT
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isValidating}
                className="px-4 py-2.5 bg-cream/50 border border-taupe/20 rounded-xl text-[11px] font-bold uppercase tracking-widest text-taupe/70 hover:text-navy hover:border-navy/30 transition-colors cursor-pointer disabled:opacity-50"
              >
                Fermer
              </button>
              <button
                type="button"
                disabled={isValidating}
                onClick={handleConfirm}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer ${
                  isValidating
                    ? "bg-emerald-600 text-white scale-[1.02]"
                    : "bg-[#1A0F0A] hover:bg-rouge-ambra text-white"
                }`}
              >
                <Check className={`w-4 h-4 stroke-[2.5] ${isValidating ? "stroke-[3] scale-110" : ""}`} />
                <span>{isValidating ? "✓ Ajouté au devis !" : "Valider ma sélection"}</span>
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
  footerNote,
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
  footerNote?: string;
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

        {presets && (
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
        )}

        {footerNote && (
          <p className="text-[9.5px] font-extrabold text-rouge-ambra text-right pt-0.5">
            {footerNote}
          </p>
        )}
      </div>
    </div>
  );
}
