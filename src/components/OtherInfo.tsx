import { FC, useState, useEffect , useRef} from 'react';
import Icon, { EditOutlined } from '@ant-design/icons';
import { Button, Select, Form, Input, Rate, Tooltip} from 'antd';
import { createUseStyles } from "react-jss"
import '../main.css';
import { UserService } from "shopit-shared";

const { Option } = Select;


export const OtherInfo: FC<{}> = (props) => {
  const [esVendedor, setEsVendedor] = useState(false);
  let uuid: string = (localStorage.getItem("uuid") as string);
  let datos = {};
  const [infoUsuario, setInfoUsuario] = useState({uuid: uuid, apellido: "", correo: "", nombre: "", telefono: "", calificacion: 0});

  const [datosVendedor, setDatosVendedor] = useState({
      nombreEmpresa: "",
      rut: "",
      telefonoEmpresa: "",
      estadoSolicitud: "",
      calificacion: 0
  })
  const [imagen, setImagen] = useState("")
  const [verBtnContinuar, setContinuar] = useState("none");
  const [editando, setEditando] = useState(false);
  //const [datos, setDatos] =  useState(props);

  let onEdit = function (event:any): void {
    setContinuar("block");
  };


  const loadInfoUser = () =>{
    let uuid: string = (localStorage.getItem("uuid") as string);
    UserService.obtenerInformacion(uuid)
      .then((infoUsuario) => {  
        if(infoUsuario.datosVendedor != null){
          setEsVendedor(true);
          setDatosVendedor({
            nombreEmpresa: infoUsuario.datosVendedor.nombreEmpresa,
            rut: infoUsuario.datosVendedor.rut,
            telefonoEmpresa: infoUsuario.datosVendedor.telefonoEmpresa,
            estadoSolicitud: infoUsuario.datosVendedor.estadoSolicitud,
            calificacion: infoUsuario.datosVendedor.calificacion
          })
        }
          setInfoUsuario({
            uuid: uuid,
            apellido: (infoUsuario.apellido as string ), 
            correo: (infoUsuario.correo as string), 
            nombre: (infoUsuario.nombre as string),
            telefono: (infoUsuario.telefono as string),
            calificacion: (infoUsuario.calificacion as number)})
            setImagen(infoUsuario.imagen as string);

          })
      .catch((error) => console.log("Ocurrio un error al obtener la informacion del usuario"));
  
  }


  const onAcceptEdit = () => {

    let body = {
      uuid: uuid, 
      apellido: infoUsuario.apellido, 
      correo: infoUsuario.correo, 
      nombre: infoUsuario.nombre, 
      telefono: infoUsuario.telefono,
      imagen: {
        data: imagen
      }
    }

    UserService.updateUser(body)
      .then((infoUsuario) => {  console.log("Editado con exito")})
      .catch((error) => console.log("Ocurrio un error al obtener la informacion del usuario"));
  }

  const onInputchange = (e: any) => {
    setInfoUsuario( prevState => ({
          ...prevState,  
          [e.target.name]: e.target.value
      }
  ));
  }


  useEffect(() => {
    loadInfoUser();
  }, []);
  
  return (
    <div className='otherinfocolumn'>
      <div style={{marginBottom: "50px"}}>
        <div style={{display: "flex", justifyContent: 'space-between', marginBottom: 10}}>
          <h3 style={{marginBottom: "5px"}}>Informacion basica</h3>
          <Button style={{ fontSize: "25px", justifyContent: 'center', display:'flex', border: 0 }} onClick={onEdit}>
            <EditOutlined onClick={onEdit}/>
          </Button>
        </div>
        
        <div className="wrapper">
          <div className='leftValues'>
            <div>
              <label>Nombre:</label>
              <input name='nombre' type="text" className="usuarioInput" defaultValue={infoUsuario.nombre} onChange={(e) => onInputchange(e)}/>
            </div>
            <div>
              <label>Telefono:</label>
              <input name='telefono' type="text" className="usuarioInput" defaultValue={infoUsuario.telefono} onChange={(e) => onInputchange(e)}/>
            </div>

            <div>
              <Tooltip title="Calificacion obtenida de los vendedores ">
              <div>
                <label>Calificacion:</label>
                <Form.Item>
                  <Rate value={infoUsuario.calificacion} />
                </Form.Item>
              </div>
            </Tooltip>
            </div>
            
          </div>
          
          <div className='rigthValues'>
            <div>
              <label>Apellido:</label>
              <input name='apellido' type="text" className="usuarioInput" defaultValue={infoUsuario.apellido} onChange={(e) => onInputchange(e)}/>
            </div>
            <div>
              <label>Correo:</label>
              <input name='correo' type="text" className="usuarioInput" defaultValue={infoUsuario.correo} onChange={(e) => onInputchange(e)}/>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button style={{display: verBtnContinuar}} type='primary' onClick={onAcceptEdit}> Modificar</Button>
            </div>
          </div>
          
        </div>

        <div className="wrapper" style={esVendedor ? {display: "grid"} : {display: "none"}}>
            <div className='middleValues'>
              <h3>Informacion vendedor</h3>
            </div>
          
          <div className='leftValues'>
            <div>
              <label>Nombre tienda:</label>
              <input name='nomTienda' type="text" className="usuarioInput" defaultValue={datosVendedor.nombreEmpresa} onChange={(e) => onInputchange(e)}/>
            </div>
            <div>
              <label>Telefono:</label>
              <input name='telVendedor' type="text" className="usuarioInput" defaultValue={datosVendedor.telefonoEmpresa} onChange={(e) => onInputchange(e)}/>
            </div>
          </div>
          <div className='rigthValues'>
            <div>
              <label>RUT:</label>
              <input name='rut' type="text" className="usuarioInput" defaultValue={datosVendedor.rut} onChange={(e) => onInputchange(e)}/>
            </div>
            <div>
            <Tooltip title="Calificacion obtenida de los compradores">
              <div>
                <label>Calificacion:</label>
                <Form.Item>
                  <Rate value={datosVendedor.calificacion} />
                </Form.Item>
              </div>
            </Tooltip>
            </div>
          </div>

        </div>
      </div>
    </div>
    
  );
}
export default OtherInfo;

