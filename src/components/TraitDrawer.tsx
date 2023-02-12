import { Fragment, useMemo, useState } from 'react'

import { traitMap } from '../FoeData'
import { usePinnedTraits } from '../state/Traits'
import { TraitInfo } from '../types'
import { contains, search } from '../utils/bucket'

import { Drawer } from './Drawer'

const traits = Array.from(traitMap.entries()).map(([_, t]) => t)

enum SortLevel {
  name = 10,
  // shortText = 9,
  text = 8,
}

function traitMatchLevel(searchQuery: string, trait: TraitInfo): SortLevel {
  if (contains(trait.name, searchQuery)) {
    return SortLevel.name
  }

  if (contains(trait.text, searchQuery)) {
    return SortLevel.text
  }

  return 0
}

const sortLevelCategories: [SortLevel, string][] = [
  [SortLevel.name, 'Name'],
  // [SortLevel.shortText, 'Shorthand'],
  [SortLevel.text, 'Text'],
]

export const TraitDrawer = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const [, { addTrait }] = usePinnedTraits()

  const query = searchQuery.toLocaleLowerCase()

  const traitCategories = useMemo(
    () => search(traits, sortLevelCategories, traitMatchLevel, query),
    [query],
  )

  return (
    <Drawer right>
      <div>
        <h2>Traits</h2>
        <input
          placeholder="True Strike..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(
              e.currentTarget.value
          )}
        />
      </div>
      <div>
        {traitCategories.map((category) => (
          <Fragment key={category.section}>
            <p className="section-head"><span>{category.section}</span></p>
            <ul>
              {category.items.map((t) => (
                <li key={t.name} onClick={() => addTrait(t)}>
                  <strong>{t.name}</strong>
                  {' '}
                  <span>{t.text}</span>
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
    </Drawer>
  )
}
