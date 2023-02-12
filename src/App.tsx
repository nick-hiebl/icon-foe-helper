import './App.css'

import '../node_modules/rpg-awesome/css/rpg-awesome.min.css'

import { FoeListDrawer } from './components/FoeListDrawer'
import { FoeReader } from './components/FoeReader'
import { MainFoesPanel } from './components/MainFoesPanel'
import { TraitDrawer } from './components/TraitDrawer'
import { TraitPanel } from './components/TraitPanel'

import { traitMap } from './FoeData'

const traits = Array.from(traitMap.entries()).map(([_, t]) => t)
traits.sort((a, b) => a.name.localeCompare(b.name))

const App = () => {
  if (window.location.hash === '#edit') {
    return <FoeReader />
  }

  return (
    <div className="App">
      <FoeListDrawer />
      <TraitDrawer />
      <div id="main">
        <h1>ICON Foe Helper</h1>
        <MainFoesPanel />
        <TraitPanel />
      </div>
    </div>
  )
}

export default App
