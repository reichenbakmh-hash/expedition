import {
  useEffect,
  useMemo,
  useState
} from 'react'

import Hud from './components/Hud'
import MapView from './components/MapView'

import type {
  Expedition,
  LatLng,
  WaypointType
} from './types'

import {
  createDefaultExpedition,
  loadExpedition,
  saveExpedition
} from './storage'

const tabs = [
  'MISSION',
  'MAP',
  'LOG',
  'GEAR'
] as const

type Tab = typeof tabs[number]

export default function App() {
  const [expedition, setExpedition] =
    useState<Expedition>(
      () =>
        loadExpedition() ??
        createDefaultExpedition()
    )

  const [tab, setTab] =
    useState<Tab>('MISSION')

  const [tracking, setTracking] =
    useState(false)

  const [locationError, setLocationError] =
    useState('')

  const [selectedType, setSelectedType] =
    useState<WaypointType>('LANDMARK')

  const [selectedPoint, setSelectedPoint] =
    useState<LatLng | null>(null)

  const [online, setOnline] =
    useState(navigator.onLine)

  useEffect(() => {
    saveExpedition(expedition)
  }, [expedition])

  useEffect(() => {
    const handleOnline = () =>
      setOnline(true)

    const handleOffline = () =>
      setOnline(false)

    window.addEventListener(
      'online',
      handleOnline
    )

    window.addEventListener(
      'offline',
      handleOffline
    )

    return () => {
      window.removeEventListener(
        'online',
        handleOnline
      )

      window.removeEventListener(
        'offline',
        handleOffline
      )
    }
  }, [])

  useEffect(() => {
    if (
      !tracking ||
      !('geolocation' in navigator)
    ) {
      return
    }

    const id =
      navigator.geolocation.watchPosition(
        (geo) => {
          const position = {
            lat: geo.coords.latitude,
            lng: geo.coords.longitude
          }

          setLocationError('')

          setExpedition(
            (current) => ({
              ...current,
              status: 'ACTIVE',
              currentPosition:
                position,
              route: [
                ...current.route,
                position
              ]
            })
          )
        },
        (error) => {
          setLocationError(
            error.message
          )
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000
        }
      )

    return () =>
      navigator.geolocation.clearWatch(id)
  }, [tracking])

  const distance = useMemo(
    () =>
      routeDistanceKm(
        expedition.route
      ),
    [expedition.route]
  )

  const progress = useMemo(() => {
    const target = Math.max(
      expedition.distanceTargetKm,
      0.1
    )

    return Math.min(
      100,
      (distance / target) * 100
    )
  }, [
    expedition.distanceTargetKm,
    distance
  ])

  const spent =
    expedition.expenses.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    )

  const checklistDone =
    expedition.checklist.filter(
      (item) => item.done
    ).length

  function update(
    partial: Partial<Expedition>
  ) {
    setExpedition(
      (current) => ({
        ...current,
        ...partial
      })
    )
  }

  function toggleTracking() {
    if (!('geolocation' in navigator)) {
      setLocationError(
        'La géolocalisation n’est pas disponible sur ce navigateur.'
      )

      return
    }

    setTracking(
      (current) => !current
    )
  }

  function addWaypoint() {
    if (!selectedPoint) {
      return
    }

    const title =
      prompt(
        'Nom du waypoint',
        'Point d’intérêt'
      )?.trim()

    if (!title) {
      return
    }

    const note =
      prompt(
        'Note',
        ''
      ) ?? ''

    update({
      waypoints: [
        ...expedition.waypoints,
        {
          id: crypto.randomUUID(),
          title,
          type: selectedType,
          note,
          position: selectedPoint,
          createdAt:
            new Date().toISOString()
        }
      ]
    })

    setSelectedPoint(null)
  }

  function addJournal() {
    const title =
      prompt(
        'Titre de l’entrée',
        'Observation'
      )?.trim()

    if (!title) {
      return
    }

    const note =
      prompt(
        'Observation',
        ''
      ) ?? ''

    update({
      journal: [
        {
          id: crypto.randomUUID(),
          title,
          note,
          createdAt:
            new Date().toISOString(),
          position:
            expedition.currentPosition
        },
        ...expedition.journal
      ]
    })
  }

  function addExpense() {
    const label =
      prompt(
        'Dépense',
        'Transport'
      )?.trim()

    if (!label) {
      return
    }

    const amount = Number(
      prompt(
        'Montant en Ar',
        '0'
      )
    )

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return
    }

    update({
      expenses: [
        ...expedition.expenses,
        {
          id: crypto.randomUUID(),
          label,
          amount,
          category: 'AUTRE'
        }
      ]
    })
  }

  function completeExpedition() {
    update({
      status: 'COMPLETE'
    })

    setTracking(false)
  }

  function reset() {
    if (
      !confirm(
        'Réinitialiser entièrement cette expédition ?'
      )
    ) {
      return
    }

    setExpedition(
      createDefaultExpedition()
    )

    setTracking(false)
    setSelectedPoint(null)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">
            MISSION CONTROL
          </span>

          <h1>EXPEDITION</h1>
        </div>

        <div
          className={`status-pill ${
            online
              ? 'online'
              : 'offline'
          }`}
        >
          <span />

          {online
            ? 'ONLINE'
            : 'OFFLINE'}
        </div>
      </header>

      <section className="hero-grid">
        <div className="hud-panel">
          <Hud
            progress={progress}
          />

          <div className="target-info">
            <span className="eyebrow">
              TARGET
            </span>

            <strong>
              {expedition.destination}
            </strong>

            <small>
              {expedition.status}
            </small>
          </div>
        </div>

        <div className="mission-summary panel">
          <div className="section-head">
            <span className="eyebrow">
              CURRENT MISSION
            </span>

            <span>
              {expedition.name}
            </span>
          </div>

          <input
            value={
              expedition.destination
            }
            onChange={(event) =>
              update({
                destination:
                  event.target.value
              })
            }
            aria-label="Destination"
          />

          <textarea
            value={
              expedition.objective
            }
            onChange={(event) =>
              update({
                objective:
                  event.target.value
              })
            }
            aria-label="Objectif"
          />

          <div className="metric-row">
            <Metric
              label="DISTANCE"
              value={`${distance.toFixed(
                2
              )} km`}
            />

            <Metric
              label="WAYPOINTS"
              value={String(
                expedition.waypoints.length
              )}
            />

            <Metric
              label="GEAR"
              value={`${checklistDone}/${expedition.checklist.length}`}
            />
          </div>

          <div className="mission-buttons">
            <button
              className={`primary ${
                tracking
                  ? 'active'
                  : ''
              }`}
              onClick={
                toggleTracking
              }
            >
              {tracking
                ? '■ STOP TRACKING'
                : '◉ START TRACKING'}
            </button>

            {expedition.status !==
              'COMPLETE' && (
              <button
                className="secondary"
                onClick={
                  completeExpedition
                }
              >
                ✓ COMPLETE
              </button>
            )}
          </div>

          {locationError && (
            <p className="error">
              GPS : {locationError}
            </p>
          )}
        </div>
      </section>

      <nav
        className="tabs"
        aria-label="Navigation principale"
      >
        {tabs.map((item) => (
          <button
            key={item}
            className={
              tab === item
                ? 'selected'
                : ''
            }
            onClick={() =>
              setTab(item)
            }
          >
            {item}
          </button>
        ))}
      </nav>

      {tab === 'MISSION' && (
        <MissionTab
          expedition={expedition}
          update={update}
          progress={progress}
          spent={spent}
          addExpense={addExpense}
        />
      )}

      {tab === 'MAP' && (
        <MapTab
          expedition={expedition}
          selectedType={selectedType}
          setSelectedType={
            setSelectedType
          }
          selectedPoint={
            selectedPoint
          }
          setSelectedPoint={
            setSelectedPoint
          }
          addWaypoint={
            addWaypoint
          }
        />
      )}

      {tab === 'LOG' && (
        <LogTab
          expedition={expedition}
          addJournal={
            addJournal
          }
        />
      )}

      {tab === 'GEAR' && (
        <GearTab
          expedition={expedition}
          update={update}
          reset={reset}
        />
      )}

      <footer>
        EXPEDITION // LOCAL DATA //{' '}
        {new Date().getFullYear()}
      </footer>
    </main>
  )
}

