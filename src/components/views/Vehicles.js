import React, { useState, useEffect, useRef, Fragment } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Messages } from 'primereact/messages';
import { Dropdown } from "primereact/dropdown";
import { getVehicles, deleteVehicle, updateVehicle } from "../../api/api";

const Vehicles = () => {
  const [isEditing, setEditing] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [formErrors, setFormErrors] = useState({})

  const types = [
    { name: "Segmento A", value: "Segmento A" },
    { name: "Segmento B", value: "Segmento B" },
    { name: "Segmento C", value: "Segmento C" },
    { name: "Segmento D", value: "Segmento D" },
    { name: "Segmento E", value: "Segmento E" },
    { name: "Segmento F", value: "Segmento F" },
  ];

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (!isEditing && !updated) {
      getVehicles().then((data) => setVehicles(data));
      setUpdated(1);
    }
  }, [updated, isEditing]);

  const message = useRef(null);

  const addMessage = () => {
    message.current.show([
        { severity: 'error', summary: 'No es posible eliminar su único vehículo' },
    ]);
}

const validate = async (list_position) => {
  const errors = {}
  const v = vehicles[list_position]

  var regexLicensePlate = /^[A-Za-z]{0,2}[0-9]{4}[A-Za-z]{2,3}$/
  if (!regexLicensePlate.test(v.license_plate)) {
    errors.license_plate = 'La matrícula introducida no es válida';
  }

  if (v.brand.length < 3 || v.brand.length > 30) {
    errors.brand = 'La marca del vehículo debe tener entre 3 y 30 caracteres';
  }

  if (v.model.length < 2 || v.model.length > 50) {
    errors.model = 'El modelo del vehículo debe tener entre 1 y 50 caracteres';
  }

  if (v.color.length < 3 || v.color.length > 30) {
    errors.color = 'El color del vehículo debe tener entre 3 y 30 caracteres';
  }

  setFormErrors(errors)
  if (!Object.keys(errors).length) {
    updateVehicle(v.id, v).then(() => setEditing(0)).then(() => setUpdated(0))
  }
}

const getFieldError = (fieldName) => {
  return formErrors[fieldName] && <p className="messageError">{formErrors[fieldName]}</p>
}

  const items = vehicles.map((v, i) => (
    <AccordionTab
      key={v.id}
      header={"Vehículo " + (i + 1)}
      toggleable
      collapsed
    >
      {isEditing === v.id ? (
        <div className="form">
          <p className="text-xl publish_label mb-2 mt-1">Matrícula</p>
          <InputText
            value={v.license_plate}
            onChange={(e) => {
              let vehiclesList = [...vehicles];
              let vehicle = {
                ...vehiclesList[i],
                license_plate: e.target.value,
              };
              vehiclesList[i] = vehicle;
              setVehicles(vehiclesList);
            }}
          />
          {getFieldError("license_plate")}
          <p className="text-xl publish_label mb-2 mt-1">Marca</p>
          <InputText
            value={v.brand}
            onChange={(e) => {
              let vehiclesList = [...vehicles];
              let vehicle = {
                ...vehiclesList[i],
                brand: e.target.value,
              };
              vehiclesList[i] = vehicle;
              setVehicles(vehiclesList);
            }}
          />
          {getFieldError("brand")}
          <p className="text-xl publish_label mb-2 mt-1">Modelo</p>
          <InputText
            value={v.model}
            onChange={(e) => {
              let vehiclesList = [...vehicles];
              let vehicle = {
                ...vehiclesList[i],
                model: e.target.value,
              };
              vehiclesList[i] = vehicle;
              setVehicles(vehiclesList);
            }}
          />
          {getFieldError("model")}
          <p className="text-xl publish_label mb-2 mt-1">Color</p>
          <InputText
            value={v.color}
            onChange={(e) => {
              let vehiclesList = [...vehicles];
              let vehicle = {
                ...vehiclesList[i],
                color: e.target.value,
              };
              vehiclesList[i] = vehicle;
              setVehicles(vehiclesList);
            }}
          />
          {getFieldError("color")}
          <p className="text-xl publish_label mb-2 mt-1">Segmento</p>
          <Dropdown
            options={types}
            optionLabel="name"
            value={v.type}
            onChange={(e) => {
              let vehiclesList = [...vehicles];
              let vehicle = {
                ...vehiclesList[i],
                type: e.target.value,
              };
              vehiclesList[i] = vehicle;
              setVehicles(vehiclesList);
            }}
          />
          <br />
          <div className="div-button">
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-danger  mr-2 mt-4"
              onClick={() => {
                setUpdated(0);
                setEditing(0);
                setFormErrors({});
              }}
            />
            <Button
              icon="pi pi-check"
              className="p-button-rounded"
              onClick={() => {
                validate(i);
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          <b className="text-l">Matrícula</b>
          <p className="text-xl">{v.license_plate}</p>
          <b className="text-l">Marca</b>
          <p className="text-xl">{v.brand}</p>
          <b className="text-l">Modelo</b>
          <p className="text-xl">{v.model}</p>
          <b className="text-l">Color</b>
          <p className="text-xl">{v.color}</p>
          <b className="text-l">Segmento</b>
          <p className="text-xl">{v.type}</p>
          <div className="div-button">
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger mr-2 mt-4 p-button-cancel"
              onClick={() => {
                if (vehicles.length === 1) {
                  addMessage();
                } else {
                deleteVehicle(v.id).then(() => setUpdated(0));
                }
              }}
            />
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-warning"
              onClick={() => setEditing(v.id)}
            />
          </div>
        </div>
      )}
    </AccordionTab>
  ));

  return <Fragment><Messages ref={message} /><Accordion activeIndex={0}>{items}</Accordion></Fragment>;
};

export default Vehicles;
