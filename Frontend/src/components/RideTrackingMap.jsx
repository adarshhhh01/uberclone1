import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const defaultCenter = { lat: 28.6139, lng: 77.209 }

function createMarkerElement(type) {
  const el = document.createElement('div')
  el.className = `ride-marker ride-marker-${type}`

  const icons = {
    captain: 'ri-taxi-fill',
    user: 'ri-user-3-fill',
    pickup: 'ri-map-pin-user-fill',
    destination: 'ri-flag-2-fill'
  }

  el.innerHTML = `<i class="${icons[type]} ride-marker-icon"></i>`
  return el
}

async function geocodeAddress(address) {
  if (!address || !mapboxgl.accessToken) return null

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?limit=1&access_token=${mapboxgl.accessToken}`
    )
    const data = await response.json()
    const center = data?.features?.[0]?.center
    if (!center || center.length < 2) return null
    return { lng: center[0], lat: center[1] }
  } catch {
    return null
  }
}

function buildLineFeature(coords = []) {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: coords
    }
  }
}

function getNearestRouteIndex(routeCoordinates, point) {
  if (!routeCoordinates?.length || !point) return -1
  let minDistance = Number.POSITIVE_INFINITY
  let nearestIndex = -1

  for (let i = 0; i < routeCoordinates.length; i += 1) {
    const [lng, lat] = routeCoordinates[i]
    const distance = Math.hypot(point.lng - lng, point.lat - lat)
    if (distance < minDistance) {
      minDistance = distance
      nearestIndex = i
    }
  }

  return nearestIndex
}

const RideTrackingMap = ({
  userLocation,
  captainLocation,
  pickupLocation,
  destinationLocation,
  pickupAddress,
  destinationAddress
}) => {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const routeCoordinatesRef = useRef([])
  const userMarkerRef = useRef(null)
  const captainMarkerRef = useRef(null)
  const pickupMarkerRef = useRef(null)
  const destinationMarkerRef = useRef(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const [geocodedPickup, setGeocodedPickup] = useState(null)
  const [geocodedDestination, setGeocodedDestination] = useState(null)

  useEffect(() => {
    let isCancelled = false

    if (!pickupLocation && pickupAddress) {
      geocodeAddress(pickupAddress).then(point => {
        if (!isCancelled && point) setGeocodedPickup(point)
      })
    }

    if (!destinationLocation && destinationAddress) {
      geocodeAddress(destinationAddress).then(point => {
        if (!isCancelled && point) setGeocodedDestination(point)
      })
    }

    return () => {
      isCancelled = true
    }
  }, [pickupAddress, pickupLocation, destinationAddress, destinationLocation])

  const resolvedPickup = pickupLocation || geocodedPickup
  const resolvedDestination = destinationLocation || geocodedDestination

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return

    const initialCenter =
      captainLocation ||
      userLocation ||
      resolvedPickup ||
      resolvedDestination ||
      defaultCenter

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: [initialCenter.lng, initialCenter.lat],
      zoom: 14,
      pitch: 35,
      bearing: 0
    })

    mapRef.current.on('load', () => {
      setIsMapLoaded(true)
      const map = mapRef.current
      if (!map) return

      if (!map.getSource('ride-route-source')) {
        map.addSource('ride-route-source', {
          type: 'geojson',
          data: buildLineFeature([])
        })
      }

      if (!map.getSource('ride-progress-source')) {
        map.addSource('ride-progress-source', {
          type: 'geojson',
          data: buildLineFeature([])
        })
      }

      if (!map.getLayer('ride-route-layer')) {
        map.addLayer({
          id: 'ride-route-layer',
          type: 'line',
          source: 'ride-route-source',
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#2563eb',
            'line-width': 6,
            'line-opacity': 0.42
          }
        })
      }

      if (!map.getLayer('ride-progress-layer')) {
        map.addLayer({
          id: 'ride-progress-layer',
          type: 'line',
          source: 'ride-progress-source',
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#16a34a',
            'line-width': 7,
            'line-opacity': 0.95
          }
        })
      }
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      routeCoordinatesRef.current = []
      setIsMapLoaded(false)
    }
  }, [captainLocation, userLocation, resolvedPickup, resolvedDestination])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !isMapLoaded || !resolvedPickup || !resolvedDestination) return

    let isCancelled = false

    const loadRoute = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${resolvedPickup.lng},${resolvedPickup.lat};${resolvedDestination.lng},${resolvedDestination.lat}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
        )
        const data = await response.json()
        const route = data?.routes?.[0]?.geometry?.coordinates || []
        if (isCancelled || !route.length) return

        routeCoordinatesRef.current = route
        const routeSource = map.getSource('ride-route-source')
        if (routeSource) {
          routeSource.setData(buildLineFeature(route))
        }
      } catch {
        routeCoordinatesRef.current = []
      }
    }

    loadRoute()

    return () => {
      isCancelled = true
    }
  }, [resolvedPickup, resolvedDestination, isMapLoaded])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const syncMarker = (markerRef, point, type) => {
      if (!point) {
        markerRef.current?.remove()
        markerRef.current = null
        return
      }

      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({
          element: createMarkerElement(type)
        })
          .setLngLat([point.lng, point.lat])
          .addTo(map)
      } else {
        markerRef.current.setLngLat([point.lng, point.lat])
      }
    }

    syncMarker(userMarkerRef, userLocation, 'user')
    syncMarker(captainMarkerRef, captainLocation, 'captain')
    syncMarker(pickupMarkerRef, resolvedPickup, 'pickup')
    syncMarker(destinationMarkerRef, resolvedDestination, 'destination')

    const progressSource = map.getSource('ride-progress-source')
    const routeCoordinates = routeCoordinatesRef.current
    if (progressSource && routeCoordinates.length && resolvedPickup) {
      const trackerPoint = captainLocation || resolvedPickup
      const nearestIndex = getNearestRouteIndex(routeCoordinates, trackerPoint)

      if (nearestIndex >= 0) {
        const coveredCoordinates = routeCoordinates
          .slice(0, nearestIndex + 1)
          .concat([[trackerPoint.lng, trackerPoint.lat]])
        progressSource.setData(buildLineFeature(coveredCoordinates))
      } else {
        progressSource.setData(buildLineFeature([]))
      }
    }

    const points = [
      userLocation,
      captainLocation,
      resolvedPickup,
      resolvedDestination
    ].filter(Boolean)

    if (points.length > 1) {
      const bounds = new mapboxgl.LngLatBounds()
      points.forEach(point => bounds.extend([point.lng, point.lat]))
      map.fitBounds(bounds, { padding: 80, maxZoom: 16, duration: 800 })
      return
    }

    if (points.length === 1) {
      const focus = points[0]
      map.easeTo({
        center: [focus.lng, focus.lat],
        duration: 700,
        zoom: 15
      })
    }
  }, [captainLocation, userLocation, resolvedPickup, resolvedDestination])

  return (
    <div className='relative h-full w-full'>
      <div ref={mapContainerRef} className='h-full w-full' />
      <div className='pointer-events-none absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow'>
        Live Ride Tracking
      </div>
    </div>
  )
}

export default RideTrackingMap
