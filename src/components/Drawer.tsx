import { useEffect, useState } from 'react'

interface Props {
  children: React.ReactNode
}

export const Drawer = ({ children }: Props) => {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: { key: string }) => {
      if (e.key === '[') {
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  })

  return (
    <div className={isOpen ? 'drawer onscreen' : 'drawer'}>
      <span className="close-button" onClick={() => setOpen(false)}>x</span>
      {children}
    </div>
  )
}