function MissionTab({
  expedition,
  update,
  progress,
  spent,
  addExpense
}: {
  expedition: Expedition
  update: (
    partial: Partial<Expedition>
  ) => void
  progress: number
  spent: number
  addExpense: () => void
}) {
  return (
    <section className="grid-2">
      <article className="panel">
        <div className="section-head">
          <span className="eyebrow">
            OBJECTIVE
          </span>

          <span>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="bar">
          <span
            style={{
              width: `${progress}%`
            }}
          />
        </div>

        <div className="mini-grid">
          <Field
            label="START"
            value={
              expedition.startDate
            }
            onChange={(value) =>
              update({
                startDate: value
              })
            }
            type="date"
          />

          <Field
            label="END"
            value={
              expedition.endDate
            }
            onChange={(value) =>
              update({
                endDate: value
              })
            }
            type="date"
          />

          <Field
            label="TARGET KM"
            value={String(
              expedition.distanceTargetKm
            )}
            onChange={(value) =>
              update({
                distanceTargetKm:
                  Number(value) || 0
              })
            }
            type="number"
          />

          <Field
            label="TEAM"
            value={String(
              expedition.participants
            )}
            onChange={(value) =>
              update({
                participants: Math.max(
                  1,
                  Number(value) || 1
                )
              })
            }
            type="number"
          />
        </div>
      </article>

      <article className="panel">
        <div className="section-head">
          <span className="eyebrow">
            BUDGET
          </span>

          <button
            className="text-btn"
            onClick={
              addExpense
            }
          >
            + ADD
          </button>
        </div>

        <div className="money">
          {spent.toLocaleString(
            'fr-FR'
          )}{' '}
          <small>Ar</small>
        </div>

        <p className="muted">
          Prévu :{' '}
          {expedition.budget.toLocaleString(
            'fr-FR'
          )}{' '}
          Ar
        </p>

        <Field
          label="BUDGET TOTAL"
          value={String(
            expedition.budget
          )}
          onChange={(value) =>
            update({
              budget:
                Number(value) || 0
            })
          }
          type="number"
        />
      </article>
    </section>
  )
}

