import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { getUserAnnouncements, updateStatusAnnouncement, getReservationUser } from '../../api/api';
import "../../css/views/Notifications.css";

const Notifications = () => {
    const [state, setState] = useState('Initial');
    const [user, setUser] = useState(null);
    const [time, setTime] = useState(false);
    const [announceId, setAnnounce] = useState(null);

    const getAnnounce = () => {
        getUserAnnouncements().then(val => val.forEach(x => {
            if (x.status === "Arrival") {
                setState(x.status);
                setAnnounce(x.id);
                getReservationUser(x.id).then(u => setUser(u.username));
            }
            else {
                setState("Initial");
            }
        }));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (time) {
                setTime(false);
                getAnnounce();
            }
            else {
                setTime(true);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [announceId, state, time, user]);

    const updateAnnounce = () => { updateStatusAnnouncement(announceId, { status: 'Departure' }).then(getAnnounce()); }


    const header =
        <span className="pi pi-map-marker text-xl">   {user} está en tu ubicación</span>;

    const footer =
        <span><Button onClick={() => { updateAnnounce(); }} className="p-button-raised p-button-lg w-full h-full" label="Perfecto, salgo" /></span>;
    return (
        <div className="flex flex-column justify-content-center align-items-center h-fit mx-0 text-center overflow-hidden">
            {state === 'Arrival' ? (
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
