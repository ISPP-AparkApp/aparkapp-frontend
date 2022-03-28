import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import "../../css/views/Vehicle.css";
import { register } from "../../api/api";
import { dateFormatter } from '../../utils/dataFormatter';

const VehicleRegister = (props) => {
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [color, setColor] = useState("");
    const [selectedType, setSelectedType] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const types = [
        { name: "Segmento A", code: "A" },
        { name: "Segmento B", code: "B" },
        { name: "Segmento C", code: "C" },
        { name: "Segmento D", code: "D" },
        { name: "Segmento E", code: "E" },
        { name: "Segmento F", code: "F" },
    ]

    const doRegister = async () => {
        const registerFields = {
            username: props.user.username,
            password: props.user.password,
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            profile: {
                phone: props.user.phone,
                birthdate: dateFormatter(props.user.birthdate).split(" ")[0]
            },
            vehicle: {
                brand: brand,
                model: model,
                licensePlate: licensePlate,
                color: color,
                segment: selectedType
            }
        }
        //await register(registerFields)
    }

    const validate = async () => {
        const errors = {}

        if (!brand) errors.brand = 'La marca es requerida';
        if (!model) errors.model = 'El modelo es requerido';
        if (!licensePlate) errors.licensePlate = 'La matrícula es requerida';
        if (!color) errors.color = 'El color es requerido';
        if (!selectedType) errors.selectedType = 'El segmento es requerido';

        setFormErrors(errors)

        if (!Object.keys(errors).length) {
            const formError = await doRegister();
            if (formError) {
                setFormErrors({ global: formError })
            } 
        }
    }

    const getFieldError = (fieldName) => {
        return formErrors[fieldName] && <span className="messageError">{formErrors[fieldName]}</span>
    }

    return (
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <Card title="Registro de vehículo" className="w-full md:w-auto">
                <div className="flex flex-column">
                    <img alt="logo-full" src="logo-full.png" height="250"></img>
                    {getFieldError("global")}
                    <div className="p-inputgroup mt-6">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-bars icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Marca" onChange={(e) => setBrand(e.target.value)} />
                    </div>
                    {getFieldError("brand")}
                    <div className="p-inputgroup mt-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-car icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Modelo" onChange={(e) => setModel(e.target.value)} />
                    </div>
                    {getFieldError("model")}
                    <div className="p-inputgroup mt-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-tag icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Matrícula" onChange={(e) => setLicensePlate(e.target.value)} />
                    </div>
                    {getFieldError("licensePlate")}
                    <div className="p-inputgroup mt-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-palette icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Color" onChange={(e) => setColor(e.target.value)} />
                    </div>
                    {getFieldError("color")}
                    <div className="p-inputgroup mt-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-ellipsis-h icons_form"></i>
                        </span>
                        <Dropdown className="input_text" value={selectedType} options={types} onChange={(e) => setSelectedType(e.target.value)} optionLabel="name" placeholder="Segmento" />
                    </div>
                    {getFieldError("selectedType")}
                    <div className="grid w-full mt-4">
                        <div className="col-12 md:col-6">
                            <Button className="p-button-raised p-button-lg w-full h-full" label="Anterior" onClick={() => props.setVehicleHidden(true)} />
                        </div>
                        <div className="col-12 md:col-6">
                            <Button className="p-button-raised p-button-lg w-full h-full" label="Terminar" onClick={validate} />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
export default VehicleRegister;
