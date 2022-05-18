import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import "../../css/views/Activity.css";
import { cancelReservation, cancelAnnouncement, getBookings } from '../../api/api';
import { getMyAnnnouncements, getVehicles, editAnnouncement } from '../../api/api';
import { dateFormatter, dateFormatterActivities } from '../../utils/dateFormatter';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { SelectButton } from 'primereact/selectbutton';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Messages } from 'primereact/messages';
import { GMap } from 'primereact/gmap';
import { loadGoogleMaps, removeGoogleMaps } from '../../utils/GoogleMaps';
import { regexLatitudeLongitude } from '../../utils/latLongRegex';
import { confirmDialog } from 'primereact/confirmdialog';
import { Slider } from 'primereact/slider';
import { Checkbox } from 'primereact/checkbox';
import { rateAnnouncement } from '../../api/api';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
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

const cancelAnnounce = async (id, setBookings, setAnnouncements, msgs, setFilteredBookings, setFilteredAnnouncements) => {
    const data = {
        cancelled: true,
    }
    let res = await cancelAnnouncement(id, data);
    if (res !== true) {
        msgs.current.show({ severity: 'error', detail: res });
        window.scrollTo(0, 0)
        return;
    }
    // the app is not reloaded automatically when cancel status changes
    getBookings().then(data => {
        setBookings(data)
        setFilteredBookings(data)
    })
    getMyAnnnouncements().then(data => {
        setAnnouncements(data)
        setFilteredAnnouncements(data)
    })
}

const AnnouncementCard = ({ setSelectedAnnouncement, setDialogVisible, announcement, setAnnouncements, setBookings, msgs, setRateAnnouncementDialog, setAnnouncementToRate, setFilteredBookings, setFilteredAnnouncements }) => {
    let activityStatus;
    if (announcement.reservation_set.length === 0 && (Date.parse(announcement.date) + announcement.wait_time * 60000) < Date.now() && !announcement.cancelled) {
        activityStatus = "No realizado"
    } else if (announcement.reservation_set.length > 0 && announcement.reservation_set[0].cancelled === true) {
        activityStatus = "Cancelado por el demandante";
    } else if (announcement.cancelled === true) {
        activityStatus = "Cancelado por mí";
    } else if ((Date.parse(announcement.date) + announcement.wait_time * 60000) < Date.now() || announcement.status === "Departure") {
        activityStatus = "Finalizado"
    } else if (announcement.reservation_set.length > 0) {
        activityStatus = "Reservado"
    } else {
        activityStatus = "Libre"
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
                    <Button className="p-button-raised p-button-lg w-full h-full p-button-noti" label="Notificaciones" icon="pi pi-bell" />
                </Link>
            </div>
        }
        return result;
    }

    const rateAnnouncement = (announcementId) => {
        setRateAnnouncementDialog(true)
        setAnnouncementToRate(announcementId)
    }
    return (
        <Card className="activityCard h-full" title={activityStatus}>
            <div className="flex flex-column pb-5">
                <ul className="mt-0">
                    <li><strong>Matrícula: </strong> {announcement.vehicle.license_plate}</li>
                    <li><strong>Fecha y hora: </strong>{dateFormatterActivities(new Date(announcement.date))}</li>
                    <li><strong>Dirección: </strong> {announcement.location}</li>
                    <li><strong>Marca: </strong> {announcement.vehicle.brand}</li>
                    <li><strong>Modelo: </strong> {announcement.vehicle.model}</li>
                    <li><div className='flex align-items-center'><strong>Color: </strong>{<input type="color" value={announcement.vehicle.color} disabled/>}</div></li>
                    <li><strong>Tiempo de espera:</strong> {announcement.wait_time} min</li>
                    <li><strong>Precio:</strong> {announcement.price} €</li>
                </ul>
            </div>
            {((Date.parse(announcement.date) + announcement.wait_time * 60000) < Date.now()) || announcement.status === "Departure" ? "" :
                <div className="grid w-full">
                    {announcement.reservation_set.length > 0 && announcement.reservation_set[0].cancelled === false && announcement.cancelled === false ?
                        notificationButton()
                        :
                        announcement.cancelled === false && activityStatus !== "Cancelado por el demandante" ?
                            <div className="col-12">
                                <div className="col-12">
                                    <Button className="p-button-raised p-button-lg w-full h-full" label="Editar anuncio" icon="pi pi-pencil" onClick={visualiseDialog} />
                                </div>
                                <div className="col-12">
                                    <Button className="p-button-raised p-button-lg w-full h-full p-button-cancel" label="Cancelar" icon="pi pi-times" onClick={() => cancelAnnounce(announcement.id, setBookings, setAnnouncements, msgs, setFilteredBookings, setFilteredAnnouncements)} />
                                </div>
                            </div>
                            : ""
                    }
                </div>
            }

            {activityStatus === "Finalizado" && !announcement.reservation_set[0].rated ?
                <div className="col-12">
                    <Button className="p-button-raised p-button-lg w-full h-full p-button-rate" label="Valorar" icon="pi pi-star" onClick={() => rateAnnouncement(announcement.reservation_set[0].id)} />
                </div>
                : ""
            }
        </Card>
    )
}


