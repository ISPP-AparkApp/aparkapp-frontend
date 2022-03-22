import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { getAnnouncements, updateAnnouncement } from '../../api/api';
import "../../css/views/Notifications.css";

const Notifications = () => {
    const [state, setState] = useState('Initial');
    const [user, setUser] = useState(null);
    const [time, setTime] = useState(false);
    const [announce, setAnnounce] = useState(null);

    const getAnnounce = () => {
        getAnnouncements().then(val => val.forEach(x => {
            if (x.status == "Arrival") {
                setState(x.status);
                setAnnounce(x);
                //setUser(y.name) Consulta para obtener el user del anuncio
            }
            else {
                setState("Initial");
            }
        }));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if(time) {
                setTime(false);
                getAnnounce();
            }
            else {
                setTime(true);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [announce, state,time]);

    const updateAnnounce = () => {
        const announcementData = {
            date: announce.date,
            waitTime: announce.waitTime,
            price: announce.price,
            allow_wait: announce.allow_wait,
            location: announce.location,
            longitude: announce.longitude,
            latitude: announce.latitude,
            zone: announce.zone,
            limited_movility: announce.limited_movility,
            status: 'Departure',
            observation: announce.observation,
            rated: announce.rated,
            vehicle: announce.vehicle
        }
        updateAnnouncement(announce.id, announcementData).then(getAnnounce());
    }


    const header =
        <span className="pi pi-map-marker text-xl">   {user} está en tu ubicación</span>;

    const footer =
        <span><Button onClick={() => { updateAnnounce(); }} className="p-button-raised p-button-lg w-full h-full" label="Perfecto, salgo" /></span>;
    return (
        <div className="flex flex-column justify-content-center align-items-center h-fit mx-0 text-center overflow-hidden">
            {state == 'Arrival' ? (
                <Card title={header} style={{ color: "black" }} footer={footer}>
                    <p className="mb-0 text-xl"><Avatar style={{ color: "white" }} icon="pi pi-user" />   ¡He llegado!</p>
                    <br></br>
                    <hr></hr>
                </Card>
            ) : (
                <Card title={"Parece que no tienes notificaciones"} style={{ color: "black" }}></Card>
            )}
        </div>
    )
};

export default Notifications;
