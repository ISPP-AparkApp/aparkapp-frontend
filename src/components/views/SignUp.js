import "../../css/views/SignUp.css";
import React, { useState } from 'react';
import { register } from "../../api/api";
import { dateFormatter } from '../../utils/dataFormatter';
import { login } from "../../api/api";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import "../../css/views/Vehicle.css";
import { addLocale } from "primereact/api";

const SignUp = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [email, setEmail] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [color, setColor] = useState("");
    const [selectedType, setSelectedType] = useState(null);
    const [checked, setChecked] = useState(false);

    const [formErrors, setFormErrors] = useState({});

    addLocale("es", {
        firstDayOfWeek: 1,
        dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
        monthNames: [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ],
      });

    const validate = async () => {
        const errors = {}

        // user validation
        if (!username) errors.username = 'El nombre de usuario es requerido';
        if (!password) errors.password = 'La contraseña es requerida';
        if (!email) errors.email = 'El email es requerido';
        if (!firstName) errors.firstName = 'El nombre es requerido';
        if (!lastName) errors.lastName = 'El apellido es requerido';
        if (!phone) errors.phone = 'El teléfono es requerido';
        if (!birthdate) errors.birthdate = 'La fecha de nacimiento es requerida';

        if (firstName.length < 3 || firstName.length > 30) errors.firstName = 'El nombre debe tener una longitud entre 3 y 30 caracteres';
        if (lastName.length < 3 || lastName.length > 50) errors.lastName = 'Los apellidos deben tener una longitud entre 3 y 50 caracteres';

        if (firstName && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(firstName)) errors.firstName = 'El nombre solo puede contener letras';
        if (lastName && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(lastName)) errors.lastName = 'Los apellidos solo pueden contener letras';

        var mail_format = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        if (!mail_format.test(email)) {
            errors.email = 'El email introducido no es válido'
        }

        var regexPhone = /^\+?(6\d{2}|7[1-9]\d{1}|9\d{2})\d{6}$/
        if (!regexPhone.test(phone)) errors.phone = 'El número de teléfono introducido no es válido';

        // vehicle validation

        if (!brand) errors.brand = 'La marca es requerida';
        if (!model) errors.model = 'El modelo es requerido';
        if (!licensePlate) errors.licensePlate = 'La matrícula es requerida';
        if (!color) errors.color = 'El color es requerido';
        if (!selectedType) errors.selectedType = 'El tamaño es requerido';
        if (!checked) errors.termsConditions = 'Debe aceptar los términos y condiciones';

        var regexLicensePlate = /^[A-Za-z]{0,2}[0-9]{4}[A-Za-z]{2,3}$/
        if (!regexLicensePlate.test(licensePlate)) errors.licensePlate = 'La matrícula introducida no es válida';

        if (brand.length < 3 || brand.length > 30) errors.brand = 'La marca del vehículo debe tener entre 3 y 30 caracteres';
        if (model.length < 2 || model.length > 50) errors.model = 'El modelo del vehículo debe tener entre 1 y 50 caracteres';
        if (color.length < 3 || color.length > 30) errors.color = 'El color del vehículo debe tener entre 3 y 30 caracteres';

        setFormErrors(errors)

        if (!Object.keys(errors).length) {
            const user = {
                "username": username,
                "password": password,
                "email": email,
                "firstName": firstName,
                "lastName": lastName,
                "phone": phone,
                "birthdate": birthdate
            }

            const vehicle = {
                "licensePlate": licensePlate,
                "brand": brand,
                "model": model,
                "color": color,
                "selectedType": selectedType
            }

            const formError = await doRegister(user, vehicle);
            if (formError) {
                setFormErrors({ global: formError })
            } else {
                localStorage.setItem("username", user.username)
                await login(user.username, user.password)
            }
        }
    }

    const getFieldError = (fieldName) => {
        return formErrors[fieldName] && <span className="messageError">{formErrors[fieldName]}</span>
    }

    let anyoActual = new Date().getFullYear();
    let rango = "1900:" + anyoActual;

    const types = [
        { name: "Pequeño" },
        { name: "Mediano" },
        { name: "Grande" },
    ]

    const doRegister = async (user, vehicle) => {
        const registerFields = {
            username: user.username,
            password: user.password,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            profile: {
                phone: user.phone,
                birthdate: dateFormatter(user.birthdate).split(" ")[0]
            },
            vehicles: [
                {
                    brand: vehicle.brand,
                    model: vehicle.model,
                    license_plate: vehicle.licensePlate,
                    color: vehicle.color,
                    type: vehicle.selectedType.name
                },
            ]
        }
        let response = await register(registerFields)
        if (response !== true) {
            return Object.entries(response.error).map(([key, value]) => <p key={key}>{value}</p>);
        }
        window.scrollTo(0, 0)
    }

    return (
        <div className="flex flex-column align-items-center text-center px-3 md:px-0">
            <img alt="logo-full" src="logo-full.png" height="250" width="250" className='m-auto mt-3'></img>
            {getFieldError("global")}
            <div className="md:flex flex-row">
                <div >
                    <Card title="Datos personales" className={"p-card-register w-full md:w-auto"}>
                        <div className="flex flex-column">
                            <div className="p-inputgroup">
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
                                    <i className="pi pi-at icons_form"></i>
                                </span>
                                <InputText className="input_text" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            {getFieldError("email")}
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
                                <Calendar className="p-birthdate-calendar" placeholder="Fecha de nacimiento" onChange={(e) => setBirthdate(e.target.value)} yearNavigator monthNavigator locale="es" dateFormat="dd/mm/yy" yearRange={rango} />
                            </div>
                            {getFieldError("birthdate")}

                        </div>
                    </Card>
                </div>
                <div >
                    <Card title="Datos de tu vehículo" className={"w-full md:w-auto"}>
                        <div className="flex flex-column">
                            <div className="p-inputgroup">
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
                                <div>
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-palette icons_form"></i>
                                    </span>
                                </div>
                                <div className="p-inputgroup mt-0">
                                    <input type="color" id="color" className="input_text" placeholder="Color" onChange={(e) => setColor(e.target.value)} />
                                </div>
                            </div>
                            {getFieldError("color")}
                            <div className="p-inputgroup mt-3">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-ellipsis-h icons_form"></i>
                                </span>
                                <Dropdown className="input_text" value={selectedType} options={types} onChange={(e) => setSelectedType(e.target.value)} optionLabel="name" placeholder="Tamaño" />
                            </div>
                            {getFieldError("selectedType")}
                        </div>
                    </Card>
                </div>
            </div>
            <div className="text-center">
                <div className="flex flex-column field-checkbox">
                    <div className="flex">
                        <Checkbox className="mr-2" inputId="termsConditions" checked={checked} onChange={e => setChecked(e.checked)} />
                        <label htmlFor="termsConditions">Aceptar los&nbsp;
                            <a
                                href="https://drive.google.com/file/d/160YgRKODsLfu0CZNy36aQ0t2710uTgz9/view?usp=sharing"
                                target="_blank"
                                rel="noreferrer" >Términos y condiciones
                            </a>
                        </label>
                    </div>
                    {getFieldError("termsConditions")}
                </div>
                <Button className="p-button-raised p-button-lg" label="Registrar" onClick={validate} />
            </div>
        </div>
    );
}
export default SignUp
