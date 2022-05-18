import React, { useRef } from 'react';
import { DataScroller } from 'primereact/datascroller';
import "../../css/views/ListAds.css";
import "../../../node_modules/primereact/datascroller/datascroller.min.css"
import { getOneUser, getUserRatings, transaction } from '../../api/api';
import { dateFormatterActivities } from '../../utils/dateFormatter';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import { Rating } from 'primereact/rating';

const ListAds = ({ announcements }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [user, setUser] = useState(null)
    const [comments, setComments] = useState([])
    const msgs = useRef(null);

    const pay = async (id) => {
        transaction(id).then(data => {
            data === true ? (window.location.href = "/reserve/" + id) :
                (msgs.current.show({ severity: 'error', detail: data }, window.scrollTo(0, 0)));
        })
    }

    const confirmPay = (id, price) => {
        confirmDialog({
            message: 'Se cobrará ' + price + ' € del crédito actual que posee',
            header: '¿Deseas confirmar la compra?',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Confirmar',
            rejectLabel: 'Cancelar',
            accept: () => pay(id)
        });
    };

    function getRatings(data) {
        getOneUser(data.user).then(data => setUser(data.username))
        getUserRatings(data.user).then(data => {
            var c = []
            data.forEach(d => c.push(
                <div key={d.id}>
                    <p>{"- " + d.comment}
                    </p>
                    <Rating value={d.rate} readOnly stars={5} cancel={false} disabled />
                </div>
            ))
            setComments(c)
        })
        setShowDialog(true)
    }

    const itemTemplate = (data) => {
        return (
            <div className="product-item">
                <div className="product-detail">
                    <div className="product-name">{dateFormatterActivities(new Date(data.date))}</div>
                    <div className="product-description">Tiempo de espera: {data.wait_time} min</div>
                    <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.zone}</span>  <span className='mobility'><strong>{String(data.limited_mobility) === 'true' ? "♿ Plaza de movilidad reducida" : ""}</strong></span>
                </div>
                <Button icon="pi pi-star" label="Valoraciones" onClick={() => getRatings(data)} />
                <div className="product-action">
                    <Button icon="pi pi-shopping-cart" label={data.price} onClick={() => confirmPay(data.id, data.price)}>€</Button>
                </div>
            </div>
        );
    }

    return (
        <div className='announcements-list'>
            <div className="datascroller-demo block">
                <div className='announcement-card'>
                    <Messages ref={msgs} />
                    <DataScroller value={announcements} itemTemplate={itemTemplate} rows={5} inline scrollHeight="500px" header="Plazas disponibles en la zona" emptyMessage="Selecciona una zona para visualizar los anuncios" />
                </div>
            </div>
            <Dialog header={"Valoraciones del usuario: " + user} visible={showDialog} onHide={() => setShowDialog(false)}>
                {comments}
            </Dialog>
        </div>
    )
}

export default ListAds