import "../../css/views/SignUp.css";
import React, { useState } from 'react';
import VehicleRegister from "./VehicleRegister";
import UserRegister from './UserRegister';

const SignUp = () => {
    const [vehicleHidden, setVehicleHidden] = useState(true)
    const [user, setUser] = useState(null)

    return (
        <div className="flex flex-column align-items-center px-3 md:px-0">
            <div className={((vehicleHidden) ? "" : "hidden")}>
                <UserRegister user={user} setUser={setUser} setVehicleHidden={setVehicleHidden} />
            </div>
            <div className={(vehicleHidden) ? "hidden" : ""}>
                <VehicleRegister user={user} setUser={setUser} setVehicleHidden={setVehicleHidden} />
            </div>
        </div>
    );
}
export default SignUp
