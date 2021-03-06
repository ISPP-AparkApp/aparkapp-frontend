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
import { dateFormatter } from '../../utils/dateFormatter';
import { Slider } from 'primereact/slider';
import { addLocale } from "primereact/api";

addLocale("es", {
    firstDayOfWeek: 1,
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ],
});

const Publish = () => {
    const [vehicle, setVehicle] = useState('');
    const [date, setDate] = useState(new Date());
    const [waitTime, setWaitTime] = useState(0);
    const [price, setPrice] = useState(0.5);
    const [extension, setExtension] = useState('No');
    const [location, setLocation] = useState("");
    const [type, setType] = useState();
    const [limitedMobility, setLimitedMobility] = useState("No");
    const [vehicles, setVehicles] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [mapLocation, setMapLocation] = useState(null);
    const [googleMapsReady, setGoogleMapsReady] = useState(false);
    const [overlays, setOverlays] = useState([]);
    const [draggableMarker, setDraggableMarker] = useState(false);
    const [markerLocation, setMarkerLocation] = useState('');


    const options = ["S??", "No"];
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
        if(!vehicle) errors.vehicle = "Veh??culo requerido"
        if(!date) errors.date = "Fecha requerida"
        if(date < new Date()) errors.date = "Fecha no puede ser anterior a la actual"
        if(!waitTime && waitTime !== 0) errors.waitTime = "Tiempo de espera requerido"
        if(!price) errors.price = "Precio requerido"
        if(!location) errors.location = "Ubicaci??n requerida"
        if(!type) errors.type = "Tipo de aparcamiento requerido"
        if(!limitedMobility) errors.limitedMobility = "Movilidad limitada requerida"

        if (location){
            const latLng = location.split(',')
            if(latLng.length !== 2){
                errors.location = "Ubicaci??n inv??lida"
            }
        }
        setFormErrors(errors)

        if (!Object.keys(errors).length) {
            publishAnnouncement();
        }

    }

    const publishAnnouncement = async () => {
        let vehicleSelected = await vehicles.find(v => v.license_plate === vehicle);
        let vehicleId = vehicleSelected.id;
        const announcementData = {
            date: dateFormatter(date),
            wait_time: waitTime,
            price: price,
            allow_wait: extension === "S??" ? true : false,
            latitude: parseFloat(location.split(',')[0]),
            longitude: parseFloat(location.split(',')[1]),
            zone: type,
            limited_mobility: limitedMobility === "S??" ? true : false,
            vehicle: vehicleId,
        }
        let res = await publish(announcementData);
        if (res === true){
            msgs.current.show({severity: 'success', summary: 'Anuncio publicado'});
        }else{
            msgs.current.show({severity: 'error', summary: 'El anuncio ya existe'});
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
            <Button className="p-button-cancel" label="Cancelar" icon="pi pi-times" onClick={cancell} />
        </div>;

    const map_options = {
        center: mapLocation,
        zoom: 20
    };

    const onMapClick = (event) => {
        addMarker(event.latLng)
        setMarkerLocation(event.latLng.lat() + ',' + event.latLng.lng())
        msgs2.current.show({severity: 'success', summary: 'Ubicaci??n seleccionada correctamente'});
      }

    const addMarker = (latLng) => {
        let newMarker = new window.google.maps.Marker({
          position: {
            lat: latLng.lat(),
            lng: latLng.lng()
          },
          title: "Ubicaci??n de la plaza",
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
                        <span className='text-xl publish_label mb-2 mt-3'>Selecciona tu veh??culo</span>
                        <Dropdown className='input_text' value={vehicle} options={vehicles.map(v=>v.license_plate)} onChange={(e)=> setVehicle(e.value)} />
                        {getFieldError("vehicle")}

                        <span className='text-xl publish_label mb-2 mt-3'>??Cu??ndo vas a dejar la plaza?</span>
                        <Calendar id="time" value={date} showTime onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" locale="es" hourFormat="12" />
                        {getFieldError("date")}

                        <span className='text-xl publish_label mb-2 mt-3'>??Cu??nto tiempo estas dispuesto a esperar?</span>
                        <InputNumber inputId="waitTime" value={waitTime} onValueChange={(e) => setWaitTime(e.value)} suffix=" minuto/s" showButtons min={0} max={30} />
                        {getFieldError("waitTime")}

                        <span className='text-xl publish_label mb-2 mt-3'>??Qu?? precio quieres establecer? {price} ???</span>
                        <Slider value={price} onChange={(e) => setPrice(e.value)} min={0.5} max={10} step={0.1} />
                        {getFieldError("price")}

                        <span className='text-xl publish_label mb-2 mt-3'>??Aceptar??as esperar m??s por m??s dinero?</span>
                        <SelectButton unselectable={false} className='mb-3' value={extension} options={options} onChange={(e) => setExtension(e.value)} />
                        {getFieldError("extension")}

                        <span className='text-xl publish_label mb-2 mt-3'>??D??nde se encuentra la plaza?</span>

                        <div className='grid'>
                            <div className='col-10'>
                                <InputText className="input_text w-full" value={location !== ""? "Ubicaci??n seleccionada": ""} disabled />
                            </div>
                            <div className='col-2'>
                                <Button className="w-full map-button" icon="pi pi-map-marker" onClick={()=>visualiseMap()} />
                            </div>
                        </div>
                        <Button label="Ubicaci??n actual" className="p-button-link" onClick={()=>
                                navigator.geolocation.getCurrentPosition(function(position) {
                                    setLocation(position.coords.latitude + "," + position.coords.longitude);
                            })}/>
                        {getFieldError("location")}

                        <span className='text-xl publish_label mb-2 mt-3'>??De qu?? tipo de plaza se trata?</span>
                        <Dropdown  value={type} options={parkTypes} onChange={(e)=> setType(e.value)} />
                        {getFieldError("type")}

                        <span className='text-xl publish_label mb-2 mt-3'>??Se trata de una plaza de movilidad limitada?</span>
                        <SelectButton unselectable={false} value={limitedMobility} options={options} onChange={(e) => setLimitedMobility(e.value)} />
                        {getFieldError("limitedMobility")}

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