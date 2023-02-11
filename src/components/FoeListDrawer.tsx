import { Fragment, useMemo, useState } from 'react'

import { Drawer } from './Drawer'
import { FoeTitle } from './FoeDetails'

import { foes } from '../FoeData'
import { Foe } from '../types'

const sortedFoes = foes.slice()

sortedFoes.sort((a, b) => a.name.localeCompare(b.name))

type SearchResults = { section: string; foes: Foe[] }[]

function contains(outer: string, query: string) {
  return outer.toLocaleLowerCase().includes(query)
}

enum SortLevel {
  name = 10,
  also = 9,
  tags = 8,
  traits = 7,
}

const sortLevelCategories: [SortLevel, string][] = [
  [SortLevel.name, 'Name'],
  [SortLevel.also, 'Belongs to kind'],
  [SortLevel.tags, 'Tags'],
  [SortLevel.traits, 'Traits'],
]

// Return a higher number the better the foe matches. 0 or less is a non-match
function foeMatchLevel(searchQuery: string, foe: Foe): SortLevel {
  if (contains(foe.name, searchQuery)) {
    return SortLevel.name
  }

  if (foe.also.some((also) => contains(also, searchQuery))) {
    return SortLevel.also
  }

  if (foe.tags.some((tag) => contains(tag, searchQuery))) {
    return SortLevel.tags
  }

  if (foe.traits.some((trait) => contains(trait.name, searchQuery))) {
    return SortLevel.traits
  }

  return 0
}

function bucket<T, K>(items: T[], labeler: (t: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>()

  items.forEach((item) => {
    const key = labeler(item)

    const list = map.get(key) || []

    map.set(key, list)

    list.push(item)
  })

  return map
}

function searchFoes(searchQuery: string): SearchResults {
  if (!searchQuery) {
    return [{ section: 'All', foes: sortedFoes }]
  }

  const buckets = bucket(sortedFoes, (foe) => foeMatchLevel(searchQuery, foe))

  return sortLevelCategories
    .map(([key, label]) => ({
      section: label,
      foes: buckets.get(key) || []
    }))
    .filter((category) => category.foes.length > 0)
}

export const FoeListDrawer = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const query = searchQuery.toLocaleLowerCase()

  const foeCategories = useMemo(
    () => searchFoes(query),
    [query],
  )

  return (
    <Drawer>
      <div>
        <h2>Foe List & Search</h2>
        <input
          placeholder="Soldier..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(
              e.currentTarget.value
                .replace('[', '')
                .replace(']', '')
          )}
        />
      </div>
      <div>
        {foeCategories.map((category) => (
          <Fragment key={category.section}>
            <p className="section-head"><span>{category.section}</span></p>
            <ul>
              {category.foes.map((foe) => (
                <li key={foe.name}>
                  <FoeTitle foe={foe} />
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
    </Drawer>
  )
}
