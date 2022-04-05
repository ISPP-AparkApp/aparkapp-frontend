import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import "../../css/views/Vehicle.css";
import { register } from "../../api/api";
import { dateFormatter } from '../../utils/dataFormatter';
import { login } from "../../api/api";
import { Messages } from 'primereact/messages';

const VehicleRegister = (props) => {
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [color, setColor] = useState("");
    const [selectedType, setSelectedType] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const msgs = useRef(null);

    const types = [
        { name: "Pequeño" },
        { name: "Mediano" },
        { name: "Grande" },
    ]

    const doRegister = async () => {
        const registerFields = {
            username: props.user.username,
            password: props.user.password,
            email: props.user.email,
            first_name: props.user.firstName,
            last_name: props.user.lastName,
            profile: {
                phone: props.user.phone,
                birthdate: dateFormatter(props.user.birthdate).split(" ")[0]
            },
            vehicles: [
                {
                    brand: brand,
                    model: model,
                    license_plate: licensePlate,
                    color: color,
                    type: selectedType.name
                },
            ]
        }
        let response = await register(registerFields)
        if (response === true) {
            msgs.current.show({ severity: 'success', summary: 'Usuario registrado' });
        } else {
            return Object.entries(response.error).map(([key, value]) => <p key={key}>{value}</p>);
        }
        window.scrollTo(0, 0)
    }

    const validate = async () => {
        const errors = {}

        if (!brand) errors.brand = 'La marca es requerida';
        if (!model) errors.model = 'El modelo es requerido';
        if (!licensePlate) errors.licensePlate = 'La matrícula es requerida';
        if (!color) errors.color = 'El color es requerido';
        if (!selectedType) errors.selectedType = 'El segmento es requerido';

        var regexLicensePlate = /^[A-Za-z]{0,2}[0-9]{4}[A-Za-z]{2,3}$/
        if (!regexLicensePlate.test(licensePlate)) errors.licensePlate = 'La matrícula introducida no es válida';

        if (brand.length < 3 || brand.length > 30) errors.brand = 'La marca del vehículo debe tener entre 3 y 30 caracteres';
        if (model.length < 2 || model.length > 50) errors.model = 'El modelo del vehículo debe tener entre 1 y 50 caracteres';
        if (color.length < 3 || color.length > 30) errors.color = 'El color del vehículo debe tener entre 3 y 30 caracteres';

        setFormErrors(errors)

        if (!Object.keys(errors).length) {
            const formError = await doRegister();
            if (formError) {
                setFormErrors({ global: formError })
            } else {
                await login(props.user.username, props.user.password)
            }
        }
    }

    const getFieldError = (fieldName) => {
        return formErrors[fieldName] && <span className="messageError">{formErrors[fieldName]}</span>
    }

    return (
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <Messages ref={msgs} />
            <Card title="Registro de vehículo" className="w-full md:w-auto">
                <div className="flex flex-column">
                    <img alt="logo-full" src="logo-full.png" height="250" width="250" className='m-auto'></img>
                    {getFieldError("global")}
                    <div className="p-inputgroup mt-3">
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
                        <Dropdown className="input_text" value={selectedType} options={types} onChange={(e) => setSelectedType(e.target.value)} optionLabel="name" placeholder="Tamaño" />
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
