import React from 'react'
import BasicInfo from '../BasicInfo/BasicInfo'
import OtherInfo from '../OtherInfo/OtherInfo'
import "./Style.css"

function Perfil() {
  return (
    <div className="infoWrapper">
        <BasicInfo />
        <div className="otherinfocenter">
          <OtherInfo />
        </div>
    </div>
  )
}

export default Perfil