import React,{useState, useEffect, useRef} from 'react';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { publish, getVehicles} from '../../api/api';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { GMap } from 'primereact/gmap';
import { loadGoogleMaps, removeGoogleMaps } from '../../utils/GoogleMaps';


import "../../css/views/Publish.css";


const Publish = () => {
    const [vehicle, setVehicle] = useState('');
    const [date, setDate] = useState(new Date());
    const [waitTime, setWaitTime] = useState(0);
    const [price, setPrice] = useState(0.);
    const [extension, setExtension] = useState('No');
    const [location, setLocation] = useState("");
    const [type, setType] = useState();
    const [limitedMovility, setLimitedMovility] = useState("No");
    const [vehicles, setVehicles] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [mapLocation, setMapLocation] = useState(null);
    const [googleMapsReady, setGoogleMapsReady] = useState(false);
    const [overlays, setOverlays] = useState([]);
    const [draggableMarker, setDraggableMarker] = useState(false);
    const [markerLocation, setMarkerLocation] = useState('');


    const options = ["Sí", "No"];
    const parkTypes = ["Zona libre","Zona Azul", "Zona Verde", "Zona Roja", "Zona Naranja","Zona MAR"];
    const msgs = useRef(null);
    const msgs2 = useRef(null);

    const [formErrors, setFormErrors] = useState({})

    useEffect(()=>{
        getVehicles().then(data => {
            setVehicles(data)
        })
        navigator.geolocation.getCurrentPosition((position) => {
            setMapLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          })
        
        loadGoogleMaps(() => {
            setGoogleMapsReady(true);
          })
      
        return () => {
            removeGoogleMaps();
        }
    },[])

    const getFieldError = (fieldName) => {
        return formErrors[fieldName] && <span className="messageError">{formErrors[fieldName]}</span>
    }

    const validate = () => {
        const errors = {}
        if(!vehicle) errors.vehicle = "Vehículo requerido"
        if(!date) errors.date = "Fecha requerida"
        if(date < new Date()) errors.date = "Fecha no puede ser anterior a la actual"
        if(!waitTime && waitTime !== 0) errors.waitTime = "Tiempo de espera requerido"
        if(!price) errors.price = "Precio requerido"
        if(!location) errors.location = "Ubicación requerida"
        if(!type) errors.type = "Tipo de aparcamiento requerido"
        if(!limitedMovility) errors.limitedMovility = "Movilidad limitada requerida"
        
        if (location){
            const latLng = location.split(',')
            if(latLng.length !== 2){
                errors.location = "Ubicación inválida"
            }
        }
        setFormErrors(errors)

        if (!Object.keys(errors).length) {
            publishAnnouncement();
        }

    }

    const dateFormatter = (date) => {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours(); 
        let minutes = date.getMinutes();
        return year + "-" + month + "-" + day +" "+ hour + ":" + minutes;
    }

    const publishAnnouncement = async () => {
        let vehicleSelected = await vehicles.find(v => v.license_plate === vehicle);
        let vehicleId = vehicleSelected.id;
        const announcementData = {
            date: dateFormatter(date),
            wait_time: waitTime,
            price: price,
            allow_wait: extension === "Sí" ? true : false,
            latitude: parseFloat(location.split(',')[0]),
            longitude: parseFloat(location.split(',')[1]),
            zone: type,
            limited_movility: limitedMovility === "Sí" ? true : false,
            vehicle: vehicleId,
        }
        let res = await publish(announcementData);
        if (res === true){
            msgs.current.show({severity: 'success', summary: 'Anuncio publicado'});
        }else{
            const errors = {}
            errors.global = res
            setFormErrors(errors)
        }
        window.scrollTo(0, 0)
    }

    const onHide = (event) => {
        setDialogVisible(false);
    }

    const cancell = (event) => {
        setLocation('');
        setDialogVisible(false);
    }

    const confirm = (event) => {
        setDialogVisible(false);
        setLocation(markerLocation);
    }

    const footer = 
        <div>
            <Button label="Confirmar" icon="pi pi-check" onClick={confirm}  />
            <Button label="Cancelar" icon="pi pi-times" onClick={cancell} />
        </div>;

    const map_options = {
        center: mapLocation,
        zoom: 20
    };

    const onMapClick = (event) => {
        addMarker(event.latLng)
        setMarkerLocation(event.latLng.lat() + ',' + event.latLng.lng())
        msgs2.current.show({severity: 'success', summary: 'Ubicación seleccionada correctamente'});
      }

    const addMarker = (latLng) => {
        let newMarker = new window.google.maps.Marker({
          position: {
            lat: latLng.lat(),
            lng: latLng.lng()
          },
          title: "Ubicación de la plaza",
          draggable: draggableMarker
        });
        setMarkerLocation(latLng.lat() + "," + latLng.lng());
        setOverlays([newMarker]);
        setDraggableMarker(false);
      }

    const visualiseMap = () => {
        setOverlays([],setDialogVisible(true));
    }
    return(
        <div>
            <div className="flex flex-column align-items-center px-3 md:px-0">
                <Messages ref={msgs} />
                <Card title="Publicar plaza" className="w-full md:w-auto">
                    <div className="flex flex-column ">
                        {getFieldError("global")}
                        <span className='text-xl publish_label mb-2 mt-3'>Selecciona tu vehículo</span>
                        <Dropdown className='input_text' value={vehicle} options={vehicles.map(v=>v.license_plate)} onChange={(e)=> setVehicle(e.value)} />
                        {getFieldError("vehicle")}

                        <span className='text-xl publish_label mb-2 mt-3'>¿Cuándo vas a dejar la plaza?</span>
                        <Calendar id="time" value={date} showTime onChange={(e) => setDate(e.value)} hourFormat="12" />
                        {getFieldError("date")}

                        <span className='text-xl publish_label mb-2 mt-3'>¿Cuánto tiempo estas dispuesto a esperar?</span>
                        <InputNumber inputId="waitTime" value={waitTime} onValueChange={(e) => setWaitTime(e.value)} suffix=" minuto/s" showButtons min={0} max={30} />
                        {getFieldError("waitTime")}

                        <span className='text-xl publish_label mb-2 mt-3'>¿Qué precio quieres establecer?</span>
                        <InputNumber inputId="currency-germany" value={price} onValueChange={(e) => setPrice(e.value)} mode="currency" currency="EUR" locale="de-DE"  min={0.5} max={10}/>
                        {getFieldError("price")}

                        <span className='text-xl publish_label mb-2 mt-3'>¿Aceptarías esperar más por más dinero?</span>
                        <SelectButton unselectable={false} className='mb-3' value={extension} options={options} onChange={(e) => setExtension(e.value)} />
                        {getFieldError("extension")}

                        <span className='text-xl publish_label mb-2 mt-3'>¿Dónde se encuentra la plaza?</span>
                        
                        <div className='grid'>
                            <div className='col-10'>
                                <InputText className="input_text w-full" value={location !== ""? "Ubicación seleccionada": ""} disabled />
                            </div>
                            <div className='col-2'>
                                <Button className="w-full map-button" icon="pi pi-map-marker" onClick={()=>visualiseMap()} />
                            </div>
                        </div>
                        <Button label="Ubicación actual" className="p-button-link" onClick={()=> 
                                navigator.geolocation.getCurrentPosition(function(position) {
                                    setLocation(position.coords.latitude + "," + position.coords.longitude);
                            })}/>
                        {getFieldError("location")}
                        
                        <span className='text-xl publish_label mb-2 mt-3'>¿De qué tipo de plaza se trata?</span>
                        <Dropdown  value={type} options={parkTypes} onChange={(e)=> setType(e.value)} />
                        {getFieldError("type")}

                        <span className='text-xl publish_label mb-2 mt-3'>¿Se trata de una plaza de movilidad limitada?</span>
                        <SelectButton unselectable={false} value={limitedMovility} options={options} onChange={(e) => setLimitedMovility(e.value)} />
                        {getFieldError("limitedMovility")}

                        <Button label="Publicar" className="p-button-raised p-button-lg mt-5" onClick={validate}/>
                    </div>
                </Card>
            </div>
            <div className='w-full'>
                <Dialog header="Localiza tu plaza" visible={dialogVisible} modal footer={footer} onHide={onHide} className="map-dialog" draggable={false}>
                    <Messages ref={msgs2} />
                    <div className='relative'>
                    {
                        googleMapsReady && (
                            <GMap overlays={overlays} options={map_options} className="absolut" style={{width: '100%', minHeight: '520px'}} onMapClick={onMapClick}/>
                        )
                    }
                    </div>
                </Dialog>
            </div>
        </div>
        )
}
export default Publish;