import './App.css'

import { FoeDetails } from './components/FoeDetails'
import { FoeListDrawer } from './components/FoeListDrawer'
import { FoeReader } from './components/FoeReader'
import { MainFoesPanel } from './components/MainFoesPanel'

import { foes, traitMap } from './FoeData'

const traits = Array.from(traitMap.entries()).map(([_, t]) => t)
traits.sort((a, b) => a.name.localeCompare(b.name))

const App = () => {
  if (window.location.hash === '#edit') {
    return <FoeReader />
  }

  return (
    <div className="App">
      <FoeListDrawer />
      <div id="main">
        <h1>ICON Foe Helper</h1>
        <MainFoesPanel />
        <div id="traits">
          <ul>
            {traits.map((trait) => (
              <li key={trait.name}>
                {trait.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
