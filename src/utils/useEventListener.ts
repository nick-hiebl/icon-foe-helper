import { useCallback, useEffect } from 'react'

export const useEventListener = (event: string, callback: (e: any) => void) => {
  useEffect(() => {
    document.addEventListener(event, callback)

    return () => {
      document.addEventListener(event, callback)
    }
  })
}

export const useKeyListener = (key: string, callback: () => void) => {
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) {
      return
    }

    if (e.key === key) {
      callback()
    }
  }, [callback, key])

  useEventListener('keydown', onKeyDown)
}
