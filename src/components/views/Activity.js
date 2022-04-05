import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import "../../css/views/Activity.css";
import { getBookings } from '../../api/api';
import { getMyAnnnouncements, getVehicles, editAnnouncement } from '../../api/api';
import { dateFormatter } from '../../utils/dateFormatter';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Link } from 'react-router-dom';
import { SelectButton } from 'primereact/selectbutton';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Messages } from 'primereact/messages';
import { GMap } from 'primereact/gmap';
import { loadGoogleMaps, removeGoogleMaps } from '../../utils/GoogleMaps';
import { regexLatitudeLongitude } from '../../utils/latLongRegex';


const AnnouncementCard = ({ setSelectedAnnouncement, setDialogVisible, announcement }) => {

    let activityStatus;
    if (announcement.cancelled) activityStatus = "Cancelado";
    if (Date.parse(announcement.date) > Date.now()) {
        activityStatus = "En curso"
    } else {
        activityStatus = "Finalizado"
    }

    const visualiseDialog = () => {
        setSelectedAnnouncement(announcement)
        setDialogVisible(true);
    }

    const notificationButton = () => {
        let result = ""

        
        if (announcement.status !== "Departure" && announcement.status !== "DenyDelay" && (Date.parse(announcement.date) + announcement.wait_time * 60000) >= Date.now()) {
            result = <div className="col-12">
                <Link to={`/notifications/${announcement.id}`}>
                    <Button className="p-button-raised p-button-lg w-full h-full" label="Notificaciones" icon="pi pi-bell" />
                </Link>
            </div>
        }
        return result;
    }

    return (
        // TODO obtain vehicle properties
        <Card className="activityCard" title={activityStatus}>
            <div className="flex flex-column pb-5">
                <ul className="mt-0">
                    <li><strong>Matrícula:</strong> {announcement.vehicle.license_plate}</li>
                    <li><strong>Fecha y hora: </strong>{dateFormatter(new Date(announcement.date))}</li>
                    <li><strong>Dirección: </strong> {announcement.location}</li>
                    <li><strong>Marca: </strong> {announcement.vehicle.brand}</li>
                    <li><strong>Modelo: </strong> {announcement.vehicle.model}</li>
                    <li><strong>Color: </strong> {announcement.vehicle.color}</li>
                    <li><strong>Tiempo de espera:</strong> {announcement.wait_time} min</li>
                    <li><strong>Precio:</strong> {announcement.price} €</li>
                </ul>
            </div>
            <div className="grid w-full">
                <div className="col-12">
                    <Button className="p-button-raised p-button-lg w-full h-full p-button-cancel" label="Cancelar" icon="pi pi-times" />
                </div>
                <div className="col-12">
                    <Button className="p-button-raised p-button-lg w-full h-full" label="Editar anuncio" icon="pi pi-pencil" onClick={visualiseDialog} />
                </div>
                {notificationButton()}
            </div>
        </Card>
    )
}

const BookingCard = ({ announcement }) => {
    let activityStatus;
    if (announcement.cancelled) activityStatus = "Cancelado";
    if (Date.parse(announcement.date) > Date.now()) {
        activityStatus = "En curso"
    } else {
        activityStatus = "Finalizado"
    }

    const notificationButton = () => {
        let result = ""

        if (announcement.status !== "Departure" && announcement.status !== "DenyDelay" && (Date.parse(announcement.date) + announcement.wait_time * 60000) >= Date.now()) {
            result = <div className="col-12">
                <Link to={`/route/${announcement.id}`}>
                    <Button className="p-button-raised p-button-lg w-full h-full" label="Cómo llegar" icon="pi pi-map-marker" />
                </Link>
            </div>
        }
        return result;
    }



    return (
        <Card className="activityCard" title={activityStatus}>
            <div className="flex flex-column pb-5">
                <ul className="mt-0">
                    <li><strong>Matrícula:</strong>{announcement.vehicle.license_plate}</li>
                    <li><strong>Fecha y hora: </strong>{dateFormatter(new Date(announcement.date))}</li>
                    <li><strong>Dirección: </strong> {announcement.location}</li>
                    <li><strong>Marca: </strong> {announcement.vehicle.brand}</li>
                    <li><strong>Modelo: </strong> {announcement.vehicle.model}</li>
                    <li><strong>Color: </strong> {announcement.vehicle.color}</li>
                    <li><strong>Tiempo de espera:</strong> {announcement.wait_time} min</li>
                    <li><strong>Precio: </strong> {announcement.price} €</li>
                </ul>
            </div>
            {announcement.cancelled ? "" :
                <div className="grid w-full">
                    <div className="col-12">
                        <Button className="p-button-raised p-button-lg w-full h-full p-button-cancel" label="Cancelar" icon="pi pi-times" />
                    </div>
                    {notificationButton()}
                </div>
            }
        </Card>
    )
}

