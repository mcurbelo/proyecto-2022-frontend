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
  const [value, setValue] = useState();
  const [idDireccion, setIdDireccion] = useState("");
  const [direccionEditar, setDireccionEditar] = useState({id: "", calle:"", numero: 0, departamento:"", localidad: "", aclaracion:"", esLocal: false});
  const [addDirection, setAddDirection] = useState(false);
  //const [direcciones, setDirecciones] = useState([{title:"", description: "", key: ""}]);

  const [direcciones, setDirecciones] = useState([{
    id: "", 
    calle: "", 
    numero: 0, 
    departamento: "", 
    localidad: "", 
    notas: "",
    esLocal: false}]);

    const [direccionesLocales, setDireccioneLocales] = useState([{
      id: "", 
      calle: "", 
      numero: 0, 
      departamento: "", 
      localidad: "", 
      notas: "",
      esLocal: false}]);
  

  const editarDireccion = (event:any, key:string) => {
    //Tengo que arreglar esto
    let direccion = {id: "", calle: "", numero: "", departamento: "", localidad: "", aclaracion: "", esLocal: ""};
    direcciones.forEach(e => { debugger; if(e.id === key){
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
      direccionesSinFormatear = res;
      res.forEach(direccion => {
        // let val = {
        //   title: direccion.calle + " " + direccion.numero,
        //   description:
        //     direccion.localidad + " ," + direccion.departamento + " | " + direccion.notas,
        //   key: direccion.id
        data.push(direccion);
        //Datos de los locales
        if(direccion.locales != null){
          locales = direccion.locales.map(local => {return local});
          setDireccioneLocales(locales);
        }
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
            <List.Item actions={[<EditOutlined style={{fontSize: "20px"}} onClick={event => editarDireccion(event, item.id)} key={item.id}></EditOutlined>]}> 
              {props.permiteSeleccion && <Checkbox checked={item.id === value} onChange={e => onSelectDirection(e, item.id)} style={{margin:'20px'}}></Checkbox> } 
              <List.Item.Meta
                avatar={<EnvironmentOutlined />}
                title={<a>{item.calle + " " + item.numero}</a>}
                description={item.localidad + " ," + item.departamento + " | " + item.notas}
              />
            </List.Item>
          )}
        />
        {direccionesLocales[0].calle != "" && <div style={{marginTop:"20px"}}>
          <h3>Direcciones de locales</h3>
          <List
            itemLayout="horizontal"
            dataSource={direccionesLocales}
            renderItem={(item) => (
              <List.Item actions={[<EditOutlined style={{fontSize: "20px"}} onClick={event => editarDireccion(event, item.id)} key={item.id}></EditOutlined>]}> 
                {props.permiteSeleccion && <Checkbox checked={item.id == value} onChange={e => onSelectDirection(e, item.id)} style={{margin:'20px'}}></Checkbox> } 
                <List.Item.Meta
                  avatar={<EnvironmentOutlined />}
                  title={<a>{item.calle + " " + item.numero}</a>}
                  description={item.localidad + " ," + item.departamento + " | " + item.notas}
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
