import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { Card } from "primereact/card";
import { Messages } from 'primereact/messages';
import Vehicles from "../views/Vehicles";
import MyRatings from "../views/MyRatings";
import { TabView, TabPanel } from "primereact/tabview";
import { getUser, getProfile, updateUser, updateProfile } from "../../api/api";
import "../../css/views/Profile.css";

const Profile = () => {
  const [isEditing, setEditing] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [formErrors, setFormErrors] = useState({})
  const msgs = useRef(null);

  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});

  async function update(callback) {
    let response = await updateProfile(profile);
    if (response !== true) {
      msgs.current.show({ severity: 'error', summary: response.birthdate });
    } else {
      await updateUser(user);
      callback();
    }
  }

  useEffect(() => {
    if (!isEditing && !updated) {
      getProfile().then((data) => setProfile(data));
      getUser().then((data) => setUser(data));
      setUpdated(1);
    }
  }, [updated, isEditing]);

  addLocale("es", {
    firstDayOfWeek: 1,
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ],
  });

  let anyoActual = new Date().getFullYear();
  let rango = "1900:" + anyoActual;

  const validate = async () => {
    const errors = {}
    if (user.first_name.length < 3 || user.first_name.length > 30) {
      errors.first_name = 'El nombre debe tener una longitud entre 3 y 30 caracteres';
    }

    if (user.last_name.length < 3 || user.last_name.length > 50) {
      errors.last_name = 'Los apellidos deben tener una longitud entre 3 y 50 caracteres';
    }

    if (user.first_name && !/^[a-zA-Z???????????????????????? ]+$/.test(user.first_name)) errors.first_name = 'El nombre solo puede contener letras';
    if (user.last_name && !/^[a-zA-Z???????????????????????? ]+$/.test(user.last_name)) errors.last_name = 'Los apellidos solo pueden contener letras';

    var regexPhone = /^\+?(6\d{2}|7[1-9]\d{1}|9\d{2})\d{6}$/

    if (!regexPhone.test(profile.phone)) {
      errors.phone = 'El n??mero de tel??fono introducido no es v??lido';
    }

    var mail_format = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

    if (!mail_format.test(user.email)) {
      errors.email = 'El email introducido no es v??lido'
    }

    setFormErrors(errors)
    if (!Object.keys(errors).length) {
      update(() => {setUpdated(0); setEditing(0)})
    }
  }

  const getFieldError = (fieldName) => {
    return formErrors[fieldName] && <p className="messageError">{formErrors[fieldName]}</p>
  }

  return (
    <div className="flex flex-column align-items-center px-3 md:px-0">
      <Messages ref={msgs} />
      <Card title="Perfil" className="w-full md:w-auto">
        <TabView className="w-full md:w-auto">
          <TabPanel className="tab-panel" header="Datos">
            {isEditing ? (
              <div className="form">
                <p className="text-xl publish_label mb-2 mt-1">Nombre</p>
                <InputText
                  value={user.first_name}
                  onChange={(e) =>
                    setUser((user) => ({ ...user, first_name: e.target.value }))
                  }
                />
                {getFieldError("first_name")}
                <p className="text-xl publish_label mb-2 mt-1">Apellidos</p>
                <InputText
                  value={user.last_name}
                  onChange={(e) =>
                    setUser((user) => ({ ...user, last_name: e.target.value }))
                  }
                />
                {getFieldError("last_name")}
                <p className="text-xl publish_label mb-2 mt-1">Tel??fono</p>
                <InputText
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((profile) => ({
                      ...profile,
                      phone: e.target.value,
                    }))
                  }
                />
                {getFieldError("phone")}
                <p className="text-xl publish_label mb-2 mt-1">Email</p>
                <InputText
                  value={user.email}
                  onChange={(e) =>
                    setUser((user) => ({ ...user, email: e.target.value }))
                  }
                />
                {getFieldError("email")}
                <p className="text-xl publish_label mb-2 mt-1">
                  Fecha de nacimiento
                </p>
                <Calendar
                  id="basic"
                  value={new Date(profile.birthdate)}
                  onChange={(e) =>
                    setProfile((profile) => ({
                      ...profile,
                      birthdate: new Date(new Date(e.target.value).getTime() - new Date(e.target.value).getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0],
                    }))
                  }
                  locale="es"
                  dateFormat="dd/mm/yy"
                  yearNavigator
                  monthNavigator
                  yearRange={rango}
                />
                {getFieldError("date")}
                <div className="div-button">
                  <Button
                    onClick={() => {
                      setUpdated(0);
                      setEditing(0);
                      setFormErrors({});
                    }}
                    label="Cancelar"
                    className="p-button-rounded p-button-raised p-button-danger p-button-lg mr-2 mt-6 p-button-cancel"
                  />
                  <Button
                    label="Guardar"
                    onClick={validate}
                    className="p-button-raised p-button-rounded p-button-lg mt-6"
                  />
                </div>
              </div>
            ) : (
              <div className="form">
                <b className="text-l">Nombre</b>
                <p className="text-xl">{user.first_name}</p>
                <b className="text-l">Apellidos</b>
                <p className="text-xl">{user.last_name}</p>
                <b className="text-l">Tel??fono</b>
                <p className="text-xl">{profile.phone}</p>
                <b className="text-l">Email</b>
                <p className="text-xl">{user.email}</p>
                <b className="text-l">Fecha de nacimiento</b>
                <p className="text-xl">
                  {new Date(profile.birthdate).toLocaleDateString("es-ES")}
                </p>
                <div className="div-button">
                  <Button
                    onClick={() => setEditing(1)}
                    label="Editar"
                    className="p-button-raised p-button-rounded p-button-lg p-button-warning mt-4"
                  />
                </div>
              </div>
            )}
          </TabPanel>
          <TabPanel header="Veh??culos">
            <Vehicles />
          </TabPanel>
          <TabPanel header="Valoraciones">
            <MyRatings />
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default Profile;
