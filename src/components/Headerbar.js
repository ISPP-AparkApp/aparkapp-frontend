import React from 'react';
import { Menubar } from 'primereact/menubar';
import "../css/Headerbar.css";
import { useSelector, useDispatch } from 'react-redux'
import { updateUsername } from '../store/session';
import { useNavigate } from 'react-router-dom';

const Headerbar = () => {
    const username = useSelector((state) => state.session.username)
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
        },
        {
            label: 'Notificaciones',
            icon: 'pi pi-bell',
            command: () => {
                navigate("/notifications")
            }
        },
        {
            label: 'Prueba Ruta',
            icon: 'pi pi-bell',
            command: () => {
                navigate("/route")
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
            command: (event) => {
                dispatch(updateUsername(null))
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
            <img alt="logo" src="logo.png" height="60" className='mr-3 logo-img' ></img>
        </div>

    return (
        <div>
            <div className="card">
                <Menubar model={(username) ? itemsUser : items} start={start} />
            </div>
        </div>
    );
}

export default Headerbar;
