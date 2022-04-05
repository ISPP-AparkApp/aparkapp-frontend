import React from 'react';
import { Menubar } from 'primereact/menubar';
import "../css/Headerbar.css";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { isUserLogged, logout } from "../store/session";
import logo from "../images/logo.png";

const Headerbar = () => {
    const navigate = useNavigate()
    const userIsLogged = useSelector(isUserLogged)
    const dispatch = useDispatch()

    const itemsUser = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => {
                navigate("/home")
            }
        },
        {
            label: 'Actividad',
            icon: 'pi pi-caret-right',
            command: () => {
                navigate("/activity")
            }
        },
        {
            className: "right-start",
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => {
                navigate("/profile")
            }
        },
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                dispatch(logout())
            }
        }
    ];

    const items = [
        {
            className: "right-start",
            label: 'Iniciar sesión',
            icon: 'pi pi-sign-in',
            command: () => {
                navigate("/login")
            }
        },
        {
            label: 'Registro',
            icon: 'pi pi-user-plus',
            command: () => {
                navigate("/signup")
            }
        },
    ]

    const start =
        <div className='flex align-items-center'>
            <img alt="logo" src={logo} height="60" className='mr-3 logo-img' ></img>
        </div>

    return (
        <div>
            <div className="card">
                <Menubar model={(userIsLogged) ? itemsUser : items} start={start} />
            </div>
        </div>
    );
}

export default Headerbar;
