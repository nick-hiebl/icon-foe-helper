import './App.css'

import { FoeDetails } from './components/FoeDetails'
import { FoeListDrawer } from './components/FoeListDrawer'
import { FoeReader } from './components/FoeReader'

import { foes } from './FoeData'

function App() {
  if (window.location.hash === '#edit') {
    return <FoeReader />
  }

  return (
    <div className="App">
      <FoeListDrawer />
      <div id="main">
        <h1>ICON Foe Helper</h1>
        <div id="foes">
          <ul>
            {foes.map((foe) => (
              <li key={foe.name}><FoeDetails foe={foe} /></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
