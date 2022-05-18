import { Card } from 'primereact/card';
import "../../css/views/Contact.css";

const Contact = () => {

    return (
        <Card title="¡Contáctanos!" className='p-card-about text-center'>
            <div className='grid w-full mt-5'>
                <div className='col-12 md:col-3 flex align-items-center'>
                    <img src="instagram.png" alt="Icono instagram" height={60}></img>
                    <span className='p-social-media font-bold ml-3'>@_aparkapp</span>
                </div>
                <div className='col-12 md:col-3 flex align-items-center'>
                    <img src="twitter.png" alt="Icono twitter" height={60}></img>
                    <span className='p-social-media font-bold ml-3'>@_aparkapp</span>
                </div>
                <div className='col-12 md:col-3 flex align-items-center'>
                    <img src="tiktok.png" alt="Icono tiktok" height={60}></img>
                    <span className='p-social-media font-bold ml-3'>@_aparkapp</span>
                </div>
                <div className='col-12 md:col-3 flex align-items-center'>
                    <img src="gmail.png" alt="Icono gmail" height={60}></img>
                    <span className='p-social-media font-bold ml-3'>aparkapp.info@gmail.com</span>
                </div>
            </div>
            <div className='mt-8 flex flex-column align-items-center'>
                <div>
                    <span className='p-terms-conditions'>
                        Consultar &nbsp;
                        <a
                            href="https://drive.google.com/file/d/160YgRKODsLfu0CZNy36aQ0t2710uTgz9/view?usp=sharing"
                            target="_blank"
                            rel="noreferrer" >
                            Términos y condiciones
                        </a>
                        &nbsp; de AparkApp
                    </span>
                </div>
                <div>
                    <span className='p-terms-conditions'>
                        Horario de disponibilidad: Lunes a Domingo de 8:00 AM a 2:00 AM
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default Contact;