const cancelReserve = async (id, setAnnouncements, setBookings, setFilteredBookings, setFilteredAnnouncements) => {
    const data = {
        cancelled: true,
    }
    await cancelReservation(id, data);

    getBookings().then(data => {
        setBookings(data)
        setFilteredBookings(data)
    })
    getMyAnnnouncements().then(data => {
        setAnnouncements(data)
        setFilteredAnnouncements(data)
    })
}

const BookingCard = ({ cancelled, id, announcement, setBookings, setAnnouncements, setBookingToRate, setRateBookingDialog, setFilteredBookings, setFilteredAnnouncements }) => {
    let activityStatus;

    if (announcement.cancelled === true || cancelled === true) {
        activityStatus = "Cancelado por mí";
    } else if ((Date.parse(announcement.date) + announcement.wait_time * 60000) < Date.now() || announcement.status === "Departure") {
        activityStatus = "Finalizado"
    } else {
        activityStatus = "En curso"
    }

    const notificationButton = () => {
        let result = ""

        if (announcement.status !== "Departure" && (Date.parse(announcement.date) + announcement.wait_time * 60000) >= Date.now()) {
            result = <div className="col-12">
                <Link to={`/route/${announcement.id}`}>
                    <Button className="p-button-raised p-button-lg w-full h-full" label="Cómo llegar" icon="pi pi-map-marker" />
                </Link>
            </div>
        }
        return result;
    }

    const confirm = (id, setAnnouncements, setBookings) => {
        confirmDialog({
            message: '¿Seguro que desea cancelar? Perderá el importe abonado',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            accept: () => cancelReserve(id, setAnnouncements, setBookings, setFilteredBookings, setFilteredAnnouncements),
        });
    };
    const rateBooking = (bookingId) => {
        setRateBookingDialog(true)
        setBookingToRate(bookingId)
    }

    return (
        <Card className="activityCard h-full" title={activityStatus}>
            <div className="flex flex-column pb-5">
                <ul className="mt-0">
                    <li><strong>Matrícula: </strong>{announcement.vehicle.license_plate}</li>
                    <li><strong>Fecha y hora: </strong>{dateFormatterActivities(new Date(announcement.date))}</li>
                    <li><strong>Dirección: </strong> {announcement.location}</li>
                    <li><strong>Marca: </strong> {announcement.vehicle.brand}</li>
                    <li><strong>Modelo: </strong> {announcement.vehicle.model}</li>
                    <li><div className='flex align-items-center'><strong>Color: </strong>{<input type="color" value={announcement.vehicle.color} disabled/>}</div></li>
                    <li><strong>Tiempo de espera:</strong> {announcement.wait_time} min</li>
                    <li><strong>Precio: </strong> {announcement.price} €</li>
                </ul>
            </div>
            {(announcement.cancelled || cancelled || ((Date.parse(announcement.date) + announcement.wait_time * 60000) < Date.now()) || announcement.status === "Departure") ? "" :
                <div className="grid w-full">
                    {notificationButton()}
                    <div className="col-12">
                        <Button className="p-button-raised p-button-lg w-full h-full p-button-cancel" label="Cancelar" icon="pi pi-times" onClick={() => confirm(id, setAnnouncements, setBookings)} />
                    </div>
                </div>
            }
            {activityStatus === "Finalizado" && !announcement.rated ?
                <div className="col-12">
                    <Button className="p-button-raised p-button-lg w-full h-full p-button-rate" label="Valorar" icon="pi pi-star" onClick={() => rateBooking(announcement.id)} />
                </div>
                : ""
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
    const [limitedMobility, setLimitedMobility] = useState("No");
    const [formErrors, setFormErrors] = useState({})
    const msgs = useRef(null);
    const msgs2 = useRef(null);
    const rateMessage = useRef(null);

    const [mapLocation, setMapLocation] = useState(null);
    const [googleMapsReady, setGoogleMapsReady] = useState(false);
    const [overlays, setOverlays] = useState([]);
    const [draggableMarker, setDraggableMarker] = useState(false);
    const [markerLocation, setMarkerLocation] = useState('');
    const [dialogVisible2, setDialogVisible2] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState("Anuncios y reservas");
    const [dialogVisibleFilter, setDialogVisibleFilter] = useState(false);
    const [freeState, setFreeState] = useState(true);
    const [notDoneState, setNotDoneState] = useState(true);
    const [cancelledState, setCancelledState] = useState(true);
    const [finishedState, setFinishedState] = useState(true);
    const [reservedState, setReservedState] = useState(true);
    const [inProgressState, setInProgressState] = useState(true);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [rateAnnouncementDialog, setRateAnnouncementDialog] = useState(false);
    const [starsNumber, setStarsNumber] = useState(null);
    const [comment, setComment] = useState('');
    const [announcementToRate, setAnnouncementToRate] = useState(null);
    const [rateBookingDialog, setRateBookingDialog] = useState(false);
    const [starsNumber2, setStarsNumber2] = useState(null);
    const [comment2, setComment2] = useState('');
    const [bookingToRate, setBookingToRate] = useState(null);

    useEffect(() => {
        getBookings().then(data => {
            setBookings(data)
            setFilteredBookings(data)
        })
        getMyAnnnouncements().then(data => {
            setAnnouncements(data)
            setFilteredAnnouncements(data)
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
                setLimitedMobility(selectedAnnouncement.limited_mobility ? "Sí" : "No");
            }
        }
        selectedAnnouncementCallback();
    }, [selectedAnnouncement])


    const onHide = (event) => {
        setSelectedAnnouncement(null)
        setFormErrors({})
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
        if (!limitedMobility) errors.limitedMobility = "Movilidad limitada requerida"
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
            limited_mobility: limitedMobility === "Sí" ? true : false,
            vehicle: vehicleId,
        }
        let res = await editAnnouncement(announcementData)
        if (res === true) {
            getBookings().then(data => {
                setBookings(data)
                setFilteredBookings(data)
            })
            getMyAnnnouncements().then(data => {
                setAnnouncements(data)
                setFilteredAnnouncements(data)
            })
            setDialogVisible(false)
            msgs.current.show({ severity: 'success', summary: 'Anuncio modificado' });
        } else {
            const errors = {}
            errors.global = res
            setFormErrors(errors)
        }
        window.scrollTo(0, 0)
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
            <Button label="Confirmar" icon="pi pi-check" onClick={confirmMap} />
            <Button label="Cancelar" className="p-button-cancel" icon="pi pi-times" onClick={cancellMap} />
        </div>;

    const activities = [
        { name: "Anuncios y reservas" },
        { name: "Anuncios" },
        { name: "Reservas" }
    ]

    const onActivityChange = (e) => {
        setSelectedActivity(e.value.name)
    }

    const filterActivities = () => {
        let announcementFiltered = []
        let bookingFiltered = []
        if (cancelledState) {
            announcementFiltered = announcements.filter((a) =>
                ((a.reservation_set.length > 0 && (a.reservation_set[0].cancelled === true || a.cancelled === true)) || (a.reservation_set.length === 0 && a.cancelled === true))
            ).concat(announcementFiltered)
            bookingFiltered = bookings.filter((b) => b.cancelled || b.announcement.cancelled).concat(bookingFiltered)
        }

        if (finishedState) {
            announcementFiltered = announcements.filter((a) => (
                (Date.parse(a.date) + a.wait_time * 60000) < Date.now() && a.reservation_set.length > 0 && a.reservation_set[0].cancelled === false && a.cancelled === false
            )).concat(announcementFiltered)
            bookingFiltered = bookings.filter((b) => (
                (Date.parse(b.announcement.date) + b.announcement.wait_time * 60000) < Date.now() && b.cancelled === false && b.announcement.cancelled === false
            )).concat(bookingFiltered)
        }

        if (reservedState) {
            announcementFiltered = announcements.filter((a) => (
                (Date.parse(a.date) + a.wait_time * 60000) > Date.now() && a.reservation_set.length > 0 && a.reservation_set[0].cancelled === false
            )).concat(announcementFiltered)
        }

        if (freeState) {
            announcementFiltered = announcements.filter((a) => (
                (Date.parse(a.date) + a.wait_time * 60000) > Date.now() && a.reservation_set.length === 0 && a.cancelled === false
            )).concat(announcementFiltered)
        }

        if (notDoneState) {
            announcementFiltered = announcements.filter((a) => (
                (Date.parse(a.date) + a.wait_time * 60000) < Date.now() && a.reservation_set.length === 0 && a.cancelled === false
            )).concat(announcementFiltered)
        }

        if (inProgressState) {
            bookingFiltered = bookings.filter((b) => (
                !b.cancelled && !b.announcement.cancelled && (Date.parse(b.announcement.date) + b.announcement.wait_time * 60000) > Date.now()
            )).concat(bookingFiltered)
        }

        let uniqueAnnouncements = [...new Set(announcementFiltered)]
        let uniqueBookings = [...new Set(bookingFiltered)]

        setFilteredAnnouncements(uniqueAnnouncements)
        setFilteredBookings(uniqueBookings)
        setDialogVisibleFilter(false)
    }

    const filterFooter = <div>
        <Button label="Aplicar" icon="pi pi-check" onClick={filterActivities} />
        <Button label="Mostrar todos" className="p-button-noti" icon="pi pi-check-circle" onClick={() => {
            setFreeState(true);
            setNotDoneState(true);
            setCancelledState(true);
            setFinishedState(true);
            setReservedState(true);
            setInProgressState(true)
            setDialogVisibleFilter(false);
            setFilteredAnnouncements(announcements);
            setFilteredBookings(bookings);
        }} />
    </div>;

    const onHideDialogFilter = () => {
        setDialogVisibleFilter(false);
    }

    const rateNewAnnouncement = async () => {
        let data = {
            "rate": starsNumber,
            "comment": comment,
        }

        if (starsNumber === null) {
            rateMessage.current.show({ severity: 'error', detail: 'Debe calificar la plaza' });
            return;
        }
        if (comment === "" || comment.trim() === "") {
            rateMessage.current.show({ severity: 'error', detail: 'Debe escribir un comentario' });
            return;
        }
        if (comment.length > 500) {
            rateMessage.current.show({ severity: 'error', detail: 'El comentario no puede superar los 500 caracteres' });
            return;
        }

        let result = await rateAnnouncement(data, "reservation", announcementToRate)
        setRateAnnouncementDialog(false)
        if (result !== true) {
            msgs.current.show({ severity: 'error', detail: result });
            window.scrollTo(0, 0)
            return;
        } else {
            msgs.current.show({ severity: 'success', summary: 'Valoración realizada correctamente' });
            window.scrollTo(0, 0)
            return;
        }
    }

    const rateNewBooking = async () => {
        let data = {
            "rate": starsNumber2,
            "comment": comment2,
        }

        if (starsNumber2 === null) {
            rateMessage.current.show({ severity: 'error', detail: 'Debe calificar la plaza' });
            window.scrollTo(0, 0)
            return;
        }

        if (comment2 === "" || comment2.trim() === "") {
            rateMessage.current.show({ severity: 'error', detail: 'Debe escribir un comentario' });
            window.scrollTo(0, 0)
            return;
        }

        if (comment2.length > 500) {
            rateMessage.current.show({ severity: 'error', detail: 'El comentario no puede superar los 500 caracteres' });
            return;
        }

        let result = await rateAnnouncement(data, "announcement", bookingToRate)
        setRateBookingDialog(false)
        if (result !== true) {
            msgs.current.show({ severity: 'error', detail: result });
            window.scrollTo(0, 0)
            return;
        } else {
            msgs.current.show({ severity: 'success', summary: 'Valoración realizada correctamente' });
            window.scrollTo(0, 0)
            return;
        }
    }

    return (
        <div>
            <Messages ref={msgs} />
            <div className='w-full flex justify-content-center mt-3' >
                <Dropdown className="w-3" value={selectedActivity} options={activities} onChange={onActivityChange} optionLabel="name" placeholder={selectedActivity} />
                <Button icon="pi pi-filter" className="ml-2" onClick={() => setDialogVisibleFilter(true)} />
            </div>
            <div className="grid w-full px-5 pt-5">
                {selectedActivity === "Reservas" || selectedActivity === "Anuncios y reservas" ?
                    filteredBookings.map(bookingProps => (
                        <div key={bookingProps.id} className="col-12 md:col-6 xl:col-4">
                            <BookingCard
                                cancelled={bookingProps.cancelled}
                                setAnnouncements={setAnnouncements}
                                setBookings={setBookings}
                                id={bookingProps.id} {...bookingProps}
                                setRateBookingDialog={setRateBookingDialog}
                                setBookingToRate={setBookingToRate}
                                setFilteredBookings={setFilteredBookings}
                                setFilteredAnnouncements={setFilteredAnnouncements}
                            >
                            </BookingCard>
                        </div>
                    )) : ""}
                {selectedActivity === "Anuncios" || selectedActivity === "Anuncios y reservas" ?
                    filteredAnnouncements.map(announcementProps => (
                        <div key={announcementProps.id} className="col-12 md:col-6 xl:col-4">
                            <AnnouncementCard
                                setAnnouncements={setAnnouncements}
                                setBookings={setBookings}
                                setSelectedAnnouncement={setSelectedAnnouncement}
                                setDialogVisible={setDialogVisible} announcement={announcementProps}
                                msgs={msgs}
                                setRateAnnouncementDialog={setRateAnnouncementDialog}
                                setAnnouncementToRate={setAnnouncementToRate}
                                setFilteredBookings={setFilteredBookings}
                                setFilteredAnnouncements={setFilteredAnnouncements}
                            >
                            </AnnouncementCard>
                        </div>
                    )) : ""}
                <Dialog className='filter-dialog' header="Filtrar por plazas" draggable={false} visible={dialogVisibleFilter} footer={filterFooter} onHide={onHideDialogFilter} resizable={false}>
                    <div className="flex flex-column">
                        {(selectedActivity === "Anuncios" || selectedActivity === "Anuncios y reservas") ?
                            <div className="flex flex-column">
                                <div className="flex">
                                    <Checkbox className="mr-2" inputId="freeState" name="freeState" checked={freeState} onChange={() => setFreeState(!freeState)} />
                                    <label htmlFor="freeState">Libres</label>
                                </div>
                                <div className="flex mt-3">
                                    <Checkbox className="mr-2" inputId="notDoneState" name="notDoneState" checked={notDoneState} onChange={() => setNotDoneState(!notDoneState)} />
                                    <label htmlFor="notDoneState">No realizados</label>
                                </div>
                                <div className="flex mt-3">
                                    <Checkbox className="mr-2" inputId="reservedState" name="reservedState" checked={reservedState} onChange={() => setReservedState(!reservedState)} />
                                    <label htmlFor="reservedState">Reservados</label>
                                </div>
                            </div> : ""
                        }
                        {(selectedActivity === "Reservas" || selectedActivity === "Anuncios y reservas") ?
                            <div className="flex mt-3">
                                <Checkbox className="mr-2" inputId="inProgressState" name="inProgressState" checked={inProgressState} onChange={() => setInProgressState(!inProgressState)} />
                                <label htmlFor="inProgressState">En curso</label>
                            </div> : ""
                        }
                        <div className="flex mt-3">
                            <Checkbox className="mr-2" inputId="finishedState" name="finishedState" checked={finishedState} onChange={() => setFinishedState(!finishedState)} />
                            <label htmlFor="finishedState">Terminados</label>
                        </div>
                        <div className="flex mt-3">
                            <Checkbox className="mr-2" inputId="cancelledState" name="cancelledState" checked={cancelledState} onChange={() => setCancelledState(!cancelledState)} />
                            <label htmlFor="cancelledState">Cancelados</label>
                        </div>
                    </div>
                </Dialog>
            </div>

            <div className="flex flex-column justify-content-center align-items-center h-fit mx-0 text-center overflow-hidden">
                {(filteredBookings.length === 0 && filteredAnnouncements.length === 0) ||
                    (selectedActivity === "Anuncios" && filteredAnnouncements.length === 0) ||
                    (selectedActivity === "Reservas" && filteredBookings.length === 0) ? (
                    <Card title={"Parece que aún no tienes actividades"} style={{ color: "black" }}></Card>
                ) : ""}
            </div>

            <Dialog header="Editar anuncio" visible={dialogVisible} modal footer={footer} onHide={onHide} className="activity-dialog" draggable={false}>
                <div className="flex flex-column">
                    {getFieldError("global")}

                    <span className='text-xl publish_label mb-2 mt-3'>Selecciona tu vehículo</span>
                    <Dropdown className='input_text' value={vehicle} options={vehicles.map(v => v.license_plate)} onChange={(e) => setVehicle(e.value)} />
                    {getFieldError("vehicle")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿Cuándo vas a dejar la plaza?</span>
                    <Calendar id="time" placeholder={dateFormatterActivities(new Date(date))} onChange={(e) => setDate(dateFormatter(e.value))} showTime locale="es" dateFormat="dd/mm/yy" hourFormat="12" />
                    {getFieldError("date")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿Cuánto tiempo estas dispuesto a esperar?</span>
                    <InputNumber inputId="waitTime" value={waitTime} onValueChange={(e) => setWaitTime(e.value)} suffix=" minuto/s" showButtons min={0} max={30} />
                    {getFieldError("waitTime")}

                    <span className='text-xl publish_label mb-2 mt-3'>¿Qué precio quieres establecer? {price} €</span>
                    <Slider value={price} onChange={(e) => setPrice(e.value)} min={0.5} max={10} step={0.1} />
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
                    <SelectButton unselectable={false} value={limitedMobility} onChange={(e) => setLimitedMobility(e.value)} options={["Sí", "No"]} />
                    {getFieldError("limitedMobility")}

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

            <Dialog header="Valora al demandante de la plaza" className="activity-dialog" visible={rateAnnouncementDialog} onHide={() => setRateAnnouncementDialog(false)}>
                <div className='flex flex-column'>
                    <Messages ref={rateMessage} />
                    <span className='text-l publish_label mb-2 mt-3 font-bold'>¿Qué puntuación le das al demandante?</span>
                    <Rating value={starsNumber} cancel={false} onChange={(e) => setStarsNumber(e.value)} />
                    <span className='text-l publish_label mb-2 mt-3 font-bold'>Deja tu opinión</span>
                    <InputTextarea rows={4} cols={10} value={comment} autoResize onChange={(e) => setComment(e.target.value)} />
                    <Button className="p-button-edit mt-3 w-5 m-auto" label="Enviar" icon="pi pi-send" onClick={() => rateNewAnnouncement()} />
                </div>
            </Dialog>

            <Dialog header="Valora al ofertante de la plaza" className="activity-dialog" visible={rateBookingDialog} onHide={() => setRateBookingDialog(false)}>
                <div className='flex flex-column'>
                    <Messages ref={rateMessage} />
                    <span className='text-l publish_label mb-2 mt-3 font-bold'>¿Qué puntuación le das al ofertante?</span>
                    <Rating value={starsNumber2} cancel={false} onChange={(e) => setStarsNumber2(e.value)} />
                    <span className='text-l publish_label mb-2 mt-3 font-bold'>Deja tu opinión</span>
                    <InputTextarea rows={4} cols={10} value={comment2} autoResize onChange={(e) => setComment2(e.target.value)} />
                    <Button className="p-button-edit mt-3 w-5 m-auto" label="Enviar" icon="pi pi-send" onClick={() => rateNewBooking()} />
                </div>
            </Dialog>
        </div>
    )
}

export default Activity;
