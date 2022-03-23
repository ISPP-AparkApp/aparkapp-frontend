import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { getReservation, getAnnouncement, updateStatusAnnouncement } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MapRoute = () => {
    const [state, setState] = useState('Initial');
    const [reserve, setReserve] = useState(null);
    const [announceId, setAnnounce] = useState(null);
    const [wait, setWait] = useState(true);
    const [time, setTime] = useState(false);
    const [show, setShow] = useState(true)

    let urlSplit = window.location.href.split("/");
    let tam = urlSplit.length;

    const getReserve = () => {
        getReservation(urlSplit[tam - 1]).then(
            val => (setReserve(val))
        );
    };
    if (reserve == null)        //Only for the initial
        getReserve();

    const getAnnounce = () => {
        getAnnouncement(reserve.announcement).then(
            val => (setAnnounce(val.id),
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
        }, 1500);
        return () => clearInterval(interval);
    }, [announceId, state, time, wait]);

    const updateAnnounce = () => {updateStatusAnnouncement(announceId, {status: 'Arrival'}).then(getAnnounce());}

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
                    <div><Button className="p-button-raised p-button-lg mb-1" label="Llego tarde" /></div>) : (<br></br>)
                }
            </div>
        ) : (<br></br>)
        }
    </div>

    return (
        <div className="flex flex-column justify-content-center align-items-center h-fit mx-0 text-center overflow-hidden">
            <ToastContainer position="top-center" limit={1} autoClose={false} newestOnTop closeOnClick={false} rtl={false}
                pauseOnFocusLoss draggable />

            <Card footer={footer}>
                <img alt="logo" src="ruta.png" height="300" className='mr-3 route-img' ></img>
                <br></br>
                <hr></hr>
            </Card>
        </div>
    )
};

export default MapRoute;