function MapTab({
  expedition,
  selectedType,
  setSelectedType,
  selectedPoint,
  setSelectedPoint,
  addWaypoint
}: {
  expedition: Expedition
  selectedType: WaypointType
  setSelectedType: (
    value: WaypointType
  ) => void
  selectedPoint: LatLng | null
  setSelectedPoint: (
    value: LatLng | null
  ) => void
  addWaypoint: () => void
}) {
  return (
    <section className="panel map-panel">
      <div className="section-head">
        <span className="eyebrow">
          TACTICAL MAP
        </span>

        <span>
          {selectedPoint
            ? 'POINT SELECTED'
            : 'TAP MAP TO SELECT'}
        </span>
      </div>

      <MapView
        position={
          expedition.currentPosition
        }
        route={expedition.route}
        waypoints={
          expedition.waypoints
        }
        onMapClick={
          setSelectedPoint
        }
      />

      {selectedPoint && (
        <div className="map-controls">
          <select
            value={selectedType}
            onChange={(event) =>
              setSelectedType(
                event.target.value as WaypointType
              )
            }
          >
            {[
              'LANDMARK',
              'PHOTO',
              'WATER',
              'DANGER',
              'NOTE'
            ].map((value) => (
              <option
                key={value}
                value={value}
              >
                {value}
              </option>
            ))}
          </select>

          <button
            className="primary"
            onClick={
              addWaypoint
            }
          >
            SAVE WAYPOINT
          </button>

          <button
            className="secondary"
            onClick={() =>
              setSelectedPoint(
                null
              )
            }
          >
            CANCEL
          </button>
        </div>
      )}

      <p className="muted">
        Les tuiles cartographiques
        nécessitent une connexion.
        Le reste des données de
        mission est stocké localement.
      </p>
    </section>
  )
}

