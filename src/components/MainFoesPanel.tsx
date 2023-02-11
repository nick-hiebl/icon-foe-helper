import { useFoes } from '../state/Foes'
import { FoeDetails } from './FoeDetails'

export const MainFoesPanel = () => {
  const [{ foes }] = useFoes()

  return (
    <div id="foes">
      <ul>
        {foes.map((foe) => (
          <li key={foe.id}>
            <FoeDetails foe={foe.actualFoe} />
          </li>
        ))}
      </ul>
    </div>
  )
}
