import React, { useEffect, useState, useRef } from 'react';
import { GMap } from 'primereact/gmap';
import { Toast } from 'primereact/toast';
import { loadGoogleMaps, removeGoogleMaps } from '../../utils/GoogleMaps';
import { getKm } from '../../utils/getKm';
import "../../css/views/SearchPlace.css";
import "../../../node_modules/primereact/datascroller/datascroller.min.css"
import { getAnnouncements, addressToCoordinates } from '../../api/api';
import ListAds from './ListAds';
import { Slider } from 'primereact/slider';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const SearchPlace = () => {
  const [googleMapsReady, setGoogleMapsReady] = useState(false);
  const [overlays, setOverlays] = useState([]);
  const [location, setLocation] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsCircle, setAnnouncementsCircle] = useState({});
  const [announcementsSelecteds, setAnnouncementsSelecteds] = useState([]);
  const [address , setAddress] = useState('');
  const [priceFilter, setPriceFilter] = useState([0.0,1.0]);
  const [dateFilter, setDateFilter] = useState("");
  const [dialogVisibleFilter, setDialogVisibleFilter] = useState(false);
  const [listAdsVisible, setListAdsVisible] = useState(false);


  const toast = useRef(null);
  const infoWindow = useRef(null);
  const map = useRef(null);

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

  const onMapReady = (event, announcementsToGroup=null) => {
    if (announcementsToGroup === null){
      announcementsToGroup = announcements
    }
    var groupedAnnouncements = {}
    announcementsToGroup.forEach(announcement => {
      groupedAnnouncements[announcement.id] = false
    })
    var newOverlays = []
    var groups = []
    announcementsToGroup.forEach(a1 => {
      if (!groupedAnnouncements[a1.id]) {
        var group = [a1]
        announcementsToGroup.forEach(a2 => {
          const distance = getKm(a1.latitude, a1.longitude, a2.latitude, a2.longitude)
          if (distance < 0.25 && a1.id !== a2.id) {
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
      newOverlays.push(new window.google.maps.Circle({ center: groupLocation, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 250 }))
    })
    setAnnouncementsCircle(announcementsCircle)
    setOverlays(newOverlays)
  }

  const onHideListAds = (event) => {
    setListAdsVisible(false);
  }

  const onHideDialogFilter = (event) => {
    setDialogVisibleFilter(false);
  }

  const options = {
    center: location,
    zoom: 12
  };

  const filterAnnoncements = () => {
    var filteredAnnouncements = announcements.filter(announcement => {
      return announcement.price >= priceFilter[0] && announcement.price <= priceFilter[1]
    })

    if (dateFilter) {
        filteredAnnouncements = filteredAnnouncements.filter(announcement => {
        return new Date(announcement.date).toLocaleDateString() === dateFilter.toLocaleDateString()
      })
    }
    onMapReady(null,filteredAnnouncements)
    setDialogVisibleFilter(false)
}
  const filterFooter = <div>
    <Button label="Aplicar" icon="pi pi-check" onClick={filterAnnoncements} />
    <Button label="Limpiar" className="p-button-cancel" icon="pi pi-times" onClick={()=>{
      setPriceFilter([0.5,1.0])
      setDateFilter("")
      onMapReady()
      setDialogVisibleFilter(false)
    }} />
  </div>;



  const searchLocation = async(event) => {
    let addressObject = {
      location: address,
      one_result: true
    }
    try{
      let coordinates = await addressToCoordinates(addressObject)
      let lat = parseFloat(coordinates[1][0])
      let lng = parseFloat(coordinates[1][1])
      map.current.map.setCenter({lat: lat, lng: lng})
    }catch(e){
      toast.current.show({ severity: 'error', summary: 'Error', detail: "No se ha encontrado la ubicación" });
    }
  }

  return (
    <div>
      <Toast ref={toast}></Toast>
      <div className='w-full flex justify-content-center mt-3' >
        <InputText className="w-4" placeholder="Busca en la zona donde quieras aparcar" onChange={e=>setAddress(e.target.value)} />
        <Button icon="pi pi-search" className="ml-2" onClick={searchLocation} />
        <Button icon="pi pi-filter" className="ml-2" onClick={()=>setDialogVisibleFilter(true)} />
      </div>

      <div className='block h-30rem'>
        {
          googleMapsReady ? (
            <GMap ref={map} overlays={overlays} options={options} className="map" onMapReady={onMapReady}
              onOverlayClick={onOverlayClick} onOverlayDragEnd={handleDragEnd} />
          ) : <ProgressSpinner className='loadingMap'/>
        }
      </div>
      <Dialog visible={listAdsVisible} onHide={onHideListAds}>
        <ListAds announcements={announcementsSelecteds}></ListAds>
      </Dialog>

      <Dialog className='filter-dialog' header="Filtro" draggable={false} visible={dialogVisibleFilter} footer={filterFooter} onHide={onHideDialogFilter} resizable={false}>
        <div className="flex flex-column">
          <span className='text-xl publish_label mb-2'>¿Qué día deseas aparcar?</span>
          <Calendar minDate={new Date()} id="time" value={dateFilter} onChange={(e) => setDateFilter(e.value)} hourFormat="12" />

          <span className='text-xl publish_label mb-2 mt-3'>Escoge un rango de precios</span>
          <Slider value={priceFilter} onChange={(e) => setPriceFilter(e.value)} range min={0.5} max={10} step={0.1} />
          <div className="w-full price-range">
            <span className='text-m mb-2 '>{priceFilter[0]}€ - {priceFilter[1]}€</span>
          </div>
        </div>
      </Dialog>
    </div>

  );
}

export default SearchPlace;