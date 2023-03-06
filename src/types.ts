export interface FoeStats {
  vitality: number
  hp: number | string
  speed: number
  dash: number
  defense: number
  fray: number
  damage_die: string
}

export interface FoeData {
  foes: RawFoe[]
  traits: TraitInfo[]
}

export interface RawFoe {
  name: string
  tags?: string[]
  also?: string[]
  traits?: Trait[]
  actions?: Action[]
  stats?: Partial<FoeStats>
}

export interface RawFoeLegend extends RawFoe {
  phases?: Phase[]
  phaseDescription?: string
}

export interface Foe {
  name: string
  tags: string[]
  also: string[]
  traits: Trait[]
  actions: Action[]
  stats: FoeStats
}

export interface FoeLegend extends Foe {
  phases: Phase[]
  phaseDescription: string
}

export interface Phase {
  name: string
  actions: Action[]
  traits: Trait[]
}

export interface Trait {
  name: string
  value?: string
  special?: boolean
}

export interface TraitInfo extends Trait {
  text: string
  altText?: string
}

export interface Action {
  name: string
  cost: 'free' | 'light' | 'heavy' | 'Interrupt 1' | 'Interrupt 2' | 'Interrupt 3' | 'movement'
  tags: string[]
  text: string
  altText?: string
}
