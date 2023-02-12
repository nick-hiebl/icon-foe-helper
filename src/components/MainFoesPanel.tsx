import { FoeInfo, useFoes } from '../state/Foes'
import { useKeyListener } from '../utils/useEventListener'

import { FoeDetails } from './FoeDetails'

import './MainFoesPanel.css'

export const MainFoesPanel = () => {
  const [{ foes, isEditing }, { focus, toggleManualEditMode }] = useFoes()

  useKeyListener('e', toggleManualEditMode)
  useKeyListener('Escape', () => focus(undefined))

  return (
    <div id="foes">
      <p>Editing: {isEditing.toString()}</p>
      <ul>
        {foes.map((foe) => (
          <li key={foe.id}>
            <MainFoeDetails foeInfo={foe} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export const MainFoeDetails = ({ foeInfo }: { foeInfo: FoeInfo }) => {
  const [{ focusedId, isEditing }, { focus }] = useFoes()

  const isFocused = focusedId === foeInfo.id
  const showsFocused = isEditing && isFocused

  return (
    <div
      className={showsFocused ? 'focused main-foe' : 'main-foe'}
      onClick={() => isEditing && focus(foeInfo.id)}
    >
      <FoeDetails foe={foeInfo.actualFoe} />
    </div>
  )
}
