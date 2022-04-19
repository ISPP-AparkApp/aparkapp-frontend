import React, { useRef } from 'react';
import { DataScroller } from 'primereact/datascroller';
import "../../css/views/ListAds.css";
import "../../../node_modules/primereact/datascroller/datascroller.min.css"
import { transaction } from '../../api/api';
import { dateFormatter } from '../../utils/dateFormatter';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';

const ListAds = ({ announcements }) => {
    const msgs = useRef(null);

    const pay = async (id) => {
        transaction(id).then(data => {
            data === true ? (window.location.href = "/reserve/" + id) :
            (msgs.current.show({ severity: 'error', detail: data }, window.scrollTo(0, 0)));
        })
    }

    const confirmPay = (id, price) => {
        confirmDialog({
          message: 'Se cobrará ' + price + '€ del crédito actual que posee',
          header: '¿Deseas confirmar la compra?',
          icon: 'pi pi-info-circle',
          acceptLabel: 'Confirmar',
          rejectLabel: 'Cancelar',
          accept: () => pay(id)
        });
      };

    const itemTemplate = (data) => {
        return (
            <div className="product-item">
                <div className="product-detail">
                    <div className="product-name">{dateFormatter(new Date(data.date))}</div>
                    <div className="product-description">Tiempo de espera: {data.wait_time} min</div>
                    <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.zone}</span>  <span className='mobility'><strong>{String(data.limited_mobility) === 'true' ? "♿ Plaza de movilidad reducida" : ""}</strong></span>
                </div>
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
        </div>
    )
}

export default ListAds