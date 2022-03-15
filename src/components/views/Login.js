import React from 'react';
import { Button } from 'primereact/button';
import "../../css/views/Login.css";
import { useDispatch } from 'react-redux';
import { updateUsername } from '../../store/session';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Link } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch()
    return (
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <Card title="Inicio de sesión" className="w-full md:w-auto">
                <div className="flex flex-column align-items-center">
                    <img alt="logo-full" src="logo-full.png" height="250"></img>
                    <div className="p-inputgroup mt-6 mb-3">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Nombre de usuario" />
                    </div>
                    <div className="p-inputgroup mb-5">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-key icons_form"></i>
                        </span>
                        <InputText className="input_text" placeholder="Contraseña" />
                    </div>
                    <Button className="p-button-raised p-button-lg mb-5" label="Iniciar sesión" onClick={() => dispatch(updateUsername("username"))} />
                    <span className="text-center question_signup">¿No tienes una cuenta?
                        <Link to="/signup" className="tosignup ml-2">Regístrate</Link>
                    </span>
                </div>
            </Card>
        </div>
    );
}
export default Login
