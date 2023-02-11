import Data from './foe_data.json'

import { Foe, FoeData, FoeLegend, FoeStats, RawFoe, RawFoeLegend, TraitInfo } from './types'

const FOE_DATA = Data as FoeData

const enemyMap = new Map<string, Foe>()

function mergeInItems<T extends { name: string, value?: string }>(current: T[], adding: T[]) {
  for (const item of adding) {
    const existingItem = current.find((existing) => existing.name === item.name)

    if (!existingItem) {
      current.unshift(item)
    } else if (existingItem.value) {
      if (!item.value) {
        throw new Error(`Items mismatching value-having status: ${item.name}`)
      }

      existingItem.value = existingItem.value < item.value ? item.value : existingItem.value
    }
  }
}

function mergeLists(a: string[], b: string[]) {
  const set = new Set(a)
  b.forEach((i) => set.add(i))

  return Array.from(set)
}

export function produceFoe(rawFoe: RawFoe, strict = true): [Foe, string[]] {
  const newFoe = {
    name: rawFoe.name,
    tags: (rawFoe.tags || []).slice(),
    also: rawFoe.also || [],
    traits: (rawFoe.traits || []).slice(),
    actions: (rawFoe.actions || []).slice(),
    stats: {} as Partial<FoeStats>,
  }

  const errors = []

  const parents = rawFoe.also || []

  // Building up path
  for (const parent of parents) {
    const prevFoe = enemyMap.get(parent)

    if (!prevFoe) {
      const error = `Cannot find previous foe: ${parent}`
      if (strict) {
        throw new Error(error)
      }
      errors.push(error)
      continue
    }

    Object.assign(newFoe.stats, prevFoe.stats)
  }

  // Copy current stats
  Object.assign(newFoe.stats, rawFoe.stats || {})

  parents.reverse()

  // Building up path
  for (const parent of parents) {
    const prevFoe = enemyMap.get(parent)

    if (!prevFoe) {
      const error = `Cannot find previous foe: ${parent}`
      if (strict) {
        throw new Error(error)
      }
      errors.push(error)
      continue
    }

    newFoe.tags = mergeLists(newFoe.tags, prevFoe.tags)
    mergeInItems(newFoe.traits, prevFoe.traits)
    mergeInItems(newFoe.actions, prevFoe.actions)
  }

  if (!newFoe.stats.vitality && !newFoe.tags.includes('template')) {
    const error = `Foe ended with no stats: ${newFoe.name}`
    if (strict) {
      throw new Error(error)
    }
    errors.push(error)
  }

  if ((rawFoe as RawFoeLegend).phaseDescription) {
    const newLegend = newFoe as FoeLegend,
      rawLegend = rawFoe as RawFoeLegend

    newLegend.phaseDescription = rawLegend.phaseDescription!
    newLegend.phases = rawLegend.phases!
  }

  if (strict) {
    return [newFoe as Foe, []]
  } else {
    return [newFoe as Foe, errors]
  }
}

for (const foe of FOE_DATA.foes) {
  const [newFoe] = produceFoe(foe)

  enemyMap.set(newFoe.name, newFoe as Foe)
}

export const foes = Array.from(enemyMap.entries())
  .map(([_, foe]) => foe)
  .filter((foe) => !foe.name.startsWith('_'))

export const traitMap = new Map<string, TraitInfo>()

for (const trait of FOE_DATA.traits) {
  traitMap.set(trait.name, trait)
}
