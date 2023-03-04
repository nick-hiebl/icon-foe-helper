import { Fragment, ReactNode, useCallback, useState } from 'react'

import { traitMap } from '../FoeData'
import { Action } from '../types'
import { useKeyListener } from '../utils/useEventListener'

interface Props {
  action: Action
}

const COST_MAP = {
  'free': 'free action',
  'light': '1 action',
  'heavy': '2 actions',
  'Interrupt 1': 'Interrupt 1',
  'Interrupt 2': 'Interrupt 2',
  'Interrupt 3': 'Interrupt 3',
}

function renderCost(action: Action) {
  return COST_MAP[action.cost]
}

const HIGHLIGHTED = {
  backgroundColor: '#ff06',
  border: '4px solid #ff06',
  margin: '-4px',
}

const UNDERLINE = {
  textDecoration: 'underline',
}

const CLICKABLE = {
  cursor: 'pointer',
}

export const FoeAction = ({ action }: Props) => {
  const [showingAlt, setAlt] = useState(false)
  const isInterrupt = action.cost.includes('errupt')

  const hasAlt = !!action.altText

  const goToSimple = useCallback(() => {
    setAlt(hasAlt)
  }, [hasAlt])

  useKeyListener(' ', goToSimple)

  const text = showingAlt ? action.altText : action.text

  return (
    <p
      style={{
        ...(hasAlt ? CLICKABLE : {}),
        ...(isInterrupt ? HIGHLIGHTED : {}),
        ...(showingAlt ? UNDERLINE : {}),
      }}
      onClick={() => setAlt(hasAlt && !showingAlt)}
    >
      <strong>
        {action.name}
        {' ('}
        {renderCost(action)}
        {action.tags.map((tag) => (
          <Fragment key={tag}>
            {', '}
            <ActionTag tag={tag} />
          </Fragment>
        ))}
        {'): '}
      </strong>
      <span>{text}</span>
    </p>
  )
}

interface TraitTooltipProps {
  children: ReactNode
  traitName: string
  underline?: boolean
}

export const TraitTooltip = ({ children, traitName, underline }: TraitTooltipProps) => {
  const traitData = traitMap.get(traitName.toLocaleLowerCase())

  const tooltip = traitData
    ? `${traitData.name}${traitData.altText ? '\n\n' + traitData.altText : ''}\n\n${traitData.text}`
    : 'No trait found'

  return <span title={tooltip} style={underline ? UNDERLINE : {}}>{children}</span>
}

export const ActionTag = ({ tag }: { tag: string }) => {
  return <TraitTooltip traitName={tag}>{tag}</TraitTooltip>
}
