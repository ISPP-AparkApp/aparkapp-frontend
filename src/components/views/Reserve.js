import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { reserve } from '../../api/api';
import "../../css/views/Reserve.css";
import reservesData from './sampleBookings.json';

const Reserve = ({ licensePlate, datetime, phone, address, model, color, waitTime, price }) => {

    const reserveAnnouncement = () =>{
        const reservetData = {
            licensePlate, datetime, phone, address, model, color, waitTime, price
        }
        console.log(phone)
        reserve(reservetData);
    }
    const [reserved, setReserved] = useState(false)
    return (
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <Card title={`Matrícula: ${licensePlate}`} className="activityCard">
                <div className="flex flex-column  pb-5">
                    <ul className="mt-0">
                        <li><strong>Fecha y hora: </strong>{datetime}</li>
                        <li><strong>Nº de teléfono: </strong>{phone} </li>
                        <li><strong>Dirección: </strong>{address}</li>
                        <li><strong>Modelo: </strong>{model} </li>
                        <li><strong>Color: </strong>{color} </li>
                        <li><strong>Tiempo de espera:</strong>{waitTime} </li>
                        <li><strong>Precio: </strong>{price}</li>
                    </ul>
                </div>
                {reserved === true ? (
                <div className="grid w-full">
                    <div className="col-12">
                        <Button className="p-button-raised p-button-lg w-full h-full" label="Cancelar" 
                            icon="pi pi-times"  onClick={(event) => setReserved(false)}/>
                    </div>
                    <div className="col-12">
                        <Link to="/home">
                            <Button className="p-button-raised p-button-lg w-full h-full" label="Cómo llegar" icon="pi pi-map-marker" />
                        </Link>
                    </div>
                </div>
                ): (
                <div className="grid w-full"> 
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
        <div className="grid w-full px-5 pt-5">
            <div className="col-12 md:col-6 xl:col-4">
                <Reserve {...reservesData}></Reserve>
            </div>
        </div>
    )
}
export default Reserves;