import React, {useState} from "react";
import { List, Avatar, Button, Checkbox, message } from "antd";
import { EnvironmentOutlined, EditOutlined } from "@ant-design/icons";
import AddDirection from "./AddDirection";




interface DirectionsProps {
  permiteSeleccion ?: boolean;
  esVendedor?:boolean;
}

const data = [
  {
    title: "Direccion 1",
    description:
      "Montevideo - Punta Carretas Vittorio Montini - 092861710",
    key: "dir1"
  },
  {
    title: "Direccion 2",
    description:
      "Canelones - Canelones Vittorio Montini - 092 861710",
    key: "dir2"
  },
  {
    title: "Direccion 3",
    description:
      "Montevideo - Punta Carretas Vittorio Montini - 092861710",
    key: "dir3"
  },
];

function editarDireccion(event:any, key:any) {
  console.log(key);
}

export const Directions: React.FC<DirectionsProps> = (props) => {

  const [value, setValue] = useState("");
  const [addDirection, setAddDirection] = useState(false);
  const [direcciones, setDirecciones] = useState(data);

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
    message.success('Direccion agregada con exito');
  }

  return (
    <div className="centerDiv">
      <div className="directions-flex-div">
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
        <Button style={{marginTop:"10px"}} type="ghost" onClick={onAddDirection}>Agregar Direccion</Button>

        <div style={{ margin: "20px"}}>
          {addDirection && <AddDirection esVendedor={true} callBack={updateDirecciones}></AddDirection>}
        </div>  
      </div>
    </div>
  );
};
