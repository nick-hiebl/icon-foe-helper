import { Fragment, useMemo, useState } from 'react'

import { Drawer } from './Drawer'
import { FoeTitle } from './FoeDetails'

import { foes } from '../FoeData'
import { Foe } from '../types'
import { useFoes } from '../state/Foes'

import './FoeListDrawer.css'
import { contains, search } from '../utils/bucket'

const sortedFoes = foes.slice()

sortedFoes.sort((a, b) => a.name.localeCompare(b.name))

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

function searchFoes(searchQuery: string) {
  return search(sortedFoes, sortLevelCategories, foeMatchLevel, searchQuery)
}

export const FoeListDrawer = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const query = searchQuery.toLocaleLowerCase()

  const foeCategories = useMemo(
    () => searchFoes(query),
    [query],
  )

  const [, { createFoe }] = useFoes()

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
          )}
        />
      </div>
      <div>
        {foeCategories.map((category) => (
          <Fragment key={category.section}>
            <p className="section-head"><span>{category.section}</span></p>
            <ul>
              {category.items.map((foe) => (
                <li key={foe.name} onClick={() => createFoe(foe)}>
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
