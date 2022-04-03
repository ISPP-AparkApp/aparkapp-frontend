import { Box, HStack, IconButton, Text } from '@chakra-ui/react'
import { FaLocationArrow } from 'react-icons/fa'
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api'
import { useState, useEffect } from 'react'

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

            <Box
                p={4}
                borderRadius='lg'
                m={4}
                bgColor='Green'
                shadow='base'
                minW='container.md'
                zIndex='1'
            >
                <HStack spacing={5} mt={5} justifyContent='space-between'>
                    <Text>Distance: {distance} </Text>
                    <Text>Duration: {duration} </Text>
                    <IconButton
                        aria-label='center back'
                        icon={<FaLocationArrow />}
                        isRound
                        onClick={() => {//Cambiar onClick por onChange o parecido para que no sea necesario pulsar
                            map.panTo(center)
                            map.setZoom(15)
                        }}
                    />
                </HStack>
            </Box>
        </div>
    )
}

export default RouteVisualization