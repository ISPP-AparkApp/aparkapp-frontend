import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { Messages } from 'primereact/messages';
import Vehicles from "../views/Vehicles";
import { TabView, TabPanel } from "primereact/tabview";

const Profile = () => {
  const [isEditing, setEditing] = useState(false);

  // Cambiar por datos guardados del usuario que vengan de la llamada API
  const [name, setName] = useState("Jose Manuel");
  const [surname, setSurname] = useState("Estrada Báez");
  const [phone, setPhone] = useState("633917768");
  const [email, setEmail] = useState("jsestr@correo.com");
  const [password, setPassword] = useState("contraseña1234");
  const [birthdate, setBirthdate] = useState(new Date(1993, 7, 12));

  function setDefaultValues() {
    setName("Jose Manuel");
    setSurname("Estrada Báez");
    setPhone("633917768");
    setEmail("jestr@correo.com");
    setPassword("contraseña1234");
    setBirthdate(new Date(1993, 7, 12));
  }

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

  const message = useRef(null);

  const addMessage = () => {
    message.current.show([
        { severity: 'success', summary: 'Guardado correctamente' },
    ]);
}

  return (
    <div className="flex flex-column justify-content-center align-items-center h-fit mx-3 text-center overflow-hidden">
      <Messages ref={message} />
      <TabView>
        <TabPanel header="Datos">
        {isEditing ? (
            <div className="form">
              <h5>Nombre</h5>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <h5>Apellidos</h5>
              <InputText
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
              <h5>Teléfono</h5>
              <InputText
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <h5>Email</h5>
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <h5>Fecha de nacimiento</h5>
              <Calendar
                id="basic"
                value={birthdate}
                onChange={(e) => setBirthdate(e.value)}
                locale="es"
                dateFormat="dd/mm/yy"
              />
              <h5>Contraseña</h5>
              <Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleMask
              />
              <br />
              <Button
                onClick={() => {
                  setEditing(false);
                  setDefaultValues();
                }}
                label="Cancelar"
                className="p-button-rounded p-button-raised p-button-danger p-button-lg mr-2 mt-6"
              />
              <Button
                label="Guardar"
                onClick={() => {
                  setEditing(false);
                  addMessage();
                }}
                className="p-button-raised p-button-rounded p-button-lg mt-6"
              />
            </div>
          ) : (
            <div>
              <h5>Nombre</h5>
              <p>{name}</p>
              <h5>Apellidos</h5>
              <p>{surname}</p>
              <h5>Teléfono</h5>
              <p>{phone}</p>
              <h5>Email</h5>
              <p>{email}</p>
              <h5>Fecha de nacimiento</h5>
              <p>{birthdate.toLocaleDateString("es-ES")}</p>
              <Button
                onClick={() => setEditing(true)}
                label="Editar"
                className="p-button-raised p-button-rounded p-button-lg p-button-warning mt-4"
              />
            </div>
          )}
        </TabPanel>
        <TabPanel header="Vehículos">
            <Vehicles/>
        </TabPanel>
        <TabPanel header="Valoraciones">
            Implementación futura...
        </TabPanel>
      </TabView>
    </div>
  );
};

export default Profile;