const Activity = () => {
    const [bookings, setBookings] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [vehicles, setVehicles] = useState([]);

    const [vehicle, setVehicle] = useState('');
    const [date, setDate] = useState(new Date());
    const [waitTime, setWaitTime] = useState(0);
    const [price, setPrice] = useState(0.);
    const [extension, setExtension] = useState('No');
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [limitedMovility, setLimitedMovility] = useState("No");
    const [formErrors, setFormErrors] = useState({})
    const msgs = useRef(null);
    const msgs2 = useRef(null);

    const [mapLocation, setMapLocation] = useState(null);
    const [googleMapsReady, setGoogleMapsReady] = useState(false);
    const [overlays, setOverlays] = useState([]);
    const [draggableMarker, setDraggableMarker] = useState(false);
    const [markerLocation, setMarkerLocation] = useState('');
    const [dialogVisible2, setDialogVisible2] = useState(false);

    useEffect(() => {
        getBookings().then(data => {
            setBookings(data)
        })
        getMyAnnnouncements().then(data => {
            setAnnouncements(data)
        })
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
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        async function selectedAnnouncementCallback() {
            if (selectedAnnouncement !== null) {
                setVehicle(selectedAnnouncement.vehicle.license_plate)
                setDate(dateFormatter(new Date(selectedAnnouncement.date)));
                setWaitTime(selectedAnnouncement.wait_time);
                setPrice(selectedAnnouncement.price);
                setExtension(selectedAnnouncement.allow_wait ? "Sí" : "No");
                setLocation(selectedAnnouncement.location);
                setType(selectedAnnouncement.zone);
                setLimitedMovility(selectedAnnouncement.limited_movility ? "Sí" : "No");
            }
        }
        selectedAnnouncementCallback();
    }, [selectedAnnouncement])


    const onHide = (event) => {
        setSelectedAnnouncement(null)
        setDialogVisible(false);
    }

    const getFieldError = (fieldName) => {
        return formErrors[fieldName] && <span className="messageError">{formErrors[fieldName]}</span>
    }

    const validate = () => {
        const errors = {}
        if (!vehicle) errors.vehicle = "Vehículo requerido"
        if (!date) errors.date = "Fecha requerida"
        if (!waitTime && waitTime !== 0) errors.waitTime = "Tiempo de espera requerido"
        if (!price) errors.price = "Precio requerido"
        if (!location) errors.location = "Ubicación requerida"
        if (!type) errors.type = "Tipo de aparcamiento requerido"
        if (!limitedMovility) errors.limitedMovility = "Movilidad limitada requerida"
        setFormErrors(errors)

        if (!Object.keys(errors).length) {
            processForm();
        }

    }
    const processForm = async (event) => {
        let vehicleSelected = await vehicles.find(v => v.license_plate === vehicle);
        let vehicleId = vehicleSelected.id;

        const announcementData = {
            id: selectedAnnouncement.id,
            date: date,
            wait_time: waitTime,
            price: price,
            allow_wait: extension === "Sí" ? true : false,
            latitude: regexLatitudeLongitude(location) ? parseFloat(location.split(',')[0]) : selectedAnnouncement.latitude,
            longitude: regexLatitudeLongitude(location) ? parseFloat(location.split(',')[1]) : selectedAnnouncement.longitude,
            zone: type,
            limited_movility: limitedMovility === "Sí" ? true : false,
            vehicle: vehicleId,
        }
        let res = await editAnnouncement(announcementData)
        if (res === true) {
            getBookings().then(data => {
                setBookings(data)
            })
            getMyAnnnouncements().then(data => {
                setAnnouncements(data)
            })
            setDialogVisible(false)
            msgs.current.show({ severity: 'success', summary: 'Anuncio modificado' });
        } else {
            const errors = {}
            errors.global = res
            setFormErrors(errors)
        }
    }

    const footer =
        <div>
            <Button label="Guardar" icon="pi pi-check" onClick={validate} />
            <Button className="p-button-cancel" label="Cancelar" icon="pi pi-times" onClick={onHide} />
        </div>;

    const parkTypes = ["Zona libre", "Zona Azul", "Zona Verde", "Zona Roja", "Zona Naranja", "Zona MAR"];

    const map_options = {
        center: mapLocation,
        zoom: 20
    };

    const visualiseMap = () => {
        setOverlays([], setDialogVisible2(true));
    }

    const onHide2 = (event) => {
        setDialogVisible2(false);
    }

    const onMapClick = (event) => {
        addMarker(event.latLng)
        setMarkerLocation(event.latLng.lat() + ',' + event.latLng.lng())
        msgs2.current.show({ severity: 'success', summary: 'Ubicación seleccionada correctamente' });
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

    const cancellMap = (event) => {
        setLocation('');
        setDialogVisible2(false);
    }

    const confirmMap = (event) => {
        setDialogVisible2(false);
        setLocation(markerLocation);
    }

    const footerMap = 
      <div>
          <Button label="Confirmar" icon="pi pi-check" onClick={confirmMap}  />
          <Button className="p-button-cancel" icon="pi pi-times" onClick={cancellMap} />
      </div>;

    return (
        <div>
            <Messages ref={msgs} />
            <div className="grid w-full px-5 pt-5">
                {bookings.map(bookingProps => (
                    <div key={bookingProps.id} className="col-12 md:col-6 xl:col-4">
                        <BookingCard {...bookingProps}></BookingCard>
                    </div>
                ))}
                {announcements.map(announcementProps => (
                    <div key={announcementProps.id} className="col-12 md:col-6 xl:col-4">
                        <AnnouncementCard
                            setSelectedAnnouncement={setSelectedAnnouncement}
                            setDialogVisible={setDialogVisible} announcement={announcementProps}>
                        </AnnouncementCard>
                    </div>
                ))}
            </div>

            <div className="flex flex-column justify-content-center align-items-center h-fit mx-0 text-center overflow-hidden">
                {bookings.length === 0 && announcements.length === 0 ? (
                    <Card title={"Parece que aún no tienes actividades"} style={{ color: "black" }}></Card>
                ) : ""}
            </div>

            <Dialog header="Editar anuncio" visible={dialogVisible} modal footer={footer} onHide={onHide} className="activity-dialog" draggable={false}>
                <div className="flex flex-column">
                    <span className='text-xl publish_label mb-2 mt-3'>Selecciona tu vehículo</span>
                    <Dropdown className='input_text' value={vehicle} options={vehicles.map(v => v.license_plate)} onChange={(e) => setVehicle(e.value)} />
                    {getFieldError("vehicle")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿Cuándo vas a dejar la plaza?</span>
                    <Calendar id="time" placeholder={date} onChange={(e) => setDate(dateFormatter(e.value))} showTime hourFormat="12" />
                    {getFieldError("date")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿Cuánto tiempo estas dispuesto a esperar?</span>
                    <InputNumber inputId="waitTime" value={waitTime} onValueChange={(e) => setWaitTime(e.value)} suffix=" minuto/s" showButtons min={0} max={30} />
                    {getFieldError("waitTime")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿Qué precio quieres establecer?</span>
                    <InputNumber inputId="currency-germany" value={price} onValueChange={(e) => setPrice(e.value)} mode="currency" currency="EUR" locale="de-DE" min={0.5} max={10} />
                    {getFieldError("price")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿Aceptarías esperar más por más dinero?</span>
                    <SelectButton unselectable={false} className='mb-3' value={extension} onChange={(e) => setExtension(e.value)} options={["Sí", "No"]} />
                    {getFieldError("extension")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿Dónde se encuentra la plaza?</span>
                    <div className='grid'>
                        <div className='col-10'>
                            <InputText className="input_text w-full" value={regexLatitudeLongitude(location) ? "Ubicación seleccionada" : location} disabled />
                        </div>
                        <div className='col-2'>
                            <Button className="w-full map-button" icon="pi pi-map-marker" onClick={() => visualiseMap()} />
                        </div>
                    </div>
                    <Button label="Ubicación actual" className="p-button-link" onClick={() =>
                        navigator.geolocation.getCurrentPosition(function (position) {
                            setLocation(position.coords.latitude + "," + position.coords.longitude);
                        })} />
                    {getFieldError("location")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿De qué tipo de plaza se trata?</span>
                    <Dropdown value={type} onChange={(e) => setType(e.value)} options={parkTypes} />
                    {getFieldError("type")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿Se trata de una plaza de movilidad limitada?</span>
                    <SelectButton unselectable={false} value={limitedMovility} onChange={(e) => setLimitedMovility(e.value)} options={["Sí", "No"]} />
                    {getFieldError("limitedMovility")}

                </div>
            </Dialog>

            <div className='w-full'>
                <Dialog header="Localiza tu plaza" visible={dialogVisible2} modal footer={footerMap} onHide={onHide2} className="map-dialog" draggable={false}>
                    <Messages ref={msgs2} />
                    <div className='relative'>
                        {
                            googleMapsReady && (
                                <GMap overlays={overlays} options={map_options} className="absolut" style={{ width: '100%', minHeight: '520px' }} onMapClick={onMapClick} />
                            )
                        }
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default Activity;