import React, { useState, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { Chip } from 'primereact/chip';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import { getMyBalance, addCredit, withdrawCredit } from "../../api/api";
import "../../css/views/Credit.css";

const Credit = () => {
    const [credit, setCredit] = useState("");
    const [email, setEmail] = useState('');
    const errors = {};
    const msgs = useRef(null);


    const validate = async (amount) => {
        var mail_format = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        if (!mail_format.test(email))
            errors.email = 'El email introducido no es válido';
        if (!email)
            errors.email = 'El email es requerido';
        if (parseFloat(credit.slice(0, -1)) < parseFloat(amount.slice(1)))
            errors.credit = 'No tienes crédito suficiente';
        if (errors.email)
            msgs.current.show({ severity: 'error', detail: errors.email }, window.scrollTo(0, 0));
        if (errors.credit)
        msgs.current.show({ severity: 'error', detail: errors.credit }, window.scrollTo(0, 0));
    }

    getMyBalance().then(data => {
        setCredit(data.slice(1) + data[0]);
    })

    const pay = async (price) => {
        const amount = { amount: price };
        addCredit(amount).then(data => {
            window.location.href = data.url;
        });
    }

    const confirmWhitdraw = (credit) => {
        validate(credit).then(() => {
            if (!errors.email && !errors.credit)
                confirmDialog({
                    message: 'Se retirarán ' + credit.slice(1) + '€ del crédito actual que posee y se le enviará a la cuenta de Paypal con correo ' + email,
                    header: '¿Deseas confirmar el traspaso?',
                    icon: 'pi pi-info-circle',
                    acceptLabel: 'Confirmar',
                    rejectLabel: 'Cancelar',
                    accept: () => { withdrawWithPayPal(credit); msgs.current.show({ severity: 'success', detail: "El saldo ha sido retirado correctamente" }, window.scrollTo(0, 0)); }
                });
        });
    };

    const withdrawWithPayPal = (credit) => {
        const amount = { funds: credit, funds_currency: "EUR" };
        withdrawCredit(amount);
        getMyBalance().then(data => {
            setCredit(data.slice(1) + data[0]);
        });
    }

    return (
        <div className="flex flex-column align-items-center mx-3 text-center">
            <Card className="w-full md:w-auto">
                <p className="text-xl publish_label">Crédito actual: {credit}</p>
                <TabView className="tabview-header-icon">
                    <TabPanel header="Añadir" leftIcon="pi pi-shopping-cart">
                        <div>
                            <p className="text-xl publish_label">Seleccione la cantidad que desea adquirir</p>
                            <Button label="2.50€" className="p-button-raised p-button-lg mb-3 w-full h-full" onClick={() => pay("2.50")} />
                            <Button label="5€" className="p-button-raised p-button-lg mb-3 w-full h-full" onClick={() => pay("5")} />
                            <Button label="10€" className="p-button-raised p-button-lg mb-3 w-full h-full" onClick={() => pay("10")} />
                            <Button label="20€" className="p-button-raised p-button-lg mb-3 w-full h-full" onClick={() => pay("20")} />
                            <Button label="50€" className="p-button-raised p-button-lg w-full h-full" onClick={() => pay("50")} />
                        </div>
                    </TabPanel>
                    <TabPanel header="Retirar" leftIcon="pi pi-money-bill">
                        <Messages ref={msgs} />
                        <div className="container">
                            <div className="containerBadge">
                                <Chip label="MODO DE PRUEBA" icon="pi pi-paypal" className="mr-2 mb-3 chip_paypal" />
                            </div>
                            <InputText className="input_text w-full mb-3" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Introduzca su correo" />
                            <p className="text-xl publish_label">Seleccione la cantidad que desea retirar</p>
                            <Button label="5€" className="p-button-raised p-button-lg w-full mb-3 h-full" onClick={() => confirmWhitdraw("-5")} />
                            <Button label="10€" className="p-button-raised p-button-lg w-full mb-3 h-full" onClick={() => confirmWhitdraw("-10")} />
                            <Button label="15€" className="p-button-raised p-button-lg w-full h-full" onClick={() => confirmWhitdraw("-15")} />
                        </div>
                    </TabPanel>
                </TabView>
            </Card>
        </div>
    );
}

export default Credit