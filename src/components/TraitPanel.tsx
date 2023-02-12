import { usePinnedTraits } from '../state/Traits'
import { TraitInfo } from '../types'

import './TraitPanel.css'

export const TraitPanel = () => {
  const [{ traits }] = usePinnedTraits()

  return (
    <div id="traits">
      <h3>Traits</h3>
      <ul>
        {traits.map((trait) => (
          <Trait key={trait.name} trait={trait} />
        ))}
      </ul>
    </div>
  )
}

export const Trait = ({ trait }: { trait: TraitInfo }) => {
  const [, { removeTrait }] = usePinnedTraits()

  return (
    <li>
      <p>
        <strong>{trait.name}</strong>
        {' '}
        {trait.text}
      </p>
      <span className="cross" onClick={() => removeTrait(trait)}>
        x
      </span>
    </li>
  )
}
