export type LatLng = {
  lat: number
  lng: number
}

export type WaypointType =
  | 'LANDMARK'
  | 'PHOTO'
  | 'WATER'
  | 'DANGER'
  | 'NOTE'

export type Waypoint = {
  id: string
  title: string
  type: WaypointType
  note: string
  position: LatLng
  createdAt: string
}

export type JournalEntry = {
  id: string
  title: string
  note: string
  createdAt: string
  position?: LatLng
}

export type ChecklistItem = {
  id: string
  label: string
  done: boolean
  category: string
}

export type Expense = {
  id: string
  label: string
  amount: number
  category: string
}

export type Expedition = {
  id: string
  name: string
  destination: string
  objective: string
  startDate: string
  endDate: string
  status: 'PREPARING' | 'ACTIVE' | 'COMPLETE'
  distanceTargetKm: number
  participants: number
  budget: number
  currentPosition?: LatLng
  route: LatLng[]
  waypoints: Waypoint[]
  journal: JournalEntry[]
  checklist: ChecklistItem[]
  expenses: Expense[]
  createdAt: string
}
