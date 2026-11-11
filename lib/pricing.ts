export interface PricingAddon {
  id: string;
  code: string;
  label: string;
  description: string;
  unit: string;
  unitPrice: number; // in FCFA HT
  category: "management" | "security" | "backup" | "network" | "ssl";
  isPercentage?: boolean;
  percentageRate?: number; // e.g. 0.20 for 20%
}

// ── Tarifs de base des ressources (Bloc 1) ─────────────────────────
export const RESOURCE_RATES = {
  vcpuPair: 11000,          // AMC-CPU : 2 vCPU = 11 000 FCFA HT / mois (5 500 FCFA / vCPU)
  ramPerGb: 1500,           // AMC-RAM : 1 Go RAM = 1 500 FCFA HT / mois
  storageStdPerGb: 50,      // AMC-STK Standard = 50 FCFA HT / Go / mois
  storageAdvPerGb: 70,      // AMC-STK Avancé NVMe = 70 FCFA HT / Go / mois
  gpuVramPerGb: 20000,      // AMC-GPU : 1 Go VRAM GPU = 20 000 FCFA HT / mois
  rackUnit: 35000,          // AMC-RCK : 1U Baie Datacenter = 35 000 FCFA HT / mois
  bandwidthExtraPerMbps: 10000, // 10 000 FCFA HT / Méga supplémentaire par mois
  bandwidthIncludedMbps: 1,     // 1 Méga offert inclus (0 FCFA)
};

// ── Tarifs Stockage Objet S3 (Bloc 2) ──────────────────────────────
export const OBJECT_STORAGE_RATES = {
  standard: 15,             // Stockage Objet Standard = 15 FCFA HT / Go / mois
  advanced: 25,             // Stockage Objet Avancé = 25 FCFA HT / Go / mois
};

