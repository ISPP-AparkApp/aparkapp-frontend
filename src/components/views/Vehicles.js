import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";

const Vehicles = () => {
  const [isEditing, setEditing] = useState(0);

  const types = [
    { name: "Segmento A", code: "A" },
    { name: "Segmento B", code: "B" },
    { name: "Segmento C", code: "C" },
    { name: "Segmento D", code: "D" },
    { name: "Segmento E", code: "E" },
    { name: "Segmento F", code: "F" },
  ];

  const vehiclesUser = [ // Aquí en lugar de estos valores, es necesario hacer la llamada API
    {
      id: 1,
      brand: "Fiat",
      model: "500",
      license_plate: "1423AMX",
      color: "blanco",
      type: { name: "Segmento E", code: "E" },
    },
    {
      id: 2,
      brand: "Seat",
      model: "León",
      license_plate: "9281LSO",
      color: "negro",
      type: { name: "Segmento A", code: "A" },
    },
  ]

  const [vehicles, setVehicles] = useState(vehiclesUser);

  function setDefaultValues() {
    setVehicles(vehiclesUser)
  }

  const items = vehicles.map((v, i) => (
    <AccordionTab
      key={v.id}
      header={"Vehículo " + (i + 1)}
      toggleable
      collapsed
    >
      {isEditing === v.id ? (
        <div>
          <h5>Matrícula</h5>
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
          <h5>Marca</h5>
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
          <h5>Modelo</h5>
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
          <h5>Color</h5>
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
          <h5>Segmento</h5>
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
          /><br/>
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-danger  mr-2 mt-4"
            onClick={() => {
              setEditing(0);
              setDefaultValues();
            }}
          />
          <Button
            icon="pi pi-check"
            className="p-button-rounded"
            onClick={() => {
              setEditing(0);
            }}
          />
        </div>
      ) : (
        <div>
          <h5>Matrícula</h5>
          <p>{v.license_plate}</p>
          <h5>Marca</h5>
          <p>{v.brand}</p>
          <h5>Modelo</h5>
          <p>{v.model}</p>
          <h5>Color</h5>
          <p>{v.color}</p>
          <h5>Segmento</h5>
          <p>{v.type.name}</p>
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger mr-2 mt-4"
          />
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-warning"
            onClick={() => setEditing(v.id)}
          />
        </div>
      )}
    </AccordionTab>
  ));

  return <Accordion activeIndex={0}>{items}</Accordion>;
};

export default Vehicles;
