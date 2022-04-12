import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getAnnouncement, updateStatusAnnouncement, getReservationUser } from '../../api/api';
import "../../css/views/Notifications.css";

const Notifications = () => {
    const [announcement, setAnnouncement] = useState();
    const [user, setUser] = useState(null);
    const [time, setTime] = useState(false);

    let announceId = window.location.href.split("/").pop();

    const getAnnounce = () => {
        getAnnouncement(announceId).then(val => {
            setAnnouncement(val);
            if (!user) { getReservationUser(val.id).then(u => u ? setUser(u.first_name) : setUser("Cancelled")); }
        });
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
        }, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [announcement, time, user]);

    const updateAnnounce = (status) => { updateStatusAnnouncement(announcement.id, { status: status }).then(getAnnounce()); }

    const notificationsContent = () => {
        let h = ""
        let c = ""
        let f = ""
        let result = []

        if (announcement && user && user !== "Cancelled") {
            switch (announcement.status) {
                case "Delay":
                    h = <span className="pi pi-clock text-xl">   {user} se ha retrasado</span>;
                    c = <div><p className="mb-0 text-xl"><Avatar style={{ color: "white" }} icon="pi pi-user" />   Llego tarde</p><p className="text-xs">Aceptar supone esperar 5 minutos más y recibir 50 céntimos más sobre el precio final</p><br></br><hr></hr></div>
                    f = <div><div><Button onClick={() => { updateAnnounce("AcceptDelay"); }} className="p-button-raised p-button-lg mb-3 w-full h-full" label="Vale, te espero" /></div><div><Button onClick={() => { updateAnnounce("DenyDelay"); }} className="p-button-raised p-button-lg w-full h-full" label="Lo siento, me voy" /></div></div>
                    result = [h, c, f];
                    break;
                case "Arrival":
                    h = <span className="pi pi-map-marker text-xl">   {user} está en tu ubicación</span>;
                    c = <div><p className="mb-0 text-xl"><Avatar style={{ color: "white" }} icon="pi pi-user" />   ¡He llegado!</p><br></br><hr></hr></div>
                    f = <span><Button onClick={() => { updateAnnounce("Departure"); }} className="p-button-raised p-button-lg w-full h-full" label="Perfecto, salgo" /></span>
                    result = [h, c, f];
                    break;
                default:
                    h = "Parece que no tienes notificaciones"
                    result = [h, c, f];
                    break;
            }
        } else if(user === "Cancelled") {
            h = "Reserva cancelada"
            c = <p className="mb-0 text-xl">Puede salir de su plaza de aparcamiento cuando desee</p>
            result = [h, c, f]
        }
        else {
            c = <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="3"
            animationDuration=".5s"
          />
            result = [h, c, f];
        }
        return result;
    }

    return (
        <div className="flex flex-column justify-content-center align-items-center h-fit mx-0 text-center overflow-hidden">
            <Card title={notificationsContent()[0]} style={{ color: "black" }} footer={notificationsContent()[2]}>
                {notificationsContent()[1]}
            </Card>
        </div>
    )
};

export default Notifications;
