import React from 'react';
import { Button } from 'primereact/button';
import "../../css/views/Home.css";
import { Link } from 'react-router-dom';
const Home = () => {
    return (
        <div className="flex flex-column align-items-center mx-3 mt-8 text-center">
            <img alt="logo-full" src="logo-full.png" height="255"></img>
            <span className="text-4xl pb-6 mt-6">¿Qué quieres hacer ahora?</span>
            <div>
                <Link to="/publish">
                    <Button label="Ceder plaza" className="p-button-raised p-button-rounded mr-2 p-button-lg" />
                </Link>
                <Link to="/search">
                    <Button label="Buscar plaza" className="p-button-raised p-button-rounded p-button-lg" />
                </Link>
            </div>
        </div>
    );
}
export default Home;