// ── Options et Services Managés (Bloc 3) ───────────────────────────
export const MANAGED_SERVICES_CATALOG: PricingAddon[] = [
  {
    id: "cloud-m",
    code: "CLOUD-M",
    label: "Cloud Management (Support & Exploitation 24/7)",
    description: "Cloud Management complet de l’infrastructure Cloud, Support et Assistance 24h/24 et 7j/7",
    unit: "20% des ressources",
    unitPrice: 0,
    category: "management",
    isPercentage: true,
    percentageRate: 0.20,
  },
  {
    id: "cloud-sm",
    code: "CLOUD-SM",
    label: "Cloud Security Management",
    description: "Cloud Management + Gestion des Vulnérabilités Internes et Externes",
    unit: "10% des ressources",
    unitPrice: 0,
    category: "security",
    isPercentage: true,
    percentageRate: 0.10,
  },
  {
    id: "cloud-monitor",
    code: "CLOUD-MONITOR",
    label: "Cloud Monitoring Managé",
    description: "Supervision managée avec ME Site24x7 Pack Starter (lot de 10 moniteurs)",
    unit: "Lot de 10 moniteurs",
    unitPrice: 8000,
    category: "management",
  },
  {
    id: "backup-snapshots",
    code: "CLOUD-BUP-CS",
    label: "Sauvegarde Snapshots Cloud (Synology C2)",
    description: "Sauvegarde managée avec rétention automatisée",
    unit: "10 FCFA / Go / mois",
    unitPrice: 10,
    category: "backup",
  },
  {
    id: "backup-acronis-vol",
    code: "CLOUD-BUP-VOL",
    label: "Sauvegarde Acronis (par Volume)",
    description: "Sauvegarde Acronis au volume de données protégées",
    unit: "110 FCFA HT / Go / mois",
    unitPrice: 110,
    category: "backup",
  },
  {
    id: "backup-acronis-vm",
    code: "CLOUD-BUP-ACW",
    label: "Sauvegarde Acronis (Machine seule)",
    description: "Sauvegarde managée de l'instance/machine virtuelle seule avec agent Acronis",
    unit: "10 000 FCFA HT / VM / mois",
    unitPrice: 10000,
    category: "backup",
  },
  {
    id: "backup-acronis-complete",
    code: "CLOUD-BUP-ALL",
    label: "Sauvegarde Acronis (Prise en charge intégrale)",
    description: "Sauvegarde complète tout compris : système, volumes, rétention et restauration assistée 24/7",
    unit: "27 000 FCFA HT / VM / mois",
    unitPrice: 27000,
    category: "backup",
  },
  {
    id: "waf-basic",
    code: "CBW-W-SEC-B",
    label: "WAF Cloudflare Free (Offert)",
    description: "Protection applicative WAF managée avec Cloudflare Free et audit de sécurité annuel",
    unit: "Offert / Inclus",
    unitPrice: 0,
    category: "security",
  },
  {
    id: "waf-advanced-cf",
    code: "CBW-W-SEC-AC",
    label: "WAF Cloudflare Pro",
    description: "WAF managé avec Cloudflare Pro, règles de protection avancées et audit trimestriel",
    unit: "Par application / mois",
    unitPrice: 35000,
    category: "security",
  },
  {
    id: "endpoint-protect",
    code: "CBW-CPA",
    label: "Cyberwize Endpoint Protection (Harmony)",
    description: "Sécurité endpoint managée avec Harmony Endpoint Protect",
    unit: "Par poste / mois",
    unitPrice: 1700,
    category: "security",
  },
  {
    id: "ztna-user",
    code: "CBW-ZTNA-C",
    label: "Cyberwize ZTNA Complete (Accès distant sécurisé)",
    description: "Accès Zero Trust réseau sécurisé par utilisateur",
    unit: "Par utilisateur / mois",
    unitPrice: 5000,
    category: "security",
  },
  {
    id: "ztna-gateway",
    code: "CP-SASE-GW-Y",
    label: "Passerelle ZTNA Cloud Edge Gateway",
    description: "Passerelle Cloud Edge SASE dédiée",
    unit: "Par passerelle / mois",
    unitPrice: 40000,
    category: "security",
  },
  {
    id: "internet-bandwidth",
    code: "S-DC-INT",
    label: "Bande Passante Internet Dédiée",
    description: "Liaison Internet dédiée très haut débit en Datacenter (1 Mbps offert inclus, puis 10 000 FCFA HT / Mbps supplémentaire)",
    unit: "10 000 FCFA HT / Mbps (1 Mbps offert)",
    unitPrice: 10000,
    category: "network",
  },
];

// Alias pour compatibilité
export const MANAGED_ADDONS = MANAGED_SERVICES_CATALOG;

// ── Modèles GPU (avec calcul en Go VRAM x 20 000 FCFA) ───────────────
export const GPU_MODELS = [
  { id: "rtx4090", name: "NVIDIA RTX 4090 (24 Go VRAM)", vram: 24, monthlyPrice: 24 * RESOURCE_RATES.gpuVramPerGb },
  { id: "l40s",    name: "NVIDIA L40S (48 Go VRAM)",     vram: 48, monthlyPrice: 48 * RESOURCE_RATES.gpuVramPerGb },
  { id: "h100",    name: "NVIDIA H100 (80 Go VRAM SXM5)", vram: 80, monthlyPrice: 80 * RESOURCE_RATES.gpuVramPerGb },
];

// Rétrocompatibilité UNIT_RATES
export const UNIT_RATES = {
  vcpu: RESOURCE_RATES.vcpuPair / 2, // 5 500 FCFA / vCPU
  ram: RESOURCE_RATES.ramPerGb,      // 1 500 FCFA / Go
  storage: RESOURCE_RATES.storageStdPerGb, // 50 FCFA / Go
  storageAdv: RESOURCE_RATES.storageAdvPerGb, // 70 FCFA / Go
  objectStorage: OBJECT_STORAGE_RATES.standard, // 15 FCFA / Go
  objectStorageAdv: OBJECT_STORAGE_RATES.advanced, // 25 FCFA / Go
};

// ── Catalogue des Systèmes d'Exploitation (OS) 100% Inclus / Offerts (0 FCFA) ──
export interface OsOption {
  id: string;
  name: string;
  family: "linux" | "windows";
  version: string;
  price: number; // 0 FCFA HT
  badge: string;
}

