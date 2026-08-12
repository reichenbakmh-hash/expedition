import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { LatLng, Waypoint } from '../types'

const fallback: LatLng = {
  lat: -18.8792,
  lng: 47.5079
}

type MapViewProps = {
  position?: LatLng
  route: LatLng[]
  waypoints: Waypoint[]
  onMapClick: (position: LatLng) => void
}

export default function MapView({
  position,
  route,
  waypoints,
  onMapClick
}: MapViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layersRef = useRef<L.LayerGroup | null>(null)
  const trackRef = useRef<L.Polyline | null>(null)
  const markerRef = useRef<L.CircleMarker | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) {
      return
    }

    const map = L.map(ref.current, {
      zoomControl: false,
      attributionControl: true
    }).setView(
      [fallback.lat, fallback.lng],
      12
    )

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(map)

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map)

    const group = L.layerGroup().addTo(map)

    const handleClick = (event: L.LeafletMouseEvent) => {
      onMapClick({
        lat: event.latlng.lat,
        lng: event.latlng.lng
      })
    }

    map.on('click', handleClick)

    mapRef.current = map
    layersRef.current = group

    return () => {
      map.remove()
      mapRef.current = null
      layersRef.current = null
    }
  }, [onMapClick])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    trackRef.current?.remove()
    trackRef.current = null

    if (route.length >= 2) {
      const points = route.map(
        (point): L.LatLngTuple => [
          point.lat,
          point.lng
        ]
      )

      const polyline = L.polyline(
        points,
        {
          color: '#dceeff',
          weight: 3,
          opacity: 0.85
        }
      ).addTo(map)

      trackRef.current = polyline

      map.fitBounds(
        polyline.getBounds().pad(0.2),
        {
          animate: true,
          maxZoom: 16
        }
      )
    }
  }, [route])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    markerRef.current?.remove()
    markerRef.current = null

    if (!position) {
      return
    }

    markerRef.current = L.circleMarker(
      [position.lat, position.lng],
      {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: '#76a8bf',
        fillOpacity: 0.95
      }
    ).addTo(map)

    map.setView(
      [position.lat, position.lng],
      Math.max(map.getZoom(), 15),
      {
        animate: true
      }
    )
  }, [position])

  useEffect(() => {
    const group = layersRef.current

    if (!group) {
      return
    }

    group.clearLayers()

    const colors: Record<string, string> = {
      LANDMARK: '#dceeff',
      PHOTO: '#e6c9ff',
      WATER: '#77d1e8',
      DANGER: '#ff8d8d',
      NOTE: '#ffe29a'
    }

    for (const point of waypoints) {
      L.circleMarker(
        [
          point.position.lat,
          point.position.lng
        ],
        {
          radius: 7,
          color: colors[point.type],
          fillColor: colors[point.type],
          fillOpacity: 0.88,
          weight: 2
        }
      )
        .bindPopup(
          `<strong>${escapeHtml(point.title)}</strong>
          <br>
          <small>${escapeHtml(point.type)}</small>
          <br>
          ${escapeHtml(point.note)}`
        )
        .addTo(group)
    }
  }, [waypoints])

  return (
    <div
      ref={ref}
      className="map"
    />
  )
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[char] ?? char)
  )
}
