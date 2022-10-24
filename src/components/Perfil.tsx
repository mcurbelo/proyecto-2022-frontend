import React, {FC, useEffect, useState} from 'react'
import {BasicInfo} from './BasicInfo';
import {OtherInfo} from './OtherInfo';
import { UserService } from "shopit-shared";
import "../main.css"

const Perfil: FC<{}> = () => {
  const [infoUsuario, setInfoUsuario] = useState({
    apellido: "",
    correo: "",
    nombre: "",
    telefono: "",
    imagen: "https://xsgames.co/randomusers/avatar.php?g=male"
  });
  return (
    <div className="infoWrapper">
        <BasicInfo nombre={infoUsuario.nombre} imagenPerfil={infoUsuario.imagen} />
        <div className="otherinfocenter">
          <OtherInfo />
        </div>
    </div>
  )
}

export default Perfil