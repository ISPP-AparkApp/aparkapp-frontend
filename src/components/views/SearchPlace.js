import React, { useEffect, useState, useRef } from 'react';
import { GMap } from 'primereact/gmap';
import { Toast } from 'primereact/toast';
import { loadGoogleMaps, removeGoogleMaps } from '../../utils/GoogleMaps';
import { getKm } from '../../utils/getKm';
import "../../css/views/SearchPlace.css";
import "../../../node_modules/primereact/datascroller/datascroller.min.css"
import { getAnnouncements } from '../../api/api';
import ListAds from './ListAds';
import { ProgressSpinner } from 'primereact/progressspinner';

const SearchPlace = () => {
  const [googleMapsReady, setGoogleMapsReady] = useState(false);
  const [overlays, setOverlays] = useState([]);
  const [location, setLocation] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsCircle, setAnnouncementsCircle] = useState({});
  const [announcementsSelecteds, setAnnouncementsSelecteds] = useState([]);
  const [listAdsVisible, setListAdsVisible] = useState(false);


  const toast = useRef(null);
  const infoWindow = useRef(null);

  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
    })
  }

  useEffect(() => {
    getCurrentLocation()
    getAnnouncements().then(data => setAnnouncements(data, loadGoogleMaps(() => {
      setGoogleMapsReady(true);
    })))

    return () => {
      removeGoogleMaps();
    }
  }, [])

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
      let selected = event.overlay.center.toString()
      selected = selected.replace(/[()]/g, '').replace(/ /g, '');
      setAnnouncementsSelecteds(announcementsCircle[selected])
      setListAdsVisible(true)
    }
  }

  const handleDragEnd = (event) => {
    toast.current.show({ severity: 'info', summary: 'Marker Dragged', detail: event.overlay.getTitle() });
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
          const distance = getKm(a1.latitude, a1.longitude, a2.latitude, a2.longitude)
          if (distance < 0.5 && a1.id !== a2.id) {
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
        groupLocation.lat += announcement.latitude
        groupLocation.lng += announcement.longitude
      })

      groupLocation.lat /= group.length
      groupLocation.lng /= group.length

      announcementsCircle[groupLocation.lat + "," + groupLocation.lng] = group
      overlays.push(new window.google.maps.Circle({ center: groupLocation, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 500 }))
    })

    setAnnouncementsCircle(announcementsCircle)
    setOverlays(overlays)
  }

  const onHideListAds = (event) => {
    setListAdsVisible(false);
  }

  const options = {
    center: location,
    zoom: 12
  };

  return (
    <div className=''>
      <Toast ref={toast}></Toast>

      <div className='block h-30rem'>
        {
          googleMapsReady ? (
            <GMap overlays={overlays} options={options} className="map" onMapReady={onMapReady}
              onOverlayClick={onOverlayClick} onOverlayDragEnd={handleDragEnd} />
          ) : <ProgressSpinner />
        }
      </div>
      <Dialog visible={listAdsVisible} onHide={onHideListAds}>
        <ListAds announcements={announcementsSelecteds}></ListAds>
      </Dialog>
      
    </div>

  );
}

export default SearchPlace;