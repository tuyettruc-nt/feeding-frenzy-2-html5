/**
 * Core game rules and pure logic for Feeding Frenzy clone.
 * Decoupled from rendering for fast unit testing and determinism.
 */

export interface FishSpeciesDef {
  id: string;
  name: string;
  title: string;
  description: string;
  baseRadius: number;
  speed: number;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    belly: string;
    fin: string;
  };
  stages: {
    stage: number;
    radius: number;
    requiredPoints: number;
    name: string;
  }[];
}

export const SPECIES: FishSpeciesDef[] = [
  {
    id: 'boris',
    name: 'Boris',
    title: 'Butterflyfish',
    description: 'Small, agile reef fish with delicate fins and sharp senses.',
    baseRadius: 18,
    speed: 320,
    colorScheme: {
      primary: '#facc15',
      secondary: '#0f172a',
      accent: '#ffffff',
      belly: '#fef08a',
      fin: '#eab308'
    },
    stages: [
      { stage: 1, radius: 18, requiredPoints: 300, name: 'Tiny Butterfly' },
      { stage: 2, radius: 26, requiredPoints: 750, name: 'Swift Butterfly' },
      { stage: 3, radius: 36, requiredPoints: 1400, name: 'Master Boris' }
    ]
  },
  {
    id: 'layla',
    name: 'Layla',
    title: 'Triggerfish',
    description: 'Medium-sized predator with explosive acceleration and tough armor.',
    baseRadius: 28,
    speed: 340,
    colorScheme: {
      primary: '#38bdf8',
      secondary: '#f43f5e',
      accent: '#fbbf24',
      belly: '#bae6fd',
      fin: '#0284c7'
    },
    stages: [
      { stage: 1, radius: 28, requiredPoints: 600, name: 'Young Trigger' },
      { stage: 2, radius: 38, requiredPoints: 1300, name: 'Reef Hunter' },
      { stage: 3, radius: 50, requiredPoints: 2200, name: 'Apex Layla' }
    ]
  },
  {
    id: 'edie',
    name: 'Edie',
    title: 'Anglerfish',
    description: 'Deep-sea dweller equipped with a glowing bioluminescent lure.',
    baseRadius: 36,
    speed: 310,
    colorScheme: {
      primary: '#475569',
      secondary: '#06b6d4',
      accent: '#22d3ee',
      belly: '#334155',
      fin: '#1e293b'
    },
    stages: [
      { stage: 1, radius: 36, requiredPoints: 900, name: 'Abyssal Angler' },
      { stage: 2, radius: 48, requiredPoints: 1900, name: 'Glow Stalker' },
      { stage: 3, radius: 64, requiredPoints: 3200, name: 'Deep Sovereign' }
    ]
  },
  {
    id: 'peter',
    name: 'Peter',
    title: 'Parrotfish',
    description: 'Balanced maneuverability with beak-like jaws that crush coral prey.',
    baseRadius: 42,
    speed: 330,
    colorScheme: {
      primary: '#10b981',
      secondary: '#ec4899',
      accent: '#06b6d4',
      belly: '#a7f3d0',
      fin: '#059669'
    },
    stages: [
      { stage: 1, radius: 42, requiredPoints: 1200, name: 'Coral Forager' },
      { stage: 2, radius: 56, requiredPoints: 2600, name: 'Heavy Beak' },
      { stage: 3, radius: 74, requiredPoints: 4400, name: 'Emperor Peter' }
    ]
  },
  {
    id: 'harry',
    name: 'Harry',
    title: 'Humphead Wrasse',
    description: 'Heavy-built giant with a prominent hump and an insatiable appetite.',
    baseRadius: 52,
    speed: 300,
    colorScheme: {
      primary: '#2563eb',
      secondary: '#14b8a6',
      accent: '#f59e0b',
      belly: '#93c5fd',
      fin: '#1d4ed8'
    },
    stages: [
      { stage: 1, radius: 52, requiredPoints: 1800, name: 'Young Giant' },
      { stage: 2, radius: 70, requiredPoints: 3800, name: 'Wrasse Bruiser' },
      { stage: 3, radius: 90, requiredPoints: 6200, name: 'Reef Titan Harry' }
    ]
  },
  {
    id: 'goliath',
    name: 'Goliath',
    title: 'Great White Shark',
    description: 'The ultimate apex predator of the ocean abyss. Feared by all.',
    baseRadius: 65,
    speed: 360,
    colorScheme: {
      primary: '#64748b',
      secondary: '#dc2626',
      accent: '#f8fafc',
      belly: '#f1f5f9',
      fin: '#475569'
    },
    stages: [
      { stage: 1, radius: 65, requiredPoints: 2500, name: 'Apex Stalker' },
      { stage: 2, radius: 88, requiredPoints: 5500, name: 'White Death' },
      { stage: 3, radius: 115, requiredPoints: 9000, name: 'GOLIATH THE APEX' }
    ]
  }
];

