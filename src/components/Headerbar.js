import React, { useState, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import "../css/Headerbar.css";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { isUserLogged, logout } from "../store/session";
import logo from "../images/logo.png";
import { getMyBalance } from "./../api/api";


const Headerbar = () => {
    const [credit, setCredit] = useState("");
    const [time, setTime] = useState(false);
    const navigate = useNavigate();
    const userIsLogged = useSelector(isUserLogged);
    const dispatch = useDispatch();

    if (userIsLogged && credit === "")  // Init credit in headerbar
        getMyBalance().then(data => {
            setCredit(data.replace('€', '').replace(',', '.'));
        })

    useEffect(() => {
        if (userIsLogged) {
            const interval = setInterval(() => {
                if (time) {
                    setTime(false);
                    getMyBalance().then(data => {
                        setCredit(data.replace('€', '').replace(',', '.'));
                    })
                }
                else {
                    setTime(true);
                }
            }, 3000);
            return () => clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [credit, time, userIsLogged]);


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
            label: 'Contacto',
            icon: 'pi pi-phone',
            command: () => {
                navigate("/contact")
            }
        },
        {
            className: "right-start",
            label: credit + " €",
            icon: 'pi pi-wallet',
            command: () => {
                navigate("/credit")
            }
        },
        {
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
            label: 'Contacto',
            icon: 'pi pi-phone',
            command: () => {
                navigate("/contact")
            }
        },
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
