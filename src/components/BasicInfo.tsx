import React, { Component, FC } from 'react';
import {UserService} from 'shopit-shared'
import '../main.css';

type basicinfo = {
  nombre: string,
  imagenPerfil: string
}

export const BasicInfo: FC<basicinfo> = (props) => 
    <div className="basicInfo">
      <div className="profilePic">
        <img alt='' src={props.imagenPerfil}></img>
      </div>
      <div className="nameWrapper">
        <h3 className="normal">{props.nombre}</h3>
      </div>
    </div>;