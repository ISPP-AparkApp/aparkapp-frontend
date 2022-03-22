import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { getReservation, getAnnouncement, updateAnnouncement } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MapRoute = () => {
    const [state, setState] = useState('Initial');      // Estado del proceso
    const [reserve, setReserve] = useState(null);       // Reserva
    const [announce, setAnnounce] = useState(null);     // Anuncio
    const [wait, setWait] = useState(true);             // Acepta espera
    const [time, setTime] = useState(false);            // Contador para recarga
    const [show, setShow] = useState(true);             // No mostrar notificación más de una vez

    const reservationId = 1; // Recibir de props

    const getReserve = () => {
        getReservation(reservationId).then(
            val => (setReserve(val))
        );
    };
    if (reserve == null)        //Solo se necesita para la carga inicial
        getReserve();

    const getAnnounce = () => {
        getAnnouncement(reserve.announcement).then(
            val => (setAnnounce(val),
                setState(val.status),
                setWait(val.allow_wait),
                notify()
            )
        );
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
    }, [announce, state, time, wait]);
    console.log(time);

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
            status: 'Arrival',
            observation: announce.observation,
            rated: announce.rated,
            vehicle: announce.vehicle
        }
        updateAnnouncement(announce.id, announcementData).then(getAnnounce());
    }

    const notify = () => {
        if (show && state == "Departure") {
            toast.success('Perfecto, salgo', {
                position: "top-center",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setShow(false);
        }
    }

    const footer = <div className="flex flex-column justify-content-center align-items-center h-fit text-center overflow-hidden">
        {state == "Initial" ? (
            <div><div className="mb-3"><Button onClick={() => { updateAnnounce(); }} className="p-button-raised p-button-lg" label="¡He llegado!" /></div>
                {wait ? (
                    <div><Button className="p-button-raised p-button-lg mb-1" label="Llego tarde" /></div>) : (<div></div>)
                }
            </div>
        ) : (<div></div>)
        }
    </div>

    return (
        <div className="flex flex-column justify-content-center align-items-center h-fit mx-0 text-center overflow-hidden">
            <ToastContainer position="top-center" limit={1} autoClose={false} newestOnTop closeOnClick={false} rtl={false}
                pauseOnFocusLoss draggable />

            <Card footer={footer}>
                <img alt="logo" src="route.png" height="300" className='mr-3 route-img' ></img>
                <br></br>
                <hr></hr>
            </Card>
        </div>
    )
};

export default MapRoute;
