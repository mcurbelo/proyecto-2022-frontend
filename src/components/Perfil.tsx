import React, {FC, useEffect, useState} from 'react'
import {BasicInfo} from './BasicInfo';
import {OtherInfo} from './OtherInfo';
import { UserService } from "shopit-shared";
import "../main.css"


const Perfil: FC<{}> = () => {
  const [infoUsuario, setInfoUsuario] = useState({ apellido: "", correo: "", nombre: "", telefono: "", imagen: "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png"});

  const loadInfoUser = () =>{
    let uuid: string = (localStorage.getItem("uuid") as string);
    UserService.obtenerInformacion(uuid)
      .then((infoUsuario) => {  
          setInfoUsuario({
            apellido: (infoUsuario.apellido as string ), 
            correo: (infoUsuario.correo as string), 
            nombre: (infoUsuario.nombre as string),
            telefono: (infoUsuario.telefono as string), 
            imagen: (infoUsuario.imagen as string) })

            debugger;
          })
      .catch((error) => console.log("Ocurrio un error al obtener la informacion del usuario"));
  
  }


  useEffect(() => {
    loadInfoUser();
  }, []);

  return (
    <div className="infoWrapper">
        <BasicInfo nombre={infoUsuario.nombre} imagenPerfil={infoUsuario.imagen} />
        <div className="otherinfocenter">
          <OtherInfo nombre={infoUsuario.nombre} apellido={infoUsuario.apellido} correo={infoUsuario.correo} imagen={infoUsuario.imagen} telefono={infoUsuario.telefono}/>
        </div>
    </div>
  )
}

export default Perfil