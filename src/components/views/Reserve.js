import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../css/views/Reserve.css";
import { getAnnouncement, getBookings, cancelReservation } from '../../api/api';
import { dateFormatter } from '../../utils/dateFormatter';
import { confirmDialog } from 'primereact/confirmdialog';

const cancelReserve = (id) => {
    const data = {
        cancelled: true,
    }
    cancelReservation(id, data);
}

const aux = async (bookings, id) => {
    await bookings.map(bookingProps =>
        (bookingProps.announcement.id === id) ? cancelReserve(bookingProps.id) : null
    )
}

const Reserve = () => {
    const [ad, setAd] = useState()
    const [vehicle, setVehicle] = useState()
    const [bookings, setBookings] = useState([])
    var urlSplit = window.location.href.split("/").pop();

    const confirm = () => {
        confirmDialog({
            message: '¿Seguro que desea cancelar? Perderá el importe abonado',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            accept
        });
    };

    const accept = () => {
        aux(bookings, ad.id);
        setTimeout(function () {
            window.location.href = "/activity";
            window.clearTimeout();
        }, 1500);
    }

    useEffect(() => {
        getAnnouncement(urlSplit).then(data => {
            setAd(data)
            setVehicle(data.vehicle)
        })
        getBookings().then(data => {
            setBookings(data)
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <Card title={"Matrícula: " + (vehicle == null ? ("") : (vehicle.license_plate))} className="activityCard">
                <div className="flex flex-column  pb-5">
                    <ul className="mt-0">
                        <li><strong>Fecha y hora: </strong>{ad == null ? ("") : (dateFormatter(new Date(ad.date)))}</li>
                        <li><strong>Dirección: </strong>{ad == null ? ("") : (ad.location)}</li>
                        <li><strong>Modelo: </strong>{vehicle == null ? ("") : (vehicle.brand)}</li>
                        <li><strong>Color: </strong>{vehicle == null ? ("") : (<input type="color" value={vehicle.color} readOnly/>)}</li>
                        <li><strong>Tiempo de espera: </strong> {ad == null ? ("") : (ad.wait_time)} min</li>
                        <li><strong>Precio: </strong> {ad == null ? ("") : (ad.price)} €</li>
                    </ul>
                </div>

                <div className="align-items-center w-full">
                    <div className="col-12">
                        <Link to={`/route/${urlSplit}`}>
                            <Button className="p-button-raised p-button-lg w-full h-full" label="Cómo llegar" icon="pi pi-map-marker" />
                        </Link>
                    </div>
                    <div className="col-12">
                        <Button className="p-button-raised p-button-lg w-full h-full p-button-cancel" label="Cancelar"
                            icon="pi pi-times" onClick={confirm} />
                    </div>
                </div>
            </Card>
        </div>
    )
}
const Reserves = () => {
    return (
        <div>
            <div className="mt-6">
                <Reserve></Reserve>
            </div>
        </div>
    )
}

export default Reserves;