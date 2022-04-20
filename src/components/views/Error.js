import React from 'react';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import errorImage from '../../images/error.png';

const Error = ({ text }) => {
    return (
        <div className="flex flex-column align-items-center mx-3 mt-8 text-center">
            <img alt="error" src={errorImage}></img>
            <span className="text-4xl pb-6 mt-6">{text ? text : "Ooops!! Parece que hubo un error :("}</span>
            <div>
                <Link to="/home">
                    <Button label="Ir a la página de inicio" className="p-button-raised p-button-rounded mr-2 p-button-lg" />
                </Link>
            </div>
        </div>
    );
}
export default Error;