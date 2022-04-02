import React, { useState } from 'react';
import { Button } from 'primereact/button';
import "../../css/views/Login.css";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Link } from "react-router-dom";
import { login } from "../../api/api";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [formErrors, setFormErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const doLogin = async () => {
        setIsLoading(true)
        const isLogged = await login(username, password)
        setIsLoading(false)
        if (!isLogged) {
            return "El usuario no existe";
        }
    }

    const validate = async () => {
        const errors = {}

        if (!username) {
            errors.username = 'El nombre de usuario no puede estar en blanco';
        }

        if (!password) {
            errors.password = 'La contraseña no puede estar en blanco';
        }

        setFormErrors(errors)
        if (!Object.keys(errors).length) {
            const formError = await doLogin();
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
            <Card title="Inicio de sesión" className="w-full md:w-auto">
                <div className="flex flex-column align-items-center">
                    <img alt="logo-full" src="logo-full.png" height="250" className="mb-4"></img>
                    {isLoading ? <ProgressSpinner /> : null}
                    {getFieldError("global")}
                    <div className="field w-full">
                        <div className="p-inputgroup mt-4">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user icons_form"></i>
                            </span>
                            <InputText className="input_text" placeholder="Nombre de usuario" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        {getFieldError("username")}
                    </div>
                    
                    <div className="field w-full">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-key icons_form"></i>
                            </span>
                            <InputText className="input_text" placeholder="Contraseña" type="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {getFieldError("password")}
                    </div>

                    <Button className="p-button-raised p-button-lg mb-5" label="Iniciar sesión" onClick={validate} />
                    <span className="text-center question_signup">¿No tienes una cuenta?
                        <Link to="/signup" className="tosignup ml-2">Regístrate</Link>
                    </span>
                </div>
            </Card>
        </div>
    );
}
export default Login
