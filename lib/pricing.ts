export interface PricingAddon {
  id: string;
  label: string;
  sub: string;
  monthlyPrice: number; // in FCFA
}

export const MANAGED_ADDONS: PricingAddon[] = [
  { id: "backup",     label: "Sauvegarde managée",      sub: "Protection sans intervention", monthlyPrice: 15000 },
  { id: "monitoring", label: "Supervision & Monitoring", sub: "Veille 24h/24 et 7j/7",      monthlyPrice: 20000 },
  { id: "security",   label: "Sécurité managée",         sub: "Protection Zero Trust & WAF", monthlyPrice: 30000 },
  { id: "ip",         label: "IP Publique dédiée",       sub: "Adresse IP fixe V4/V6",        monthlyPrice: 3500 },
];

export const GPU_MODELS = [
  { id: "rtx4090", name: "NVIDIA RTX 4090 (24 Go VRAM)", monthlyPrice: 165000 },
  { id: "l40s",    name: "NVIDIA L40S (48 Go VRAM)",     monthlyPrice: 425000 },
  { id: "h100",    name: "NVIDIA H100 (80 Go VRAM SXM5)", monthlyPrice: 980000 },
];

export const UNIT_RATES = {
  vcpu: 10000,        // 1 vCPU = 10,000 FCFA / mo (~15 €)
  ram: 2000,          // 1 GB RAM = 2,000 FCFA / mo (~3 €)
  storage: 100,       // 1 GB NVMe = 100 FCFA / mo (~0.15 €)
  objectStorage: 15,  // 1 GB Object Storage = 15 FCFA / mo (~0.023 €)
};

export interface ConfigOptions {
  designation?: string;
  vcpu?: number;
  ram?: number;
  storage?: number;
  duration?: number;
  gpuType?: string;
  gpuCount?: number;
  addons?: string[];
  isObjectStorage?: boolean;
  baseServicePrice?: number;
}

/**
 * Computes monthly price in FCFA for a given configuration
 */
export function calculateConfigPrice(config?: ConfigOptions, fallbackBasePrice: number = 0): number {
  if (!config) return fallbackBasePrice;

  let total = config.baseServicePrice ?? fallbackBasePrice;

  if (config.vcpu) {
    total += config.vcpu * UNIT_RATES.vcpu;
  }

  if (config.ram) {
    total += config.ram * UNIT_RATES.ram;
  }

  if (config.storage) {
    const rate = config.isObjectStorage ? UNIT_RATES.objectStorage : UNIT_RATES.storage;
    total += config.storage * rate;
  }

  if (config.gpuType && config.gpuCount) {
    const gpu = GPU_MODELS.find((g) => g.id === config.gpuType);
    if (gpu) {
      total += gpu.monthlyPrice * config.gpuCount;
    }
  }

  if (config.addons && config.addons.length > 0) {
    config.addons.forEach((addonId) => {
      const addon = MANAGED_ADDONS.find((a) => a.id === addonId);
      if (addon) {
        total += addon.monthlyPrice;
      }
    });
  }

  return Math.max(total, fallbackBasePrice);
}

/**
 * Format price string in FCFA with option for EUR equivalent
 */
export function formatPriceFCFA(amountFCFA: number, includeEur: boolean = true): string {
  if (!amountFCFA || amountFCFA <= 0) return "Sur devis";
  const formattedFCFA = new Intl.NumberFormat("fr-FR").format(Math.round(amountFCFA)) + " FCFA";
  if (!includeEur) return formattedFCFA;
  const eurVal = Math.round(amountFCFA / 655.957);
  return `${formattedFCFA} (~${eurVal} €)`;
}
