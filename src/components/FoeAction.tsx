import { CSSProperties } from 'react'

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
        {[renderCost(action), ...action.tags].join(', ')}
        {'): '}
      </span>
      <span>{action.text}</span>
    </p>
  )
}