function LogTab({
  expedition,
  addJournal
}: {
  expedition: Expedition
  addJournal: () => void
}) {
  return (
    <section className="panel">
      <div className="section-head">
        <span className="eyebrow">
          FIELD LOG
        </span>

        <button
          className="text-btn"
          onClick={addJournal}
        >
          + NEW ENTRY
        </button>
      </div>

      {expedition.journal.length ===
      0 ? (
        <Empty text="Aucune observation enregistrée." />
      ) : (
        expedition.journal.map(
          (entry) => (
            <div
              className="log-entry"
              key={entry.id}
            >
              <strong>
                {entry.title}
              </strong>

              <small>
                {new Date(
                  entry.createdAt
                ).toLocaleString(
                  'fr-FR'
                )}
              </small>

              <p>
                {entry.note}
              </p>

              {entry.position && (
                <small>
                  GPS :{' '}
                  {entry.position.lat.toFixed(
                    5
                  )},{' '}
                  {entry.position.lng.toFixed(
                    5
                  )}
                </small>
              )}
            </div>
          )
        )
      )}
    </section>
  )
}

function GearTab({
  expedition,
  update,
  reset
}: {
  expedition: Expedition
  update: (
    partial: Partial<Expedition>
  ) => void
  reset: () => void
}) {
  function toggle(id: string) {
    update({
      checklist:
        expedition.checklist.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  done: !item.done
                }
              : item
        )
    })
  }

  function addGear() {
    const label =
      prompt(
        'Équipement',
        'Nouvel équipement'
      )?.trim()

    if (!label) {
      return
    }

    update({
      checklist: [
        ...expedition.checklist,
        {
          id: crypto.randomUUID(),
          label,
          done: false,
          category: 'PERSONNALISÉ'
        }
      ]
    })
  }

  return (
    <section className="panel">
      <div className="section-head">
        <span className="eyebrow">
          EQUIPMENT CHECK
        </span>

        <span>
          {
            expedition.checklist.filter(
              (item) =>
                item.done
            ).length
          }
          /
          {expedition.checklist.length}
        </span>
      </div>

      {expedition.checklist.map(
        (item) => (
          <label
            className="check-row"
            key={item.id}
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() =>
                toggle(item.id)
              }
            />

            <span>
              {item.label}
            </span>

            <small>
              {item.category}
            </small>
          </label>
        )
      )}

      <button
        className="secondary add-gear"
        onClick={addGear}
      >
        + ADD EQUIPMENT
      </button>

      <button
        className="danger-btn"
        onClick={reset}
      >
        RESET MISSION DATA
      </button>
    </section>
  )
}

function Metric({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <span className="eyebrow">
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text'
}: {
  label: string
  value: string
  onChange: (
    value: string
  ) => void
  type?: string
}) {
  return (
    <label className="field">
      <span>
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </label>
  )
}

function Empty({
  text
}: {
  text: string
}) {
  return (
    <div className="empty">
      {text}
    </div>
  )
}

function routeDistanceKm(
  route: LatLng[]
) {
  let total = 0

  for (
    let i = 1;
    i < route.length;
    i += 1
  ) {
    total += haversineKm(
      route[i - 1],
      route[i]
    )
  }

  return total
}

function haversineKm(
  a: LatLng,
  b: LatLng
) {
  const R = 6371

  const dLat =
    ((b.lat - a.lat) *
      Math.PI) /
    180

  const dLon =
    ((b.lng - a.lng) *
      Math.PI) /
    180

  const lat1 =
    (a.lat * Math.PI) /
    180

  const lat2 =
    (b.lat * Math.PI) /
    180

  const h =
    Math.sin(dLat / 2) **
      2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) **
      2

  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(h)
    )
  )
      }
