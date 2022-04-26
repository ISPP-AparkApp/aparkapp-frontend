import { Card } from 'primereact/card';
import "../../css/views/Contact.css";

const Contact = () => {

    return (
        <Card title="¡Contáctanos!" className='p-card-about text-center'>
            <div className='grid w-full mt-5'>
                <div className='col-12 md:col-4'>
                    <img src="instagram.png" alt="Icono instagram" height={60}></img>
                    <span className='p-social-media font-bold ml-3'>@_apparkapp</span>
                </div>
                <div className='col-12 md:col-4'>
                    <img src="twitter.png" alt="Icono twitter" height={60}></img>
                    <span className='p-social-media font-bold ml-3'>@ApparkApp</span>
                </div>
                <div className='col-12 md:col-4'>
                    <img src="gmail.png" alt="Icono gmail" height={60}></img>
                    <span className='p-social-media font-bold ml-3'>aparkapp.info@gmail.com</span>
                </div>
            </div>
            <div className='mt-8 flex flex-column align-items-center'>
                <div>
                    <span className='p-terms-conditions'>
                        Consultar &nbsp;
                        <a
                            href="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/20db1f27-07b2-4b56-beec-9065cf13a582/aparkapp_GDPR.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220424%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220424T142607Z&X-Amz-Expires=86400&X-Amz-Signature=7502743dc100987acf2614609f32215ad7ceecd12c36dd1ea46ddaf7a09560df&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22aparkapp_GDPR.pdf%22&x-id=GetObject"
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