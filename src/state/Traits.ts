import { Action, createHook, createStore } from 'react-sweet-state'
import { TraitInfo } from '../types'

interface State {
  traits: TraitInfo[]
}

const initialState: State = {
  traits: [],
}

const actions = {
  addTrait: (trait: TraitInfo): Action<State> => ({ getState, setState }) => {
    if (getState().traits.some((t) => t.text === trait.text)) {
      return
    }
    setState({
      traits: getState().traits.concat(trait),
    })
  },
  removeTrait: (removeTrait: TraitInfo): Action<State> => ({ getState, setState }) => {
    setState({
      traits: getState()
        .traits
        .filter((t) => t.name !== removeTrait.name),
    })
  },
}

type Actions = typeof actions

const Store = createStore<State, Actions>({
  initialState,
  actions,
})

export const usePinnedTraits = createHook(Store)
