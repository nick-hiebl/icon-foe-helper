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
  'movement': 'movement',
}

function renderCost(action: Action) {
  return COST_MAP[action.cost]
}

const highlight = (color: string) => ({
  backgroundColor: color,
  border: `4px solid ${color}`,
  margin: '16px -4px',
})

const HIGHLIGHTED = highlight('#ff06')

const BLUE_HIGHLIGHT = highlight('#aef')

const UNDERLINE = {
  textDecoration: 'underline',
}

const MINIMISED = {
  color: '#04a',
}

const CLICKABLE = {
  cursor: 'pointer',
}

export const FoeAction = ({ action }: Props) => {
  const [showingAlt, setAlt] = useState(false)
  const isInterrupt = action.cost.includes('errupt')
  const isRoundAction = action.tags.includes('Round Action!')

  const hasAlt = !!action.altText

  const goToSimple = useCallback(() => {
    setAlt(hasAlt)
  }, [hasAlt])

  useKeyListener(' ', goToSimple)

  const text = showingAlt ? action.altText : action.text

  if (text === '-') {
    return null
  }

  return (
    <p
      style={{
        ...(hasAlt ? CLICKABLE : {}),
        ...(isInterrupt ? HIGHLIGHTED : {}),
        ...(isRoundAction ? BLUE_HIGHLIGHT : {}),
        ...(showingAlt ? MINIMISED : {}),
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
  const isSpecial = tag.endsWith('!')

  const tagName = isSpecial ? tag.slice(0, tag.length - 1) : tag

  const c = <TraitTooltip traitName={tagName}>{tagName}</TraitTooltip>

  if (isSpecial) {
    return <u>{c}</u>
  }

  return c
}
