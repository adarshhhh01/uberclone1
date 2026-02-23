import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
if (typeof mapboxgl.setTelemetryEnabled === 'function') {
    mapboxgl.setTelemetryEnabled(false)
}

const LiveTracking = () => {
    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const markerRef = useRef(null)

    useEffect(() => {
        if (mapRef.current || !mapContainer.current) return

        const initMap = (latitude, longitude) => {
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [ longitude, latitude ],
                zoom: 15,
                performanceMetricsCollection: false
            })

            markerRef.current = new mapboxgl.Marker()
                .setLngLat([ longitude, latitude ])
                .addTo(mapRef.current)
            
                
        }

        const fallbackCenter = { latitude: 28.6139, longitude: 77.2090 }
        const onGeoSuccess = (position) => {
            const { latitude, longitude } = position.coords
            if (!mapRef.current) {
                initMap(latitude, longitude)
            }
            if (markerRef.current) {
                markerRef.current.setLngLat([ longitude, latitude ])
            }
            if (mapRef.current) {
                mapRef.current.setCenter([ longitude, latitude ])
            }
        }

        const onGeoError = () => {
            if (!mapRef.current) {
                initMap(fallbackCenter.latitude, fallbackCenter.longitude)
            }
        }

        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
            enableHighAccuracy: true,
            timeout: 10000
        })

        const watchId = navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, {
            enableHighAccuracy: true
        })

        return () => {
            navigator.geolocation.clearWatch(watchId)
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [])

    return <div ref={mapContainer} className='w-full h-screen' />
}

export default LiveTracking
