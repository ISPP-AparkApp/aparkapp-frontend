import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from 'primereact/card';
import { getAnnouncement, updateStatusAnnouncement } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RouteVisualization from './RouteVisualization';

const MapRoute = () => {
    const [state, setState] = useState('Initial');
    const [announceId, setAnnounce] = useState(null);
    const [wait, setWait] = useState(true);
    const [time, setTime] = useState(false);
    const [show, setShow] = useState(true)

    let urlSplit = window.location.href.split("/");
    let tam = urlSplit.length;

    const getAnnounce = () => {
        getAnnouncement(urlSplit[tam - 1]).then(
            val => {
                setAnnounce(val.id)
                setState(val.status)
                setWait(val.allow_wait)
            }
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (time) {
                setTime(false);
                getAnnounce();
                notify();
            }
            else {
                setTime(true);
            }
        }, 1500);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [announceId, state, time, wait]);

    const updateAnnounce = () => { updateStatusAnnouncement(announceId, { status: 'Arrival' }).then(getAnnounce()); }

    const notify = () => {
        if (show && state === "Departure") {
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
        {state === "Initial" ? (
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
                <RouteVisualization/>
                <br></br>
                <hr></hr>
            </Card>
        </div>
    )
};

export default MapRoute;
