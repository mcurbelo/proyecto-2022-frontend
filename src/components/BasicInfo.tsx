import React, { Component, FC } from 'react';
import {UserService} from 'shopit-shared'
import '../main.css';

type basicinfo = {
  nombre: string,
  imagenPerfil: string
}

export const BasicInfo: FC<basicinfo> = (props) => 
    <div className="basicInfo">
      <div >
        <img className = "profilePic" alt='Avatar' src="https://xsgames.co/randomusers/avatar.php?g=male"></img>
      </div>
      <div className="nameWrapper">
        <h3 className="normal">{props.nombre}</h3>
      </div>
    </div>;