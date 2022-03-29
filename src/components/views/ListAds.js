import { Link } from "react-router-dom";
import { DataScroller } from 'primereact/datascroller';
import "../../css/views/ListAds.css";
import "../../../node_modules/primereact/datascroller/datascroller.min.css"
import { reserve } from '../../api/api';
import { dateFormatter } from '../../utils/dateFormatter';
import { Button } from 'primereact/button';

const ListAds = ({ announcements }) => {
    const reserveAnnouncement = async (id) => {
        const reservetData = {
            announcement: id,
        }
        await reserve(reservetData);
    }

    const itemTemplate = (data) => {
        return (
            <div className="product-item">
                <div className="product-detail">
                    <div className="product-name">{dateFormatter(new Date(data.date))}</div>

                    <div className="product-description">Tiempo de espera: {data.wait_time} min</div>
                    <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.zone}</span>  <span className='mobility'><strong>{String(data.limited_mobility) === 'true' ? "♿ Plaza de movilidad reducida" : ""}</strong></span>
                </div>
                <div className="product-action">
                    <Link to={`/reserve/${data.id}`}>
                        <Button icon="pi pi-shopping-cart" label={data.price} onClick={() => reserveAnnouncement(data.id)}>€</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='announcements-list'>
            <div className="datascroller-demo block">
                <div className='announcement-card'>
                    <DataScroller value={announcements} itemTemplate={itemTemplate} rows={5} inline scrollHeight="500px" header="Desliza hacia abajo para ver más" emptyMessage="Selecciona una zona para visualizar los anuncios" />
                </div>
            </div>
        </div>
    )
}

export default ListAds