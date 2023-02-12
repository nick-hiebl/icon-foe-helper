import { CSSProperties, Fragment, useState } from 'react'

import { Foe, FoeLegend, Trait } from '../types'
import { FoeAction, TraitTooltip } from './FoeAction'

import './FoeDetails.css'

interface Props {
  foe: Foe
}

function renderTrait(trait: Trait) {
  if (trait.value) {
    return trait.name.replace('X', trait.value)
  }

  return trait.name
}

const BOLD: CSSProperties = {
  fontWeight: 'bold',
}

const HEADING: CSSProperties = {
  color: 'white',
  padding: '2px',
}

const COLOR_MAP: Record<string, CSSProperties> = {
  red: {
    backgroundColor: 'red',
    ...HEADING,
  },
  yellow: {
    backgroundColor: '#f29900',
    ...HEADING,
  },
  blue: {
    backgroundColor: '#007cf8',
    ...HEADING,
  },
  green: {
    backgroundColor: '#4ed500',
    ...HEADING,
  },
  grey: {
    backgroundColor: '#888888',
    ...HEADING,
  },
}

function colorFromTags(foe: Foe) {
  const tag = foe.tags.find((tag) => tag in COLOR_MAP)

  if (!tag) {
    return COLOR_MAP.grey
  }

  return COLOR_MAP[tag]
}

export const FoeTitle = ({ foe }: Props) => {
  return (
    <h3><span style={colorFromTags(foe)}>{foe.name}</span></h3>
  )
}

export const FoeDetails = ({ foe }: Props) => {
  return (
    <div>
      <FoeTitle foe={foe} />
      <span>{foe.tags.join(', ')}</span>
      <FoeStats foe={foe} />
      <TraitBlock traits={foe.traits} />
      <ul>
        {foe.actions.map((action) => (
          <li key={action.name}><FoeAction action={action} /></li>
        ))}
      </ul>
      <FoePhases foe={foe} />
    </div>
  )
}

const TraitBlock = ({ traits }: { traits: Trait[] }) => {
  if (traits.length === 0) {
    return null
  }

  return (
    <p>
      <span style={BOLD}>Traits: </span>
      <span>{traits.map((trait, index, traits) => (
        <Fragment key={trait.name}>
          <FoeTrait trait={trait} />
          {index !== traits.length - 1 && (
            ', '
          )}
        </Fragment>
      ))}</span>
    </p>
  )
}

const hideableStats = false

export const FoeStats = ({ foe }: Props) => {
  const [isOpen, setOpen] = useState(!hideableStats)

  return (
    <div>
      {isOpen && (
        <ul className="statblock">
          <li><strong>VIT:</strong> {foe.stats.vitality}</li>
          <li><strong>HP:</strong> {foe.stats.hp}</li>
          <li><strong>Speed:</strong> {foe.stats.speed} {`(Dash ${foe.stats.dash})`}</li>
          <li><strong>Defense:</strong> {foe.stats.defense}</li>
          <li><strong>Fray damage:</strong> {foe.stats.fray}</li>
          <li><strong>[D]:</strong> {foe.stats.damage_die}</li>
        </ul>
      )}
      {hideableStats && (
        <button onClick={() => setOpen((open) => !open)}>{isOpen ? '[-]' : '[+]'}</button>
      )}
    </div>
  )
}

export const FoeTrait = ({ trait }: { trait: Trait }) => {
  const text = renderTrait(trait)

  return (
    <TraitTooltip traitName={trait.name} underline={trait.special}>
      {text}
    </TraitTooltip>
  )
}

export const FoePhases = ({ foe }: Props) => {
  if (!(foe as FoeLegend).phaseDescription) {
    return null
  }

  const legend = foe as FoeLegend

  return (
    <>
      <p><strong>Phases: </strong>{legend.phaseDescription}</p>
      <ul>
        {legend.phases.map((phase) => (
          <li key={phase.name}>
            <p><strong>{phase.name}</strong></p>
            {phase.traits.length > 0 && (
              <TraitBlock traits={phase.traits} />
            )}
            <ul>
              {phase.actions.map((action) => (
                <FoeAction key={action.name} action={action} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  )
}
