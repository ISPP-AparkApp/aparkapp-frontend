import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import "../../css/views/Activity.css";
import { cancelAnnouncement, getBookings } from '../../api/api';
import { getMyAnnnouncements } from '../../api/api';
import { v4 as uuidv4 } from 'uuid';
import { dateFormatter } from '../../utils/dateFormatter';

// TODO unify card components when back functionality is completed

const cancelAnnounce = async (id) => {
    const data = {
        cancelled: true,
    }
    cancelAnnouncement(id, data);
}

const AnnouncementCard = ({id, location, date, wait_time, cancelled }) => {
    let activityStatus;
    if (cancelled){
        activityStatus = "Cancelado"
    }else if (Date.parse(date) > Date.now()) {
        activityStatus = "En curso"
    } else {
        activityStatus = "Finalizado"
    }

    return (
        <Card key={uuidv4()} className="activityCard" title={activityStatus}>
            <div className="flex flex-column pb-5">
                <ul className="mt-0">
                    <li><strong>Matrícula:</strong></li>
                    <li><strong>Fecha y hora: </strong>{dateFormatter(new Date(date))}</li>
                    <li><strong>Dirección: </strong> {location}</li>
                    <li><strong>Marca: </strong> { }</li>
                    <li><strong>Modelo: </strong> { }</li>
                    <li><strong>Color: </strong> { }</li>
                    <li><strong>Tiempo de espera:</strong> {wait_time}</li>
                    <li><strong>Precio: </strong> { }</li>
                </ul>
            </div>
            {cancelled ? "" :
                <div className="grid w-full">
                    <div className="col-12">
                        <Button className="p-button-raised p-button-lg w-full h-full" label="Cancelar" icon="pi pi-times" onClick={() => cancelAnnounce(id)}/>     
                    </div>
                    <div className="col-12">
                        <Button className="p-button-raised p-button-lg w-full h-full" label="Editar anuncio" icon="pi pi-pencil" />
                    </div>
                </div>
            }
        </Card>
    )
}

const BookingCard = ({ announcement }) => {
    let activityStatus;
    if (announcement.cancelled){
        activityStatus = "Cancelado";  
    }else if(Date.parse(announcement.date) > Date.now()) {
        activityStatus = "En curso"
    } else {
        activityStatus = "Finalizado"
    }

    return (
        <Card key={uuidv4()} className="activityCard" title={activityStatus}>
            <div className="flex flex-column pb-5">
                <ul className="mt-0">
                    <li><strong>Matrícula:</strong>{announcement.vehicle.license_plate}</li>
                    <li><strong>Fecha y hora: </strong>{dateFormatter(new Date(announcement.date))}</li>
                    <li><strong>Dirección: </strong> {announcement.location}</li>
                    <li><strong>Marca: </strong> {announcement.vehicle.brand}</li>
                    <li><strong>Modelo: </strong> {announcement.vehicle.model}</li>
                    <li><strong>Color: </strong> {announcement.vehicle.color}</li>
                    <li><strong>Tiempo de espera:</strong> {announcement.wait_time}</li>
                    <li><strong>Precio: </strong> {announcement.price}</li>
                </ul>
            </div>
            {announcement.cancelled ? "" :
                <div className="grid w-full">
                    <div className="col-12">
                        <Button className="p-button-raised p-button-lg w-full h-full" label="Cancelar" icon="pi pi-times" />
                    </div>
                    <div className="col-12">
                        <Button className="p-button-raised p-button-lg w-full h-full" label="Cómo llegar" icon="pi pi-map-marker" />
                    </div>
                </div>
            }
        </Card>
    )
}

const Activity = () => {
    const [bookings, setBookings] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        getBookings().then(data => {
            setBookings(data)
        })
        getMyAnnnouncements().then(data => {
            setAnnouncements(data)
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className="grid w-full px-5 pt-5">
            {bookings.map(bookingProps => (
                <div className="col-12 md:col-6 xl:col-4">
                    <BookingCard {...bookingProps}></BookingCard>
                </div>
            ))}
            {announcements.map(announcementProps => (
                <div className="col-12 md:col-6 xl:col-4">
                    <AnnouncementCard {...announcementProps}></AnnouncementCard>
                </div>
            ))}
        </div>
    )
}

export default Activity;