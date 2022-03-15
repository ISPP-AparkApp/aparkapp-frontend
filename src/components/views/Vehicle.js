import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { updateUsername } from '../../store/session';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import "../../css/views/Vehicle.css";
import { Link } from "react-router-dom";

const Vehicle = () => {
    const dispatch = useDispatch()
    const [selectedType, setSelectedType] = useState(null);

    const types = [
        { name: "Segmento A", code: "A" },
        { name: "Segmento B", code: "B" },
        { name: "Segmento C", code: "C" },
        { name: "Segmento D", code: "D" },
        { name: "Segmento E", code: "E" },
        { name: "Segmento F", code: "F" },
    ]

    const onTypeChange = (e) => {
        setSelectedType(e.value);
    }

    return (
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <Card title="Registro de vehículo" className="w-full md:w-auto">
                <div className="flex flex-column align-items-center">
                    <img alt="logo-full" src="logo-full.png" height="250"></img>
                    <div className="p-inputgroup mt-6 mb-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-bars icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Marca" />
                    </div>
                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-car icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Modelo" />
                    </div>
                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-tag icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Matrícula" />
                    </div>
                    <div className="p-inputgroup mb-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-palette icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Color" />
                    </div>
                    <div className="p-inputgroup mb-5">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-ellipsis-h icons_form"></i>
                        </span>
                        <Dropdown className="input_text" value={selectedType} options={types} onChange={onTypeChange} optionLabel="name" placeholder="Segmento" />
                    </div>
                    <div className="grid w-full">
                        <div className="col-12 md:col-6">
                            <Link to="/signup">
                                <Button className="p-button-raised p-button-lg w-full h-full" label="Anterior" />
                            </Link>
                        </div>
                        <div className="col-12 md:col-6">
                            <Button className="p-button-raised p-button-lg w-full h-full" label="Terminar" onClick={() => dispatch(updateUsername("username"))} />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
export default Vehicle