export const OS_CATALOG: OsOption[] = [
  // ── Famille Linux ──
  { id: "ubuntu-24", name: "Ubuntu 24.04 LTS", family: "linux", version: "Noble Numbat (64-bit)", price: 0, badge: "Inclus (0 F)" },
  { id: "ubuntu-22", name: "Ubuntu 22.04 LTS", family: "linux", version: "Jammy Jellyfish (64-bit)", price: 0, badge: "Inclus (0 F)" },
  { id: "debian-12", name: "Debian 12 Bookworm", family: "linux", version: "Stable Official (64-bit)", price: 0, badge: "Inclus (0 F)" },
  { id: "debian-11", name: "Debian 11 Bullseye", family: "linux", version: "Legacy Stable (64-bit)", price: 0, badge: "Inclus (0 F)" },
  { id: "almalinux-9", name: "AlmaLinux 9", family: "linux", version: "100% Compatible RHEL 9", price: 0, badge: "Inclus (0 F)" },
  { id: "rocky-9",   name: "Rocky Linux 9", family: "linux", version: "Enterprise Linux RHEL 9", price: 0, badge: "Inclus (0 F)" },
  { id: "centos-9",  name: "CentOS Stream 9", family: "linux", version: "Red Hat Upstream (64-bit)", price: 0, badge: "Inclus (0 F)" },

  // ── Famille Windows Server ──
  { id: "win-2025",  name: "Windows Server 2025 Standard", family: "windows", version: "Dernière Édition 2025 (64-bit)", price: 0, badge: "Inclus (0 F)" },
  { id: "win-2025-dc", name: "Windows Server 2025 Datacenter", family: "windows", version: "Édition Datacenter 2025", price: 0, badge: "Inclus (0 F)" },
  { id: "win-2022",  name: "Windows Server 2022 Standard", family: "windows", version: "Édition Standard Long-Term", price: 0, badge: "Inclus (0 F)" },
  { id: "win-2022-dc", name: "Windows Server 2022 Datacenter", family: "windows", version: "Édition Datacenter 2022", price: 0, badge: "Inclus (0 F)" },
  { id: "win-2019",  name: "Windows Server 2019 Standard", family: "windows", version: "Édition Standard 2019", price: 0, badge: "Inclus (0 F)" },
];

export interface ConfigOptions {
  designation?: string;
  instanceCount?: number;      // Nombre de machines / instances identiques (défaut 1)
  os?: string;                 // OS sélectionné (Ubuntu, Debian, Windows Server 2025...)
  vcpu?: number;               // Recommandé par multiple de 2 (2, 4, 6, 8, 16...)
  ram?: number;                // Go
  storage?: number;            // Go total (ou systemDisk + dataDisk)
  systemDisk?: number;         // Disque Système OS (100 Go min inclus de base)
  systemDiskType?: "standard" | "advanced"; // Type de disque Système (50 F vs 70 F)
  dataDisk?: number;           // Disque de données additionnel (0 ou >= 100 Go)
  dataDiskType?: "standard" | "advanced";   // Type de disque Données (50 F vs 70 F)
  storageType?: "standard" | "advanced"; // Rétrocompatibilité Standard 50 F vs Avancé NVMe 70 F
  bandwidth?: number;          // Débit en Mbps (1 Mbps inclus offert, 10 000 FCFA HT / Mbps au-delà)
  rackUnits?: number;          // Nombre de U en baie (35 000 FCFA HT / U)
  duration?: number;           // En mois (Trimestriel 3 mois minimum)
  gpuType?: string;
  gpuCount?: number;
  gpuVram?: number;            // Go VRAM
  addons?: string[];           // IDs des services cochés
  isObjectStorage?: boolean;
  objectStorageTier?: "standard" | "advanced";
  baseServicePrice?: number;
}

export interface QuoteItemDetail {
  label: string;
  sublabel?: string;
  quantity?: string | number;
  unitPriceText?: string;
  totalPrice: number;
  isIncluded?: boolean;
}

