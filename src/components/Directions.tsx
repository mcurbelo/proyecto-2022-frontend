import React, {useState,useEffect} from "react";
import { List, Avatar, Button, Checkbox, message, Modal } from "antd";
import { EnvironmentOutlined, EditOutlined } from "@ant-design/icons";
import AddDirection from "./AddDirection";
import { CompradorService } from "shopit-shared";



const token : string =  localStorage.getItem("token") as string;

interface DirectionsProps {
  permiteSeleccion ?: boolean;
  esVendedor?:boolean;
}

let direccionesSinFormatear: Array<any> = [];

export const Directions: React.FC<DirectionsProps> = (props) => {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState("");
  const [idDireccion, setIdDireccion] = useState("");
  const [direccionEditar, setDireccionEditar] = useState({id: "", calle:"", numero: 0, departamento:"", localidad: "", aclaracion:"", esLocal: false});
  const [addDirection, setAddDirection] = useState(false);
  const [direcciones, setDirecciones] = useState([{title:"", description: "", key: ""}]);
  

  const [direccionesLocales, setDireccioneLocales] = useState([{title:"", description: "", key: ""}]);
  

  const editarDireccion = (event:any, key:string) => {
    //Tengo que arreglar esto
    let direccion = {id: "", calle: "", numero: "", departamento: "", localidad: "", aclaracion: "", esLocal: ""};
    direccionesSinFormatear.forEach(e => { if(e.id === key){
      setDireccionEditar({id: e.id, calle: e.calle, numero: e.numero, departamento: e.departamento, localidad: e.localidad, aclaracion: e.notas, esLocal: e.esLocal});
    }})
    
    setIdDireccion(key);
    setIsModalOpen(true);
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

  function onSelectDirection(event:any, key:any) {
    setValue(key);
  }

  function onAddDirection() {
    if(addDirection){
      setAddDirection(false);
    }else{
      setAddDirection(true);
    }
    
  }

  function updateDirecciones (values: any){
    handleClose();
    getDirecciones();
  }


  function getDirecciones(){
    let data: any = [];
    let locales: any = [];
    CompradorService.obtenerDirecciones(token).then(res => {
      let i = 1;
      direccionesSinFormatear = res;
      res.forEach(direccion => {
        let val = {
          title: direccion.calle + " " + direccion.numero,
          description:
            direccion.localidad + " ," + direccion.departamento + " | " + direccion.notas,
          key: direccion.id
        }
        data.push(val);
        //Datos de los locales
        if(direccion.locales != null){
          direccion.locales.forEach(local => {
            let val = {
              title: local.calle + " " + local.numero,
              description:
              local.localidad + " ," + local.departamento + " | " + local.notas,
              key: direccion.id
            }
            locales.push(val);
          })
          setDireccioneLocales(locales);
        }
        i++;
      });
      setDirecciones(data);
      //setDirecciones(data);
    })
  }


  return (
    <div className="centerDiv">
      <div className="directions-flex-div">
        <h3>Direcciones de envio</h3>
        <List
          itemLayout="horizontal"
          dataSource={direcciones}
          renderItem={(item) => (
            <List.Item actions={[<EditOutlined style={{fontSize: "20px"}} onClick={event => editarDireccion(event, item.key)} key={item.key}></EditOutlined>]}> 
              {props.permiteSeleccion && <Checkbox checked={item.key == value} onChange={e => onSelectDirection(e, item.key)} style={{margin:'20px'}}></Checkbox> } 
              <List.Item.Meta
                avatar={<EnvironmentOutlined />}
                title={<a>{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
        {direccionesLocales[0].title != "" && <div style={{marginTop:"20px"}}>
          <h3>Direcciones de locales</h3>
          <List
            itemLayout="horizontal"
            dataSource={direccionesLocales}
            renderItem={(item) => (
              <List.Item actions={[<EditOutlined style={{fontSize: "20px"}} onClick={event => editarDireccion(event, item.key)} key={item.key}></EditOutlined>]}> 
                {props.permiteSeleccion && <Checkbox checked={item.key == value} onChange={e => onSelectDirection(e, item.key)} style={{margin:'20px'}}></Checkbox> } 
                <List.Item.Meta
                  avatar={<EnvironmentOutlined />}
                  title={<a>{item.title}</a>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </div>}
        
        <Button style={{marginTop:"10px"}} type="ghost" onClick={onAddDirection}>Agregar Direccion</Button>

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
