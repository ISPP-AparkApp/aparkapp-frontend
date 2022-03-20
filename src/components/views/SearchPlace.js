import React, { useEffect, useState, useRef } from 'react';
import { GMap } from 'primereact/gmap';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { loadGoogleMaps, removeGoogleMaps } from '../../utils/GoogleMaps';
import { getKm } from '../../utils/getKm';
import "../../css/views/SearchPlace.css";
import { getAnnouncements } from '../../api/api';

const SearchPlace = () => {

  const [googleMapsReady, setGoogleMapsReady] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [markerTitle, setMarkerTitle] = useState('');
  const [draggableMarker, setDraggableMarker] = useState(false);
  const [overlays, setOverlays] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [location, setLocation] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const toast = useRef(null);
  const infoWindow = useRef(null);

  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
    })
  }

  useEffect(() => {
    getCurrentLocation()
    getAnnouncements().then(data => setAnnouncements(data))
    loadGoogleMaps(() => {
      setGoogleMapsReady(true);
    });

    return () => {
      removeGoogleMaps();
    }
  }, [])

  const onMapClick = (event) => {
    setDialogVisible(true);
    setSelectedPosition(event.latLng)
  }

  const onOverlayClick = (event) => {
    let isMarker = event.overlay.getTitle !== undefined;

    if (isMarker) {
      let title = event.overlay.getTitle();
      infoWindow.current = infoWindow.current || new window.google.maps.InfoWindow();
      infoWindow.setContent('<div>' + title + '</div>');
      infoWindow.open(event.map, event.overlay);
      event.map.setCenter(event.overlay.getPosition());

      toast.current.show({ severity: 'info', summary: 'Marker Selected', detail: title });
    }
    else {
      toast.current.show({ severity: 'info', summary: 'Shape Selected', detail: '' });
    }
  }

  const handleDragEnd = (event) => {
    toast.current.show({ severity: 'info', summary: 'Marker Dragged', detail: event.overlay.getTitle() });
  }

  const addMarker = () => {
    let newMarker = new window.google.maps.Marker({
      position: {
        lat: selectedPosition.lat(),
        lng: selectedPosition.lng()
      },
      title: markerTitle,
      draggable: draggableMarker
    });

    setOverlays([...overlays, newMarker]);
    setDialogVisible(false);
    setDraggableMarker(false);
    setMarkerTitle('');
  }

  function extractLocation(location) {
    let locationArr = location.split(',')
    return {
      lat: parseFloat(locationArr[0]),
      lng: parseFloat(locationArr[1])
    }
  }

  const onMapReady = (event) => {
    var groupedAnnouncements = {}
    announcements.forEach(announcement => {
      groupedAnnouncements[announcement.id] = false
    })

    var groups = []
    announcements.forEach(a1 => {
      if (!groupedAnnouncements[a1.id]) {
        var group = [a1]
        announcements.forEach(a2 => {
          const distance = getKm(extractLocation(a1.location).lat, extractLocation(a1.location).lng, extractLocation(a2.location).lat, extractLocation(a2.location).lng)
          if (distance < 1.5 && a1.id !== a2.id) {
            group.push(a2)
            groupedAnnouncements[a2.id] = true
          }
        })
        groups.push(group)
        groupedAnnouncements[a1.id] = true
      }
    })

    groups.forEach(group => {
      var groupLocation = { lat: 0, lng: 0 }
      group.forEach(announcement => {
        groupLocation.lat += extractLocation(announcement.location).lat
        groupLocation.lng += extractLocation(announcement.location).lng
      })

      groupLocation.lat /= group.length
      groupLocation.lng /= group.length

      overlays.push(new window.google.maps.Circle({ center: groupLocation, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500 }))
    })

    setOverlays(overlays)
  }

  const onHide = (event) => {
    setDialogVisible(false);
  }

  const options = {
    center: location,
    zoom: 12
  };

  const footer = <div>
    <Button label="Yes" icon="pi pi-check" onClick={addMarker} />
    <Button label="No" icon="pi pi-times" onClick={onHide} />
  </div>;

  return (
    <div>
      <Toast ref={toast}></Toast>

      {
        googleMapsReady && (
          <GMap overlays={overlays} options={options} className="map" onMapReady={onMapReady}
            onMapClick={onMapClick} onOverlayClick={onOverlayClick} onOverlayDragEnd={handleDragEnd} />
        )
      }

      <Dialog header="New Location" visible={dialogVisible} width="300px" modal footer={footer} onHide={onHide}>
        <div className="grid p-fluid">
          <div className="col-2" style={{ paddingTop: '.75em' }}><label htmlFor="title">Label</label></div>
          <div className="col-10"><InputText type="text" id="title" value={markerTitle} onChange={(e) => setMarkerTitle(e.target.value)} /></div>

          <div className="col-2" style={{ paddingTop: '.75em' }}>Lat</div>
          <div className="col-10"><InputText readOnly value={selectedPosition ? selectedPosition.lat() : ''} /></div>

          <div className="col-2" style={{ paddingTop: '.75em' }}>Lng</div>
          <div className="col-10"><InputText readOnly value={selectedPosition ? selectedPosition.lng() : ''} /></div>

          <div className="col-2" style={{ paddingTop: '.75em' }}><label htmlFor="drg">Drag</label></div>
          <div className="col-10"><Checkbox checked={draggableMarker} onChange={(event) => setDraggableMarker(event.checked)} /></div>
        </div>
      </Dialog>
    </div>
  );
}

export default SearchPlace;