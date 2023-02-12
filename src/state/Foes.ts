import { Action, createHook, createStore } from 'react-sweet-state'

import { Foe } from '../types'

let i = 0
function getId() {
  i++
  return i
}

export interface FoeInfo {
  id: number
  templates: Foe[]
  actualFoe: Foe
}

interface State {
  foes: FoeInfo[]
  focusedId: number | undefined
  manualEditMode: boolean
  transientEditMode: boolean
  isEditing: boolean
}

const initialState: State = {
  foes: [],
  focusedId: undefined,
  manualEditMode: false,
  transientEditMode: false,
  isEditing: false,
}

const computeEditing = (): Action<State> => ({ getState, setState }) => {
  setState({
    isEditing: getState().manualEditMode || getState().transientEditMode
  })
}

const actions = {
  createFoe: (foe: Foe): Action<State> => ({ getState, setState }) => {
    const newId = getId()

    setState({
      foes: getState()
        .foes
        .concat({
          id: newId,
          templates: [foe],
          actualFoe: foe,
        }),
      focusedId: newId,
    })
  },
  removeFoe: (removeId: number): Action<State> => ({ getState, setState }) => {
    setState({
      foes: getState()
        .foes
        .filter((foe) => foe.id !== removeId),
      focusedId: undefined,
    })
  },
  toggleManualEditMode: (): Action<State> => ({ dispatch, getState, setState }) => {
    console.log('Toggling')
    setState({
      manualEditMode: !getState().manualEditMode,
    })
    dispatch(computeEditing())
  },
  enableTransientEdit: (enabled: boolean): Action<State> => ({ dispatch, setState }) => {
    setState({
      transientEditMode: enabled,
    })
    dispatch(computeEditing())
  },
  focus: (id?: number): Action<State> => ({ setState }) => {
    setState({ focusedId: id })
  },
}

type Actions = typeof actions

const Store = createStore<State, Actions>({
  initialState,
  actions,
})

export const useFoes = createHook(Store)
