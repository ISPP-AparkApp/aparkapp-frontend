import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';

const UserRegister = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [formErrors, setFormErrors] = useState({});

    const validate = async () => {
        const errors = {}

        if (!username) errors.username = 'El nombre de usuario es requerido';
        if (!password) errors.password = 'La contraseña es requerida';
        if (!firstName) errors.onlyName = 'El nombre es requerido';
        if (!lastName) errors.lastName = 'El apellido es requerido';
        if (!phone) errors.phone = 'El teléfono es requerido';
        if (!birthdate) errors.birthdate = 'La fecha de nacimiento es requerida';

        if (firstName.length < 3 || firstName.length > 30) errors.firstName = 'El nombre debe tener una longitud entre 3 y 30 caracteres';
        if (lastName.length < 3 || lastName.length > 50) errors.lastName = 'Los apellidos deben tener una longitud entre 3 y 50 caracteres';
          
        var regexPhone = /^\+?(6\d{2}|7[1-9]\d{1}|9\d{2})\d{6}$/
        if (!regexPhone.test(phone)) errors.phone = 'El número de teléfono introducido no es válido';
        
        setFormErrors(errors)

        if (!Object.keys(errors).length) {
            props.setVehicleHidden("")
            props.setUser({
                "username": username,
                "password": password,
                "firstName": firstName,
                "lastName": lastName,
                "phone": phone,
                "birthdate": birthdate
            })
        }
    }

    const getFieldError = (fieldName) => {
        return formErrors[fieldName] && <span className="messageError">{formErrors[fieldName]}</span>
    }

    return (
        <Card title="Datos personales" className={"w-full md:w-auto"}>
            <div className="flex flex-column">
                <img alt="logo-full" src="logo-full.png" height="250"></img>
                <div className="p-inputgroup mt-6">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-user icons_form"></i>
                    </span>
                    <InputText className="input_text" placeholder="Nombre de usuario" onChange={(e) => setUsername(e.target.value)} />
                </div>
                {getFieldError("username")}
                <div className="p-inputgroup mt-3">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-key icons_form"></i>
                    </span>
                    <InputText type="password" className="input_text" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
                </div>
                {getFieldError("password")}
                <div className="p-inputgroup mt-3">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-user icons_form"></i>
                    </span>
                    <InputText className="input_text" placeholder="Nombre" onChange={(e) => setFirstName(e.target.value)} />
                </div>
                {getFieldError("firstName")}
                <div className="p-inputgroup mt-3">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-user icons_form"></i>
                    </span>
                    <InputText className="input_text" placeholder="Apellidos" onChange={(e) => setLastName(e.target.value)} />
                </div>
                {getFieldError("lastName")}
                <div className="p-inputgroup mt-3">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-phone icons_form"></i>
                    </span>
                    <InputText className="input_text" placeholder="Número de teléfono" onChange={(e) => setPhone(e.target.value)} />
                </div>
                {getFieldError("phone")}
                <div className="p-inputgroup mt-3">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-calendar icons_form"></i>
                    </span>
                    <Calendar placeholder="Fecha de nacimiento" onChange={(e) => setBirthdate(e.target.value)} />
                </div>
                {getFieldError("birthdate")}

                <Button className="p-button-raised p-button-lg mt-6" label="Siguiente" onClick={validate} />

            </div>
        </Card>
    )
}

export default UserRegister;