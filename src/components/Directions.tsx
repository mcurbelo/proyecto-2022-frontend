import React, {useState,useEffect} from "react";
import { List, Avatar, Button, Checkbox, message, Modal,  } from "antd";
import { EnvironmentOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddDirection from "./AddDirection";
import { CompradorService } from "shopit-shared";
import { DtDireccion } from "shopit-shared/dist/user/CompradorService";






interface DirectionsProps {
  permiteSeleccion ?: boolean;
  esVendedor?:boolean;
  onSelectDirection?: (id: string) => void;
}


export const Directions: React.FC<DirectionsProps> = (props) => {
  const token =  localStorage.getItem("token") as string;
  let { onSelectDirection } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDireccion, setIdDireccion] = useState("");
  const [siguienteVisible, setSiguienteVisible] = useState(true);
  const [direccionEditar, setDireccionEditar] = useState({id: "", calle:"", numero: 0, departamento:"", localidad: "", aclaracion:"", esLocal: false});
  const [addDirection, setAddDirection] = useState(false);
  //const [direcciones, setDirecciones] = useState([{title:"", description: "", key: ""}]);

  const [direcciones, setDirecciones] = useState([] as DtDireccion[]);
  const [direccionesLocales, setDireccioneLocales] = useState([] as DtDireccion[]);
  

  const editarDireccion = (event:any, local:boolean, key?:string ) => {
    if(!key) return;
    
    let direccion = {id: "", calle: "", numero: "", departamento: "", localidad: "", aclaracion: "", esLocal: ""};
    if(local){
      direccionesLocales.forEach(e => { debugger; if(e.id === key){
        setDireccionEditar({id: e.id, calle: e.calle, numero: e.numero, departamento: e.departamento, localidad: e.localidad, aclaracion: e.notas, esLocal: e.esLocal});
      }})
    }else{
      direcciones.forEach(e => {if(e.id === key){
        setDireccionEditar({id: e.id, calle: e.calle, numero: e.numero, departamento: e.departamento, localidad: e.localidad, aclaracion: e.notas, esLocal: e.esLocal});
      }})
    }

    setIdDireccion(key);
    setIsModalOpen(true);
  }

  const borrarDireccion = (event:any, local:boolean, key:string ) => {
    console.log(key);
    CompradorService.borrarDireccion(token, key).then(res => {
      updateDirecciones();
    })
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setDireccionEditar({id: "", calle:"", numero: 0, departamento:"", localidad: "", aclaracion:"", esLocal: false});
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDireccionEditar({id: "", calle:"", numero: 0, departamento:"", localidad: "", aclaracion:"", esLocal: false});
  };

  useEffect(() => {
    getDirecciones();
  }, []);

  function onChangeDireccion(event:any, key:any) {
    setIdDireccion(key);
  }

  function onAddDirection() {
    if(addDirection){
      setAddDirection(false);
      setSiguienteVisible(true);
    }else{
      setAddDirection(true);
      setSiguienteVisible(false);
    }
    
  }

  function updateDirecciones (){
    handleClose();
    getDirecciones();
    onAddDirection();
    setAddDirection(false);
  }


  function onSeleccionarDireccion (){
    if(onSelectDirection != undefined) onSelectDirection(idDireccion);
  }


  function getDirecciones(){
    let direcciones: any = [];
    let locales: any = [];
    CompradorService.obtenerDirecciones(token).then(res => {
      res.forEach(direccion => {
        if(direccion.esLocal){
          locales.push(direccion);
        }else{
          direcciones.push(direccion);
        }
      });
      setDirecciones(direcciones);
      setDireccioneLocales(locales);
    })
  }

  document.body.style.backgroundColor = "#F0F0F0"
  return (
    <div className="centerDiv">
      <div className="directions-flex-div">
        <h3>Direcciones de envío</h3>
        <List
          itemLayout="horizontal"
          dataSource={direcciones}
          renderItem={(item) => (
            <List.Item actions={[<EditOutlined style={{fontSize: "20px"}} onClick={event => editarDireccion(event, false, item.id)} key={item.id}></EditOutlined>, <DeleteOutlined onClick={event => borrarDireccion(event, false, item.id)} key={item.id} style={{fontSize: "20px"}}/>]}> 
              {props.permiteSeleccion && <Checkbox checked={item.id === idDireccion} onChange={e => onChangeDireccion(e, item.id)} style={{margin:'20px'}}></Checkbox> } 
              <List.Item.Meta
                avatar={<EnvironmentOutlined /> }
                title={<a>{item.calle + " " + item.numero}</a>}
                description={item.localidad + ", " + item.departamento + " | " + item.notas}
              />
            </List.Item>
          )}
        />
        {(direccionesLocales.length != 0) && <div style={{marginTop:"20px"}}>
          <h3>Direcciones de locales</h3>
          <List
            itemLayout="horizontal"
            dataSource={direccionesLocales}
            renderItem={(item) => (
              <List.Item actions={[<EditOutlined style={{fontSize: "20px"}} onClick={event => editarDireccion(event,true, item.id)} key={item.id}></EditOutlined>, <DeleteOutlined onClick={event => borrarDireccion(event, false, item.id)} key={item.id} style={{fontSize: "20px"}}/>]}> 
                {props.permiteSeleccion && <Checkbox checked={item.id == idDireccion} onChange={e => onChangeDireccion(e, item.id)} style={{margin:'20px'}}></Checkbox> } 
                <List.Item.Meta
                  avatar={<EnvironmentOutlined /> }
                  title={<a>{item.calle + " " + item.numero}</a>}
                  description={item.localidad + ", " + item.departamento + " | " + item.notas}
                />
              </List.Item>
            )}
          />
        </div>}
        
        <Button style={{marginTop:"10px"}} type="ghost" onClick={onAddDirection}>Agregar dirección</Button>
        {props.permiteSeleccion && <Button style={{marginTop:"10px", display: siguienteVisible ? "block": "none"}} type="ghost" onClick={onSeleccionarDireccion}>Siguiente</Button>}

        <div style={{ margin: "20px"}}>
          {addDirection && <AddDirection editar={false} esVendedor={true} callBack={updateDirecciones}></AddDirection>}
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
