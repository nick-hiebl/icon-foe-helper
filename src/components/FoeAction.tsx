import { CSSProperties, Fragment, ReactNode } from 'react'

import { traitMap } from '../FoeData'
import { Action } from '../types'

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

const BOLD: CSSProperties = {
  fontWeight: 'bold',
}

export const FoeAction = ({ action }: Props) => {
  return (
    <p>
      <span style={BOLD}>
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
      </span>
      <span>{action.text}</span>
    </p>
  )
}

interface TraitTooltipProps {
  children: ReactNode
  traitName: string
}

export const TraitTooltip = ({ children, traitName }: TraitTooltipProps) => {
  const traitData = traitMap.get(traitName.toLocaleLowerCase())

  const tooltip = traitData
    ? `${traitData.name}\n${traitData.text}`
    : 'No trait found'

  return <span title={tooltip}>{children}</span>
}

export const ActionTag = ({ tag }: { tag: string }) => {
  return <TraitTooltip traitName={tag}>{tag}</TraitTooltip>
}
