import React from 'react';
import { Button } from 'primereact/button';
import "../../css/views/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <React.Fragment>
            <div className="flex flex-column justify-content-center align-items-center h-fit mx-3 text-center overflow-hidden">
                <img alt="logo-full" src="logo-full.png" height="400"></img>
                <span className="text-5xl pb-6 mt-6">¿Qué quieres hacer ahora?</span>
                <div>
                    <Button label="Ceder plaza" className="p-button-raised p-button-rounded mr-2 p-button-lg" />
                    <Link to="/search">
                        <Button label="Buscar plaza" className="p-button-raised p-button-rounded p-button-lg" />
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
}
export default Home;