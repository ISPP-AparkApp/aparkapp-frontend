import React from 'react';
import { Menubar } from 'primereact/menubar';
import "../css/Headerbar.css";
import { useSelector, useDispatch } from 'react-redux'
import { updateUsername } from '../store/session';

const Headerbar = () => {
    const username = useSelector((state) => state.session.username)
    const dispatch = useDispatch()

    const itemsUser = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
        },
        {
            label: 'Actividad',
            icon: 'pi pi-caret-right',
        },
        {
            label: 'Notificaciones',
            icon: 'pi pi-bell',
        },
        {
            className: "right-start",
            label: 'Perfil',
            icon: 'pi pi-user',
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

        },
        {
            label: 'Registro',
            icon: 'pi pi-user-plus',
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