export interface ComboTier {
  name: string;
  multiplier: number;
  threshold: number;
  pitchOffset: number;
}

export const COMBO_TIERS: ComboTier[] = [
  { name: 'Normal', multiplier: 1, threshold: 0, pitchOffset: 0 },
  { name: 'Feeding Frenzy!', multiplier: 2, threshold: 5, pitchOffset: 2 },
  { name: 'Double Frenzy!', multiplier: 3, threshold: 10, pitchOffset: 4 },
  { name: 'Super Frenzy!', multiplier: 5, threshold: 16, pitchOffset: 7 }
];

/**
 * Returns whether player can eat target based on relative radius and active shrink debuff on predators.
 */
export function canEat(playerRadius: number, targetRadius: number, isTargetShrunk: boolean = false): boolean {
  const effectiveTargetRadius = isTargetShrunk ? targetRadius * 0.5 : targetRadius;
  // Player can eat fish strictly smaller than player radius * 0.95
  return playerRadius >= effectiveTargetRadius * 1.05;
}

/**
 * Determine combo tier based on active combo counter.
 */
export function getComboTier(comboCount: number): ComboTier {
  for (let i = COMBO_TIERS.length - 1; i >= 0; i--) {
    if (comboCount >= COMBO_TIERS[i].threshold) {
      return COMBO_TIERS[i];
    }
  }
  return COMBO_TIERS[0];
}

/**
 * Calculates score earned for eating a fish.
 */
export function calculateFishScore(targetRadius: number, comboMultiplier: number): number {
  const base = Math.max(10, Math.round(targetRadius * 3.5));
  return base * comboMultiplier;
}

/**
 * Checks circular bounding collision with margin.
 */
export function circlesOverlap(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number,
  safetyRatio = 0.85
): boolean {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const distSq = dx * dx + dy * dy;
  const radiusSum = (r1 + r2) * safetyRatio;
  return distSq <= radiusSum * radiusSum;
}

/**
 * Calculates growth progress ratio [0..1] and if growth stage increases.
 */
export function getGrowthProgress(currentExp: number, reqExp: number): number {
  if (reqExp <= 0) return 1;
  return Math.min(1, Math.max(0, currentExp / reqExp));
}

/**
 * Calculate distance between two points.
 */
export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

export interface LevelHeroMapping {
  id: string;
  name: string;
  title: string;
  spriteKey: string;
}

/**
 * Returns the exact hero species for each of the 60 levels according to Feeding Frenzy 2:
 * 1. Boris (Butterflyfish): Levels 1–8 & 58–60
 * 2. Layla (Triggerfish): Levels 9–16 & 55–57
 * 3. Edie (Anglerfish): Levels 17–21 & 52–54
 * 4. Peter (Parrotfish): Levels 22–29 & 49–51
 * 5. Harry (Humphead Wrasse): Levels 30–37 & 46–48
 * 6. Goliath (Great White Shark): Levels 38–45
 */
export function getHeroForLevel(level: number): LevelHeroMapping {
  const lvl = Math.max(1, Math.min(60, Math.floor(level)));
  if ((lvl >= 1 && lvl <= 8) || (lvl >= 58 && lvl <= 60)) {
    return { id: 'boris', name: 'Boris', title: 'Butterflyfish', spriteKey: 'boris' };
  } else if ((lvl >= 9 && lvl <= 16) || (lvl >= 55 && lvl <= 57)) {
    return { id: 'layla', name: 'Layla', title: 'Triggerfish', spriteKey: 'layla' };
  } else if ((lvl >= 17 && lvl <= 21) || (lvl >= 52 && lvl <= 54)) {
    return { id: 'edie', name: 'Edie', title: 'Anglerfish', spriteKey: 'edie' };
  } else if ((lvl >= 22 && lvl <= 29) || (lvl >= 49 && lvl <= 51)) {
    return { id: 'peter', name: 'Peter', title: 'Parrotfish', spriteKey: 'peter' };
  } else if ((lvl >= 30 && lvl <= 37) || (lvl >= 46 && lvl <= 48)) {
    return { id: 'harry', name: 'Harry', title: 'Humphead Wrasse', spriteKey: 'harry' };
  } else {
    // 38 to 45
    return { id: 'goliath', name: 'Goliath', title: 'Great White Shark', spriteKey: 'goliath' };
  }
}
