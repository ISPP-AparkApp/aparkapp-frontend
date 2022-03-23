import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reserve } from '../../api/api';
import "../../css/views/Reserve.css";
import { getAnnouncementId } from '../../api/api';

const Reserve = ({ }) => {

    const [reserved, setReserved] = useState(true)
    const [ad, setAd] = useState(true)

    var urlSplit = window.location.href.split("/");
    var tam = urlSplit.length
    useEffect(() => {
        getAnnouncementId(urlSplit[tam - 1]).then(data => setAd(data))
    }, [])
    console.log(ad.date)
    const reserveAnnouncement = () => {
        const reservetData = {
            announcement: ad,
        }
        reserve(reservetData);
    }

    return (
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <Card title={`Matrícula: `} className="activityCard">
                <div className="flex flex-column  pb-5">
                    <ul className="mt-0">
                        <li><strong>Fecha y hora: </strong>{ad.date}</li>
                        <li><strong>Nº de teléfono: </strong> </li>
                        <li><strong>Dirección: </strong>{ad.location}</li>
                        <li><strong>Modelo: </strong></li>
                        <li><strong>Color: </strong></li>
                        <li><strong>Tiempo de espera: </strong>{ad.wait_time} min</li>
                        <li><strong>Precio: </strong>{ad.price}</li>
                    </ul>
                </div>
                {reserved === true ? (
                    <div className="align-items-center w-full">
                        <div className="col-12">
                            <Button className="p-button-raised p-button-lg w-full h-full" label="Cancelar"
                                icon="pi pi-times" onClick={(event) => setReserved(false)} />
                        </div>
                        <div className="col-12">
                            <Link to={`/route/${urlSplit[tam - 1]}`}>
                                <Button className="p-button-raised p-button-lg w-full h-full" label="Cómo llegar" icon="pi pi-map-marker" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="align-items-center w-full">
                        <div className="col-12">
                            <Button className="p-button-raised p-button-lg w-full h-full"
                                label="Reservar" onClick={(event) => setReserved(true) && reserveAnnouncement()}
                            />
                        </div>
                    </div>
                )}
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