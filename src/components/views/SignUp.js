import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Link } from "react-router-dom";
import "../../css/views/SignUp.css";

// TODO in sprint 2: We could use React Hook Form to check errors
const SignUp = () => {
    return (
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <Card title="Datos personales" className="w-full md:w-auto">
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
                    <Link to="/vehicle">
                        <Button className="p-button-raised p-button-lg" label="Siguiente" />
                    </Link>
                </div>
            </Card>
        </div>
    );
}
export default SignUp
