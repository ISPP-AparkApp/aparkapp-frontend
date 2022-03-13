import React from 'react';
import { Button } from 'primereact/button';
import "../../css/views/Login.css";
import { useDispatch } from 'react-redux';
import { updateUsername } from '../../store/session';

const Login = () => {
    const dispatch = useDispatch()
    return (
        <React.Fragment>
            <div className="flex flex-column justify-content-center align-items-center h-fit">
                <Button label="Iniciar sesión" onClick={() => dispatch(updateUsername("username"))} />
            </div>
        </React.Fragment>
    );
}
export default Login
