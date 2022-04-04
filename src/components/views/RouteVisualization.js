import { IconButton } from '@chakra-ui/react'
import { FaLocationArrow } from 'react-icons/fa'
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api'
import { useState, useEffect } from 'react'
import { Card } from 'primereact/card';

function RouteVisualization({ announceLocation }) {
    const [map, setMap] = useState(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [center, setCenter] = useState(null)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const c = { lat: position.coords.latitude, lng: position.coords.longitude }
            calculateRoute(c, announceLocation);
            setCenter(c)
        })
    }, [announceLocation])

    function zoomToCenter() {
        navigator.geolocation.getCurrentPosition((position) => {
            const c = { lat: position.coords.latitude, lng: position.coords.longitude }
            map.panTo(c)
            map.setZoom(15)
            setCenter(c)
        })
    }

    async function calculateRoute(origin, destination) {
        const directionsService = new window.google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
        })
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
    }

    return (
        <div className='block h-30rem map'>
            <GoogleMap
                center={center}
                zoom={15}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
                onLoad={map => setMap(map)}
            >
                <Marker position={center} />
                {directionsResponse && (
                    <DirectionsRenderer directions={directionsResponse} />
                )}
            </GoogleMap>

            <Card title="Información">
                <p className="text-xl publish_label mb-2 mt-1">Distance: {distance} Duration: {duration}</p>
                <IconButton
                    aria-label='center back'
                    icon={<FaLocationArrow />}
                    isRound
                    onClick={zoomToCenter}
                />
            </Card>
        </div>
    )
}

export default RouteVisualization