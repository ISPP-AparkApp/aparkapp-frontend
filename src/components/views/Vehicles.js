import React, { useState, useEffect, useRef, Fragment } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Messages } from 'primereact/messages';
import { Dropdown } from "primereact/dropdown";
import { getVehicles, deleteVehicle, updateVehicle, registerVehicle } from "../../api/api";

const Vehicles = () => {
  const [isEditing, setEditing] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [createVehicle, setCreateVehicle] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setlicensePlate] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState();
  const [formErrors, setFormErrors] = useState({});
  const [formErrorsNewVehicle, setFormErrorsNewVehicle] = useState({});

  const types = [
    { name: "Pequeño", value: "Pequeño" },
    { name: "Mediano", value: "Mediano" },
    { name: "Grande", value: "Grande" },
  ];

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (!isEditing && !updated) {
      getVehicles().then((data) => setVehicles(data));
      setUpdated(1);
    }
  }, [updated, isEditing]);

  const cleanData = () => {
    setBrand("");
    setModel("");
    setlicensePlate("");
    setColor("");
    setType(null);
    setFormErrors({});
  }
  const message = useRef(null);

  const addMessage = () => {
    message.current.show([
      { severity: 'error', summary: 'No es posible eliminar su único vehículo' },
    ]);
    window.scrollTo(0, 0)
  }


  const addMessage2 = () => {
    message.current.show([
      { severity: 'error', summary: 'La matrícula introducida ya está registrada' },
    ]);
  }

  const addMessage3 = () => {
    message.current.show([
      { severity: 'error', summary: 'No es posible eliminar un vehículo con anuncios asociados' },
    ]);
    window.scrollTo(0, 0)
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
      let response = await updateVehicle(v.id, v)
      if (response === true) {
        setEditing(0);
        setUpdated(0);
      } else {
        addMessage2();
      }
      window.scrollTo(0, 0)
    }

  }
  const validateNewVehicle = async () => {
    const errors = {}
    var regexLicensePlate = /^[A-Za-z]{0,2}[0-9]{4}[A-Za-z]{2,3}$/
    if (!regexLicensePlate.test(licensePlate)) {
      errors.licensePlate = 'La matrícula introducida no es válida';
    }

    if (brand.length < 3 || brand.length > 30) {
      errors.brand = 'La marca del vehículo debe tener entre 3 y 30 caracteres';
    }

    if (model.length < 2 || model.length > 50) {
      errors.model = 'El modelo del vehículo debe tener entre 1 y 50 caracteres';
    }

    if (color.length < 3 || color.length > 30) {
      errors.color = 'El color del vehículo debe tener entre 3 y 30 caracteres';
    }
    if (!type) errors.type = 'El tamaño es requerido';

    setFormErrorsNewVehicle(errors)
    if (!Object.keys(errors).length) {
      const err = await newVehicle();
      if (err !== false)
        getVehicles().then((data) => setVehicles(data)).then(setCreateVehicle(false))
      if (err) {
        setFormErrorsNewVehicle({ global: err })
      }
      window.scrollTo(0, 0)
    }
  }
  const newVehicle = async () => {
    const vehicleData = {
      brand: brand,
      model: model,
      license_plate: licensePlate,
      color: color,
      type: type,
    }
    let result = await registerVehicle(vehicleData);
    if (result === true) {
      message.current.show({ severity: 'success', summary: 'Vehiculo creado' });
    } else if(result === false) {
      message.current.show({ severity: 'error', summary: 'La matrícula introducida ya está registrada' });
      return false;
    } else {
      const errors = {}
      errors.global = result
      setFormErrorsNewVehicle(errors)
    }
    window.scrollTo(0, 0)
  }
  const getFieldError = (fieldName) => {
    return formErrors[fieldName] && <p className="messageError">{formErrors[fieldName]}</p>
  }
  const getFieldErrorNewVehicle = (fieldName) => {
    return formErrorsNewVehicle[fieldName] && <p className="messageError">{formErrorsNewVehicle[fieldName]}</p>
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
          <input
            type="color"
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
          <p className="text-xl publish_label mb-2 mt-1">Tamaño</p>
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
              className="p-button-rounded p-button-danger  mr-2 mt-4 p-button-cancel"
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
          <p><input type="color" value={v.color} disabled/></p>
          <b className="text-l">Tamaño</b>
          <p className="text-xl">{v.type}</p>
          <div className="div-button">
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-danger mr-2 mt-4 p-button-cancel"
              onClick={async () => {
                if (vehicles.length === 1) {
                  addMessage();
                } else {
                  let deleted = await deleteVehicle(v.id)
                  if (deleted===false){
                    addMessage3()
                  }else{
                    setUpdated(0)
                  }
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

  return (
    <Fragment>
      <Messages ref={message} />
      {!createVehicle ? (
        <div className="div-button mt-4">
          <Accordion activeIndex={0}>{items}</Accordion>
          <Button
            onClick={() => {setCreateVehicle(true);cleanData();}}
            className="p-button p-component p-speeddial-button p-button-rounded p-speeddial-rotate p-button-icon-only mt-2">
            <span className="p-button-icon p-c pi pi-plus"></span>
          </Button>
        </div>
      ) : (
        <div className="form">
          <p className="text-xl publish_label mb-2 mt-1">Matrícula</p>
          <InputText
            value={licensePlate}
            onChange={(b) =>
              setlicensePlate(b.target.value)
            }
          />
          {getFieldErrorNewVehicle("licensePlate")}
          <p className="text-xl publish_label mb-2 mt-1">Marca</p>
          <InputText
            value={brand}
            onChange={(b) =>
              setBrand(b.target.value)
            }
          />
          {getFieldErrorNewVehicle("brand")}
          <p className="text-xl publish_label mb-2 mt-1">Modelo</p>
          <InputText
            value={model}
            onChange={(m) =>
              setModel(m.target.value)
            }
          />
          {getFieldErrorNewVehicle("model")}
          <p className="text-xl publish_label mb-2 mt-1">Color</p>
          <input
            type="color"
            value={color}
            onChange={(c) =>
              setColor(c.target.value)
            }
          />
          {getFieldErrorNewVehicle("color")}
          <p className="text-xl publish_label mb-2 mt-1">Tamaño</p>
          <Dropdown
            className="input_text"
            options={types}
            optionLabel="name"
            value={type}
            onChange={(e) => {
              setType(e.value);
            }}
            placeholder="Tamaño"
          />
          {getFieldErrorNewVehicle("type")}
          <div className="div-button">
            <Button
              label="Cancelar"
              onClick={() => {
                setCreateVehicle(false);
                setFormErrorsNewVehicle({});
              }}
              className="p-button-rounded p-button-raised p-button-danger p-button-lg mr-2 mt-6 p-button-cancel"
            />
            <Button
              label="Guardar"
              onClick={validateNewVehicle}
              className="p-button-raised p-button-rounded p-button-lg mt-6"
            />
          </div>
        </div>
      )}

    </Fragment>
  );
};

export default Vehicles;
