import React, { useState, useEffect } from "react";
import { List, Button, Checkbox, Modal, Alert, Empty, } from "antd";
import { EnvironmentOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import AddDirection from "./AddDirection";
import { CompradorService } from "shopit-shared";
import { DtDireccion } from "shopit-shared/dist/user/CompradorService";



const { confirm } = Modal;


interface DirectionsProps {
  permiteSeleccion?: boolean;
  esVendedor: boolean;
  onSelectDirection?: (id: string) => void;
}


export const Directions: React.FC<DirectionsProps> = (props) => {
  const token = localStorage.getItem("token") as string;
  let { onSelectDirection } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDireccion, setIdDireccion] = useState("");
  const [direccionEditar, setDireccionEditar] = useState({ id: "", calle: "", numero: 0, departamento: "", localidad: "", aclaracion: "", esLocal: false });
  const [addDirection, setAddDirection] = useState(false);
  //const [direcciones, setDirecciones] = useState([{title:"", description: "", key: ""}]);
  const [direcciones, setDirecciones] = useState([] as DtDireccion[]);
  const [direccionesLocales, setDireccioneLocales] = useState([] as DtDireccion[]);



  const editarDireccion = (event: any, local: boolean, key?: string) => {
    if (!key) return;

    let direccion = { id: "", calle: "", numero: "", departamento: "", localidad: "", aclaracion: "", esLocal: "" };
    if (local) {
      direccionesLocales.forEach(e => {
        debugger; if (e.id === key) {
          setDireccionEditar({ id: e.id, calle: e.calle, numero: e.numero, departamento: e.departamento, localidad: e.localidad, aclaracion: e.notas, esLocal: e.esLocal });
        }
      })
    } else {
      direcciones.forEach(e => {
        if (e.id === key) {
          setDireccionEditar({ id: e.id, calle: e.calle, numero: e.numero, departamento: e.departamento, localidad: e.localidad, aclaracion: e.notas, esLocal: e.esLocal });
        }
      })
    }

    setIdDireccion(key);
    setIsModalOpen(true);
  }

  const disableButton = () => {
    const buttonCancel = document.getElementById("cancelButton")
    buttonCancel?.setAttribute("disabled", "true");
  }

  const borrarDireccion = (event: any, local: boolean, key: string, esLocal: boolean) => {
    confirm({
      title: 'Realmente quieres eliminar esta dirección?',
      icon: <ExclamationCircleOutlined />,
      content: 'Al confirmar esta dirección ya no aparecerá en tu lista.',
      cancelButtonProps: { id: "cancelButton" },
      cancelText: "Cancelar",
      onOk() {
        disableButton()
        return CompradorService.borrarDireccion(token, key, esLocal).then(res => {
          updateDirecciones();
        })
      },
      onCancel() { },
    });


  };

  const handleClose = () => {
    setIsModalOpen(false);
    setDireccionEditar({ id: "", calle: "", numero: 0, departamento: "", localidad: "", aclaracion: "", esLocal: false });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDireccionEditar({ id: "", calle: "", numero: 0, departamento: "", localidad: "", aclaracion: "", esLocal: false });
  };

  useEffect(() => {
    getDirecciones();
  }, []);

  function onChangeDireccion(event: any, key: any) {
    setIdDireccion(key);
  }

  function onAddDirection() {
    if (addDirection) {
      setAddDirection(false);
    } else {
      setAddDirection(true);
    }

  }

  function updateDirecciones() {
    handleClose();
    getDirecciones();
    onAddDirection();
    setAddDirection(false);
  }


  function onSeleccionarDireccion() {
    if (onSelectDirection != undefined) onSelectDirection(idDireccion);
  }


  function getDirecciones() {
    let direcciones: any = [];
    let locales: any = [];
    CompradorService.obtenerDirecciones(token).then(res => {
      res.forEach(direccion => {
        if (direccion.esLocal) {
          locales.push(direccion);
        } else {
          direcciones.push(direccion);
        }
      });
      setDirecciones(direcciones);
      setDireccioneLocales(locales);
    })
  }

  let locale = {
    emptyText: (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ color: "black" }} description="No se encontraron direcciones :(" />
    )
  }

  return (
    <div>
      <div className="directions-flex-div">
        <h3>Direcciones de envío</h3>
        <List
          locale={locale}
          itemLayout="horizontal"
          dataSource={direcciones}
          renderItem={(item) => (
            <List.Item actions={[<EditOutlined style={{ fontSize: "20px", color: "black" }} onClick={event => editarDireccion(event, false, item.id)} key={item.id}></EditOutlined>, <DeleteOutlined onClick={event => borrarDireccion(event, false, item.id, false)} key={item.id} style={{ fontSize: "20px", color: "#ff4d4f" }} />]}>
              {props.permiteSeleccion && <Checkbox checked={item.id === idDireccion} onChange={e => onChangeDireccion(e, item.id)} style={{ margin: '20px' }}></Checkbox>}
              <List.Item.Meta
                avatar={<EnvironmentOutlined />}
                title={<a>{item.calle + " " + item.numero}</a>}
                description={item.localidad + ", " + item.departamento + (item.notas ? " | " + item.notas : "")}
              />
            </List.Item>
          )}
        />
        {(direccionesLocales.length != 0) && <div style={{ marginTop: "20px" }}>
          <h3>Direcciones de locales</h3>
          <List
            itemLayout="horizontal"
            dataSource={direccionesLocales}
            renderItem={(item) => (
              <List.Item actions={[<EditOutlined style={{ fontSize: "20px", color: "black" }} onClick={event => editarDireccion(event, true, item.id)} key={item.id}></EditOutlined>, <DeleteOutlined onClick={event => borrarDireccion(event, false, item.id, true)} key={item.id} style={{ fontSize: "20px", color: "#ff4d4f" }} /> ]}>
                {props.permiteSeleccion && <Checkbox checked={item.id == idDireccion} onChange={e => onChangeDireccion(e, item.id)} style={{ margin: '20px' }}></Checkbox>}
                <List.Item.Meta
                  avatar={<EnvironmentOutlined />}
                  title={<a>{item.calle + " " + item.numero}</a>}
                  description={item.localidad + ", " + item.departamento + (item.notas ? " | " + item.notas : "")}
                />
              </List.Item>
            )}
          />
        </div>}

        <Button style={{ marginTop: "10px" }} type="ghost" onClick={onAddDirection}>Agregar dirección</Button>
        {props.permiteSeleccion && <Button style={{ marginTop: "10px", display: "block" }} type="ghost" onClick={onSeleccionarDireccion}>Siguiente</Button>}
        {
          props.permiteSeleccion && idDireccion === "" && <Alert type="error" message="Debe seleccionar una dirección para continuar" style={{ marginTop: "10px" }} showIcon={true}></Alert>
        }

        <div style={{ margin: "20px" }}>
          {addDirection && <AddDirection editar={false} esVendedor={props.esVendedor} callBack={updateDirecciones}></AddDirection>}
        </div>
      </div>

      <Modal title="Editar direccion" open={isModalOpen} onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>
        ]}>
        <AddDirection datosActuales={direccionEditar} editar={true} idDireccion={idDireccion} esVendedor={true} callBack={updateDirecciones}></AddDirection>
      </Modal>
    </div>



  );
};
