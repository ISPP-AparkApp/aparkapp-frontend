import React,{useState, useEffect} from 'react';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import "../../css/views/Publish.css";


const Publish = () => {
    const [vehicle, setVehicle] = useState('');
    const [date, setDate] = useState(new Date());
    const [waitTime, setWaitTime] = useState(0);
    const [price, setPrice] = useState(0.);
    const [extension, setExtension] = useState('No');
    const [location, setLocation] = useState();
    const [type, setType] = useState("Pública");
    const [limitedMovility, setLimitedMovility] = useState("No");

    const options = ["Sí", "No"];
    const parkTypes = ["Pública","Zona Azul", "Zona verde", "Zona naranja","MAR"];
    const vehicleOptions = ["0032HPP","7587JUY"];

    const publish = (event) => {
        event.preventDefault();
        const object = {
            vehicle: vehicle,
            date: date,
            waitTime: waitTime,
            price: price,
            extension: extension,
            location: location,
            type: type,
            limitedMovility: limitedMovility
        }
        console.log(object);
    }

    return(
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <Card title="Publicar plaza" className="w-full md:w-auto">
                <div className="flex flex-column ">
                    <span className='text-xl publish_label mb-2'>Selecciona tu vehículo</span>
                    <Dropdown className='input_text mb-3' value={vehicle} options={vehicleOptions} onChange={(e)=> setVehicle(e.value)} />

                    <span className='text-xl publish_label mb-2'>¿Cuándo vas a dejar la plaza?</span>
                    <Calendar className='mb-3' id="time" value={date} onChange={(e) => setDate(e.value)} timeOnly hourFormat="12" />
                    
                    <span className='text-xl publish_label mb-2'>¿Cuánto tiempo estas dispuesto a esperar?</span>
                    <InputNumber className='mb-3' inputId="waitTime" value={waitTime} onValueChange={(e) => setWaitTime(e.value)} suffix=" minuto/s" showButtons min={0} max={30} />

                    <span className='text-xl publish_label mb-2'>¿Qué precio quieres establecer?</span>
                    <InputNumber className='mb-3' inputId="currency-germany" value={price} onValueChange={(e) => setPrice(e.value)} mode="currency" currency="EUR" locale="de-DE"  min={0.5} max={10}/>

                    <span className='text-xl publish_label mb-2'>¿Aceptarías esperar más por más dinero?</span>
                    <SelectButton className='mb-3' value={extension} options={options} onChange={(e) => setExtension(e.value)} />

                    <span className='text-xl publish_label mb-2'>¿Dónde se encuentra la plaza?</span>
                    <InputText className="input_text" value={location} /><Button label="Ubicación actual" className="p-button-link mb-3" onClick={()=> 
                            navigator.geolocation.getCurrentPosition(function(position) {
                                setLocation(position.coords.latitude + "," + position.coords.longitude);
                        })}/>
                    
                    <span className='text-xl publish_label mb-2'>¿De qué tipo de plaza se trata?</span>
                    <Dropdown className='mb-3' value={type} options={parkTypes} onChange={(e)=> setType(e.value)} />

                    <span className='text-xl publish_label mb-2'>¿Se trata de una plaza de movilidad limitada?</span>
                    <SelectButton className='mb-5' value={limitedMovility} options={options} onChange={(e) => setLimitedMovility(e.value)} />

                    <Button label="Publicar" className="p-button-raised p-button-lg" onClick={(event)=>publish(event)}/>
            </div>
            </Card>
        </div>
    )
}
export default Publish;