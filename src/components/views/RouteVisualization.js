import { GMap } from "primereact/gmap";
import React, { useState, useEffect } from "react";
import { loadGoogleMaps, removeGoogleMaps, initMap } from "../../utils/GoogleMaps";

function RouteVisualization() {
    const [googleMapsReady, setGoogleMapsReady] = useState(false);
    const [mapLocation, setMapLocation] = useState(null);
    const overlays = [
        new window.google.maps.Marker({ position: { lat: 36.879466, lng: 30.667648 }, title: "Konyaalti" }),
        new window.google.maps.Marker({ position: { lat: 36.883707, lng: 30.689216 }, title: "Ataturk Park" }),
        new window.google.maps.Marker({ position: { lat: 36.885233, lng: 30.702323 }, title: "Oldtown" }),
        new window.google.maps.Polygon({
            paths: [
                { lat: 36.9177, lng: 30.7854 }, { lat: 36.8851, lng: 30.7802 }, { lat: 36.8829, lng: 30.8111 }, { lat: 36.9177, lng: 30.8159 }
            ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
        }),
        new window.google.maps.Circle({ center: { lat: 36.90707, lng: 30.56533 }, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500 }),
        new window.google.maps.Polyline({ path: [{ lat: 36.86149, lng: 30.63743 }, { lat: 36.86341, lng: 30.72463 }], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2 })
    ];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setMapLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });

        loadGoogleMaps(() => {
            setGoogleMapsReady(true);
        });

        initMap();

        return () => {
            removeGoogleMaps();
        };
    }, []);
    const map_options = {
        center: mapLocation,
        zoom: 12,
    };
    return (
        <div>
            {googleMapsReady && (
                <GMap
                    overlays={overlays}
                    options={map_options}
                    className="map"
                    style={{ width: "100%", minHeight: "520px" }}
                />
            )}
        </div>
    );
}

export default RouteVisualization;
