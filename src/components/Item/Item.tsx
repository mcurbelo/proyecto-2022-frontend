import React from 'react'
import './Style.css'

export default function Item() {
  return (
    <div className="item">
        <div className="content" onClick={()=>{
          //browserHistory.push('/item/123');
        }} />
      </div>
  )
}
