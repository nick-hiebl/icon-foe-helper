import { useMemo, useState } from 'react'

import { Drawer } from './Drawer'
import { FoeTitle } from './FoeDetails'

import { foes } from '../FoeData'

const sortedFoes = foes.slice()

sortedFoes.sort((a, b) => a.name.localeCompare(b.name))

export const FoeListDrawer = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const foes = useMemo(
    () => sortedFoes.filter((foe) =>
      foe.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
    ),
    [searchQuery],
  )

  return (
    <Drawer>
      <div>
        <h2>ICON Foe Helper</h2>
        <input
          placeholder="Soldier..."
          type="text"
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </div>
      <ul>
        {foes.map((foe) => (
          <li key={foe.name}><FoeTitle foe={foe} /></li>
        ))}
      </ul>
    </Drawer>
  )
}
