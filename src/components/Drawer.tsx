import { useCallback, useState } from 'react'

import { useKeyListener } from '../utils/useEventListener'

import './Drawer.css'

interface Props {
  children: React.ReactNode
  right?: boolean
}

export const Drawer = ({ children, right }: Props) => {
  const [isOpen, setOpen] = useState(false)

  const toggleOpen = useCallback(() => setOpen((open) => !open), [])

  useKeyListener(right ? ']' : '[', toggleOpen)

  const coreClass = `drawer ${right ? 'drawer-right' : 'drawer-left'}`

  return (
    <div className={isOpen ? `${coreClass} onscreen` : coreClass}>
      <span className="close-button" onClick={() => setOpen(false)}>x</span>
      {children}
    </div>
  )
}