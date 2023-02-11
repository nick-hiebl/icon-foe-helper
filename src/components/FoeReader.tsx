import { useEffect, useState } from 'react'
import { produceFoe } from '../FoeData'

import { Action, Foe, FoeStats, Phase, RawFoe, RawFoeLegend, Trait } from '../types'
import { FoeDetails } from './FoeDetails'

const statKeys: [string, keyof FoeStats][] = [
  ['HP', 'hp'],
  ['SPEED', 'speed'],
  ['DASH', 'dash'],
  ['DEFENSE', 'defense'],
]

function findNumberWord(string: string): string | undefined {
  return string.split(' ')
    .find((word) => /\d/.test(word))
}

function parseTrait(string: string): Trait | undefined {
  const numberWord = findNumberWord(string)

  if (!numberWord) {
    return { name: string }
  }

  return {
    name: string.replace(numberWord, 'X'),
    value: numberWord,
  }
}

function getList(string: string): string[] {
  return string.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
}

function isDefined<T>(item: T | undefined): item is T {
  return !!item
}

const COST_MAP = {
  'free action': 'free',
  'Free action': 'free',
  '1 actions': 'light',
  '1 action': 'light',
  '2 actions': 'heavy',
  'Interrupt 1': 'Interrupt 1',
  'interrupt 1': 'Interrupt 1',
  'Interrupt 2': 'Interrupt 2',
  'Interrupt 3': 'Interrupt 3',
}

function removeSuperfluousNewlines(string: string) {
  const lines = string.split('\n')
  const firstLines = lines.slice(0, 5)
  const latterLines = lines.slice(5)

  let text = firstLines.join('\n') + (lines.length > 4 ? '\n' : '')

  let continuing = false

  for (const line of latterLines) {
    if (continuing) {
      text += ' '
    }

    text += line.trim()

    if (line.endsWith('.') || line.endsWith('. ') || line.length <= 1) {
      continuing = false
      text += '\n\n'
    } else {
      continuing = true
    }
  }

  return text.replace('\n\n\n', '\n').replace('\n\n\n', '\n').replace('\n\n\n', '\n')
}

function parseAction(line: string): Action {
  const openParen = line.indexOf('(')
  const closeParen = line.indexOf(')')

  const name = line.slice(0, openParen).trim()

  const actionTraits = getList(line.slice(openParen + 1, closeParen))
  const cost = COST_MAP[actionTraits[0] as 'free action' | '1 action' | '2 actions'] || 'XXXXXXXXXXXXXXX'
  
  return {
    name,
    cost: cost as 'free' | 'light' | 'heavy',
    tags: actionTraits.slice(1),
    text: line.slice(closeParen + 2).trim(),
  }
}

function rawFoeFromText(text: string): RawFoe {
  const lines = text.split('\n')

  const name = lines[0]
  const stats: Partial<FoeStats> = {}

  const rawFoe: RawFoe = {
    name,
    stats,
    actions: [],
  }

  let phaseDescription: string | undefined = undefined
  const phases = []

  let lastPhase: Phase | undefined = undefined

  for (const line of lines.slice(1)) {
    let foundDataKey = false
    for (const [substring, key] of statKeys) {
      if (line.includes(substring)) {
        foundDataKey = true

        const word = findNumberWord(line)

        const value = parseInt(word || '0', 10)
        stats[key] = value as any
      }
    }

    if (foundDataKey || line.trim().length === 0) {
      continue
    } else if (line.toLocaleLowerCase().startsWith('also:')) {
      rawFoe.also = getList(line.slice(5))
    } else if (line.toLocaleLowerCase().startsWith('traits:')) {
      const traits = getList(line.slice(7)).map(parseTrait).filter(isDefined)

      if (lastPhase) {
        lastPhase.traits = traits
      } else {
        rawFoe.traits = traits
      }
    } else if (line.toLocaleLowerCase().startsWith('tags:')) {
      rawFoe.tags = getList(line.slice(5)).filter(isDefined)
    } else if (line.toLocaleLowerCase().startsWith('phases:')) {
      phaseDescription = line.slice(7).trim()
    } else if (phaseDescription && line.startsWith('Phase')) {
      lastPhase = {
        name: line.trim(),
        actions: [],
        traits: [],
      }
      phases.push(lastPhase)
    } else {
      const action = parseAction(line)
      if (lastPhase) {
        lastPhase.actions.push(action)
      } else {
        rawFoe.actions!.push(action)
      }
    }
  }

  if (!rawFoe.actions!.length) {
    rawFoe.actions = undefined
  }

  if (stats.hp && !stats.vitality) {
    stats.vitality = Math.ceil(stats.hp / 4)
  }

  if (Object.keys(stats).length === 0) {
    delete rawFoe.stats
  }

  if (phaseDescription && phases) {
    const rawFoeLegend: RawFoeLegend = rawFoe

    rawFoeLegend.phaseDescription = phaseDescription
    rawFoeLegend.phases = phases
  }

  return rawFoe
}

type FoeInformation = [RawFoe | undefined, Foe | undefined, string[]]

const defaultReturn: FoeInformation = [undefined, undefined, []]

function useFoeFromText(text: string): FoeInformation {
  const [data, setData] = useState(defaultReturn)

  useEffect(() => {
    const rawFoe = rawFoeFromText(text)
    const [foe, errors] = produceFoe(rawFoe, false)
    setData([rawFoe, foe, errors.filter((e) => e.includes('has no stats'))])
  }, [text])

  return data
}

export const FoeReader = () => {
  const [text, setText] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('reader-data')

    if (saved) setText(saved || '')
  }, [])

  useEffect(() => {
    localStorage.setItem('reader-data', text)
  }, [text])

  const [rawFoe, foe, errors] = useFoeFromText(text)

  const foeJSON = JSON.stringify(rawFoe, null, 4)

  return (
    <div>
      <div>
        <textarea
          value={text}
          cols={80}
          rows={10}
          placeholder="Soldier..."
          onChange={(e) => {
            const value = e.currentTarget.value

            // If pasting characters
            if (value.length > text.length + 10) {
              setText(removeSuperfluousNewlines(value))
            } else {
              setText(e.currentTarget.value)
            }
          }}
        />
      </div>
      {errors.length > 0 && (
        <ul>
          {errors.map((err, index) => <li key={index}>{err}</li>)}
        </ul>
      )}
      {foe && foe.name && errors.length <= 1 && (
        <FoeDetails foe={foe as Foe} />
      )}
      <button
        onClick={() => {
          const comp = document.getElementById('foe-json')

          if (!comp) return

          navigator.clipboard.writeText(foeJSON)
        }}
      >
        📋
      </button>
      <pre id="foe-json">{foeJSON}</pre>
    </div>
  )
}
