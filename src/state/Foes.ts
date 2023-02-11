import { Action, createHook, createStore } from 'react-sweet-state'
import { Foe } from '../types'

let i = 0
function getId() {
  i++
  return i
}

interface FoeInfo {
  id: number
  templates: Foe[]
  actualFoe: Foe
}

interface State {
  foes: FoeInfo[]
}

const initialState: State = {
  foes: []
}

const actions = {
  createFoe: (foe: Foe): Action<State> => ({ getState, setState }) => {
    setState({
      foes: getState()
        .foes
        .concat({
          id: getId(),
          templates: [foe],
          actualFoe: foe,
        })
    })
  },
}

type Actions = typeof actions

const Store = createStore<State, Actions>({
  initialState,
  actions,
})

export const useFoes = createHook(Store)
