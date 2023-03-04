import { Action, createHook, createStore } from 'react-sweet-state'
import { traitMap } from '../FoeData'
import { TraitInfo } from '../types'

const LOCAL_STORAGE_KEY = 'traits-in-sidebar'

interface State {
  traits: TraitInfo[]
}

function isDefined<T>(t?: T): t is T {
  return !!t
}

const loadedNames = (localStorage.getItem(LOCAL_STORAGE_KEY) || '')
  .split(',')
  .map((t) => traitMap.get(t.toLocaleLowerCase()))
  .filter(isDefined)

const initialState: State = {
  traits: loadedNames,
}

const actions = {
  addTrait: (trait: TraitInfo): Action<State> => ({ getState, setState }) => {
    if (getState().traits.some((t) => t.text === trait.text)) {
      return
    }
    setState({
      traits: getState().traits.concat(trait),
    })

    localStorage.setItem(LOCAL_STORAGE_KEY, getState().traits.map((t) => t.name).join(','))
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
