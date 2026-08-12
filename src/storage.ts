import type { Expedition } from './types'

const KEY = 'expedition:data:v1'

export function loadExpedition(): Expedition | null {
  try {
    const raw = localStorage.getItem(KEY)

    if (!raw) {
      return null
    }

    return JSON.parse(raw) as Expedition
  } catch {
    return null
  }
}

export function saveExpedition(data: Expedition) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function createDefaultExpedition(): Expedition {
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    name: 'EXPEDITION 001',
    destination: 'Nouvelle destination',
    objective: 'Documenter et explorer le parcours.',
    startDate: now.slice(0, 10),
    endDate: now.slice(0, 10),
    status: 'PREPARING',
    distanceTargetKm: 10,
    participants: 1,
    budget: 0,
    route: [],
    waypoints: [],
    journal: [],
    checklist: [
      {
        id: crypto.randomUUID(),
        label: 'Eau',
        done: false,
        category: 'ESSENTIEL'
      },
      {
        id: crypto.randomUUID(),
        label: 'Téléphone',
        done: false,
        category: 'ESSENTIEL'
      },
      {
        id: crypto.randomUUID(),
        label: 'Power bank',
        done: false,
        category: 'ÉLECTRONIQUE'
      },
      {
        id: crypto.randomUUID(),
        label: 'Trousse de premiers soins',
        done: false,
        category: 'SÉCURITÉ'
      },
      {
        id: crypto.randomUUID(),
        label: 'Vêtements adaptés',
        done: false,
        category: 'ÉQUIPEMENT'
      },
      {
        id: crypto.randomUUID(),
        label: 'Lampe',
        done: false,
        category: 'SÉCURITÉ'
      }
    ],
    expenses: [],
    createdAt: now
  }
}
