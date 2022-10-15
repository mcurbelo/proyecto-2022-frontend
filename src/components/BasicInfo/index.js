import React, { Component } from 'react';
import {UserService} from 'shopit-shared'
import './styles.css';
 function BasicInfo() {
  return(
    <div className="basicInfo">
      <div className="profilePic">
        <img src='https://joeschmoe.io/api/v1/random'></img>
      </div>
      <div className="nameWrapper">
        <h3 className="normal">Vitto</h3>
      </div>
    </div>
  );
}

export default BasicInfo;