export interface DetailedQuoteCalculation {
  computeSubtotal: number;       // CPU + RAM + Stockage + GPU (pour toutes les instances)
  unitComputeSubtotal: number;   // CPU + RAM + Stockage + GPU par machine
  managementFee: number;         // CLOUD-M (20% si sélectionné)
  securityManagementFee: number; // CLOUD-SM (10% si sélectionné)
  fixedAddonsTotal: number;      // Total des options fixes (Supervision, Sauvegarde, WAF...)
  monthlyTotal: number;          // Total mensuel HT
  unitMonthlyTotal: number;      // Total mensuel HT par machine
  instanceCount: number;         // Nombre d'instances
  duration: number;              // Durée d'engagement (3, 12, 36)
  quarterlyTotal: number;        // Trimestriel (x3)
  annualTotal: number;           // Annuel (x12)
  itemsBreakdown: QuoteItemDetail[]; // Postes de coûts unitaires détaillés
}

/**
 * Calcul officiel et complet d'une configuration AMBRA Cloud
 */
export function calculateDetailedQuote(config?: ConfigOptions): DetailedQuoteCalculation {
  if (!config) {
    return {
      computeSubtotal: 0,
      unitComputeSubtotal: 0,
      managementFee: 0,
      securityManagementFee: 0,
      fixedAddonsTotal: 0,
      monthlyTotal: 0,
      unitMonthlyTotal: 0,
      instanceCount: 1,
      duration: 3,
      quarterlyTotal: 0,
      annualTotal: 0,
      itemsBreakdown: [],
    };
  }

  const instanceCount = Math.max(1, config.instanceCount || 1);
  const duration = config.duration || 3;
  let unitComputeSubtotal = 0;
  const itemsBreakdown: QuoteItemDetail[] = [];

  // OS sélectionné
  if (config.os) {
    const foundOs = OS_CATALOG.find((o) => o.id === config.os);
    itemsBreakdown.push({
      label: "Système d'Exploitation (OS)",
      sublabel: foundOs ? `${foundOs.name} (${foundOs.version})` : config.os,
      unitPriceText: "Licence 100% incluse",
      totalPrice: 0,
      isIncluded: true,
    });
  }

  // 1. Stockage Objet pur
  if (config.isObjectStorage) {
    const s3Rate = config.objectStorageTier === "advanced" 
      ? OBJECT_STORAGE_RATES.advanced 
      : OBJECT_STORAGE_RATES.standard;
    const s3Gb = config.storage || 1000;
    const s3Cost = s3Gb * s3Rate;
    unitComputeSubtotal += s3Cost;
    itemsBreakdown.push({
      label: "Stockage d'Objet S3 Souverain",
      sublabel: `${s3Gb} Go (${config.objectStorageTier === "advanced" ? "Avancé NVMe" : "Standard"})`,
      unitPriceText: `${s3Rate} FCFA HT / Go / mois`,
      totalPrice: s3Cost,
    });
  } else {
    // 2. Compute vCPU (par paire de 2 vCPU à 11 000 FCFA, ou proportionnel)
    if (config.vcpu) {
      const vcpuCost = Math.round((config.vcpu / 2) * RESOURCE_RATES.vcpuPair);
      unitComputeSubtotal += vcpuCost;
      itemsBreakdown.push({
        label: "Processeur (vCPU)",
        sublabel: `${config.vcpu} vCPU (${config.vcpu / 2} paire${config.vcpu > 2 ? "s" : ""})`,
        unitPriceText: "11 000 FCFA HT / 2 vCPU",
        totalPrice: vcpuCost,
      });
    }

    // 3. RAM (1 500 FCFA / Go)
    if (config.ram) {
      const ramCost = config.ram * RESOURCE_RATES.ramPerGb;
      unitComputeSubtotal += ramCost;
      itemsBreakdown.push({
        label: "Mémoire RAM",
        sublabel: `${config.ram} Go RAM dédiée`,
        unitPriceText: "1 500 FCFA HT / Go",
        totalPrice: ramCost,
      });
    }

    // 4. Stockage Bloc : Disque 1 Système (OS) + Disque 2 Données (Data)
    const effectiveSysType = config.systemDiskType || config.storageType || "standard";
    const systemRate = effectiveSysType === "advanced" 
      ? RESOURCE_RATES.storageAdvPerGb 
      : RESOURCE_RATES.storageStdPerGb;
    const systemTypeLabel = effectiveSysType === "advanced" ? "NVMe Haute Performance" : "Standard SSD";

    const systemDiskGb = config.systemDisk !== undefined ? config.systemDisk : 100;
    const systemDiskCost = systemDiskGb * systemRate;
    unitComputeSubtotal += systemDiskCost;
    itemsBreakdown.push({
      label: "Disque 1 : Disque Système (OS / Boot)",
      sublabel: `${systemDiskGb} Go (${systemTypeLabel}) · Partition Système & Swap`,
      unitPriceText: `${systemRate} FCFA HT / Go`,
      totalPrice: systemDiskCost,
    });

    const effectiveDataType = config.dataDiskType || config.storageType || "standard";
    const dataRate = effectiveDataType === "advanced" 
      ? RESOURCE_RATES.storageAdvPerGb 
      : RESOURCE_RATES.storageStdPerGb;
    const dataTypeLabel = effectiveDataType === "advanced" ? "NVMe Haute Performance" : "Standard SSD";

    const dataDiskGb = config.dataDisk !== undefined 
      ? config.dataDisk 
      : (config.storage && config.storage > systemDiskGb ? config.storage - systemDiskGb : 0);
    
    if (dataDiskGb > 0) {
      const dataDiskCost = dataDiskGb * dataRate;
      unitComputeSubtotal += dataDiskCost;
      itemsBreakdown.push({
        label: "Disque 2 : Disque de Données (Data)",
        sublabel: `${dataDiskGb >= 1000 ? `${dataDiskGb / 1000} To` : `${dataDiskGb} Go`} (${dataTypeLabel}) · Stockage Applicatif & Bases`,
        unitPriceText: `${dataRate} FCFA HT / Go`,
        totalPrice: dataDiskCost,
      });
    }

    // 5. GPU VRAM (20 000 FCFA / Go)
    if (config.gpuType && config.gpuCount) {
      const gpu = GPU_MODELS.find((g) => g.id === config.gpuType);
      if (gpu) {
        const gpuCost = gpu.monthlyPrice * config.gpuCount;
        unitComputeSubtotal += gpuCost;
        itemsBreakdown.push({
          label: "Accélération GPU Dédiée IA",
          sublabel: `${config.gpuCount}x NVIDIA ${gpu.name}`,
          unitPriceText: `${formatPriceFCFA(gpu.monthlyPrice, false)} / GPU`,
          totalPrice: gpuCost,
        });
      }
    } else if (config.gpuVram) {
      const gpuCost = config.gpuVram * RESOURCE_RATES.gpuVramPerGb;
      unitComputeSubtotal += gpuCost;
      itemsBreakdown.push({
        label: "VRAM GPU",
        sublabel: `${config.gpuVram} Go VRAM`,
        unitPriceText: "20 000 FCFA HT / Go",
        totalPrice: gpuCost,
      });
    }

    // 5b. Colocation Rack Units (35 000 FCFA / U)
    if (config.rackUnits) {
      const rackCost = config.rackUnits * RESOURCE_RATES.rackUnit;
      unitComputeSubtotal += rackCost;
      itemsBreakdown.push({
        label: "Emplacement Baie Datacenter Raxio Tier III",
        sublabel: `${config.rackUnits}U (Énergie & Climatisation incluses)`,
        unitPriceText: "35 000 FCFA HT / U",
        totalPrice: rackCost,
      });
    }

    // 5c. Bande passante Internet Dédiée (1 Mbps offert inclus, 10 000 FCFA HT / Mbps au-delà)
    const bw = config.bandwidth !== undefined ? config.bandwidth : 1;
    const extraBw = Math.max(0, bw - RESOURCE_RATES.bandwidthIncludedMbps);
    const bwCost = extraBw * RESOURCE_RATES.bandwidthExtraPerMbps;
    unitComputeSubtotal += bwCost;
    itemsBreakdown.push({
      label: "Bande Passante Internet Dédiée",
      sublabel: `${bw} Mbps (${bw <= 1 ? "1 Mbps offert inclus" : `1 Mbps offert + ${extraBw} Mbps supplémentaire${extraBw > 1 ? "s" : ""}`})`,
      unitPriceText: extraBw > 0 ? "10 000 FCFA HT / Mbps supplémentaire" : "Offert (0 F)",
      totalPrice: bwCost,
      isIncluded: extraBw === 0,
    });
  }

  // Sous-total compute pour l'ensemble des machines
  const computeSubtotal = unitComputeSubtotal * instanceCount;

  // 6. Services managés
  let managementFee = 0;
  let securityManagementFee = 0;
  let fixedAddonsTotal = 0;

  const selectedAddons = config.addons || [];

  selectedAddons.forEach((addonId) => {
    const addon = MANAGED_SERVICES_CATALOG.find((a) => a.id === addonId || a.code === addonId);
    if (!addon) return;

    if (addon.code === "CLOUD-M") {
      const fee = Math.round(computeSubtotal * 0.20);
      managementFee += fee;
      itemsBreakdown.push({
        label: "Cloud Management & Support 24/7 (CLOUD-M)",
        sublabel: "Supervision proactive 24/7, MCO & infogérance certifiée",
        unitPriceText: "+20% ressources",
        totalPrice: Math.round(unitComputeSubtotal * 0.20),
      });
    } else if (addon.code === "CLOUD-SM") {
      const fee = Math.round(computeSubtotal * 0.10);
      securityManagementFee += fee;
      itemsBreakdown.push({
        label: "Cyberwize Security Management (CLOUD-SM)",
        sublabel: "Scan des vulnérabilités internes/externes & durcissement OS",
        unitPriceText: "+10% ressources",
        totalPrice: Math.round(unitComputeSubtotal * 0.10),
      });
    } else {
      // Options par machine (comme Acronis VM) vs options fixes par tenant
      const isPerVmAddon = addon.id === "backup-acronis-vm" || addon.id === "backup-acronis-complete";
      const addonCost = addon.unitPrice * (isPerVmAddon ? instanceCount : 1);
      fixedAddonsTotal += addonCost;
      itemsBreakdown.push({
        label: addon.label,
        sublabel: addon.description,
        unitPriceText: `${formatPriceFCFA(addon.unitPrice, false)} / mois`,
        totalPrice: addon.unitPrice,
      });
    }
  });

  const monthlyTotal = computeSubtotal + managementFee + securityManagementFee + fixedAddonsTotal;
  const unitMonthlyTotal = Math.round(monthlyTotal / instanceCount);
  const quarterlyTotal = monthlyTotal * 3;
  const annualTotal = monthlyTotal * 12;

  return {
    computeSubtotal,
    unitComputeSubtotal,
    managementFee,
    securityManagementFee,
    fixedAddonsTotal,
    monthlyTotal,
    unitMonthlyTotal,
    instanceCount,
    duration,
    quarterlyTotal,
    annualTotal,
    itemsBreakdown,
  };
}

/**
 * Calcul direct du prix mensuel HT (rétrocompatibilité)
 */
export function calculateConfigPrice(config?: ConfigOptions, fallbackBasePrice: number = 0): number {
  if (!config) return fallbackBasePrice;
  const details = calculateDetailedQuote(config);
  return details.monthlyTotal > 0 ? details.monthlyTotal : fallbackBasePrice;
}

/**
 * Formate un montant en FCFA HT (sans conversion en euro)
 */
export function formatPriceFCFA(amountFCFA: number, _includeEur: boolean = false): string {
  if (!amountFCFA || amountFCFA <= 0) return "Sur devis";
  return new Intl.NumberFormat("fr-FR").format(Math.round(amountFCFA)) + " FCFA HT";
}
