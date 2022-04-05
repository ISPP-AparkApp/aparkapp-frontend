import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { getAnnouncement, updateStatusAnnouncement } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'react-toastify/dist/ReactToastify.css';
import RouteVisualization from './RouteVisualization';

const MapRoute = () => {
    const [time, setTime] = useState(false);
    const [showAccept, setShowAccept] = useState(0);
    const [showDeny, setShowDeny] = useState(true);
    const [showDeparture, setShowDeparture] = useState(true);
    const [announcement, setAnnouncement] = useState();

    let announceId = window.location.href.split("/").pop();

    const getAnnounce = () => {
        getAnnouncement(announceId).then(
            val => {
                setAnnouncement(val);
            }
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (time) {
                setTime(false);
                getAnnounce();
                if (showAccept < announcement.n_extend && announcement.status === "AcceptDelay") {
                    notify("El ofertante ha aceptado la solicitud de espera");
                    setShowAccept(showAccept + 1);
                }
                else if (showDeny && announcement.status === "DenyDelay") {
                    notify("El ofertante ha rechazado la solicitud de espera 😢");
                    setShowDeny(false);
                }
                else if (showDeparture && announcement.status === "Departure") {
                    notify("Perfecto, salgo");
                    setShowDeparture(false);
                }
            }
            else {
                setTime(true);
            }
        }, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [announcement, time, showAccept, showDeny, showDeparture]);

    const updateAnnounce = (status) => { updateStatusAnnouncement(announceId, { status: status }).then(getAnnounce()); }

    const notify = (text) => {
        toast.info(text, {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const notificationsButtons = () => {
        let result = ""

        if (announcement) {
            if ((Date.parse(announcement.date) + announcement.wait_time * 60000) < Date.now()) {
                result = <div><p>¡Vaya! Parece que has llegado demasido tarde.</p><p>El anuncio ya ha expirado.</p></div>
            }
            else if ((Date.parse(announcement.date) - Date.now()) < 600000) {
                if (announcement.status === "Initial" || announcement.status === "AcceptDelay" || announcement.status === "Delay") {
                    result = <div className="mb-3"><Button onClick={() => { updateAnnounce("Arrival"); }} className="p-button-raised p-button-lg w-full h-full" label="¡He llegado!" /></div>
                    if (announcement.allow_wait && announcement.status !== "Delay" && announcement.n_extend < 3) { // Debe funcionar cuando n_extend esté en el modelo
                        result = <div><div className="mb-3"><Button onClick={() => { updateAnnounce("Arrival"); }} className="p-button-raised p-button-lg w-full h-full" label="¡He llegado!" /></div><div><Button onClick={() => { updateAnnounce("Delay"); }} className="p-button-raised p-button-lg mb-1 w-full h-full" label="Llego tarde" /></div></div>
                    }
                }
                else {
                    result = <span><p>Esperando respuesta del anunciante.</p></span>
                }
            }
            else {
                result = <span><p>Parece que has llegado demasido pronto.</p><p>Sólo se podrán enviar notificaciones 10 minutos antes del anuncio.</p></span>
            }
        }
        else {
            result = <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="3" animationDuration=".5s" />
        }
        return result;
    }

    const footer = <div className="flex flex-column justify-content-center align-items-center h-fit text-center overflow-hidden">{notificationsButtons()}</div>

    return (
        <div className="flex flex-column justify-content-center align-items-center h-fit mx-0 text-center overflow-hidden">
            <ToastContainer position="top-center" autoClose={false} newestOnTop closeOnClick={false} rtl={false}
                pauseOnFocusLoss draggable />           
            <RouteVisualization announceLocation={announcement.location} />
            {footer}
        </div>
    )
};

export default MapRoute;
