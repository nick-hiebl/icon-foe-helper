import { CSSProperties, Fragment, ReactNode, useState } from 'react'

import { traitMap } from '../FoeData'

import { Foe, FoeLegend, Trait } from '../types'
import { FoeAction, TraitTooltip } from './FoeAction'

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
    <>
      {isOpen && (
        <ul>
          <li><span style={BOLD}>VIT:</span> {foe.stats.vitality}</li>
          <li><span style={BOLD}>HP:</span> {foe.stats.hp}</li>
          <li><span style={BOLD}>Speed:</span> {foe.stats.speed} {`(Dash ${foe.stats.dash})`}</li>
          <li><span style={BOLD}>Defense:</span> {foe.stats.defense}</li>
          <li><span style={BOLD}>Fray damage:</span> {foe.stats.fray}</li>
          <li><span style={BOLD}>[D]:</span> {foe.stats.damage_die}</li>
        </ul>
      )}
      {hideableStats && (
        <button onClick={() => setOpen((open) => !open)}>{isOpen ? '[-]' : '[+]'}</button>
      )}
    </>
  )
}

export const FoeTrait = ({ trait }: { trait: Trait }) => {
  const text = renderTrait(trait)

  return <TraitTooltip traitName={trait.name}>{text}</TraitTooltip>
}

export const FoePhases = ({ foe }: Props) => {
  if (!(foe as FoeLegend).phaseDescription) {
    return null
  }

  const legend = foe as FoeLegend

  return (
    <>
      <p><span style={BOLD}>Phases: </span>{legend.phaseDescription}</p>
      <ul>
        {legend.phases.map((phase) => (
          <li key={phase.name}>
            <p style={BOLD}>{phase.name}</p>
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
