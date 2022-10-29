import { faCreditCard, faList, faLocationDot, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { render } from "@testing-library/react";
import { Button, Row } from "antd";
import React, { MouseEventHandler, useState } from "react";
import AddCard from "./AddCard";
import CardList from "./CardList";
import CreditCard from "./CreditCard";
import { Directions } from "./Directions";

export const CompraDireccion = () => {
    const [direccionId, setTarjetaId] = useState("");
    const [mostrarLista, setMostrar] = useState(true);

    const onClick = () => {
        setMostrar(!mostrarLista)
    };

    const renderDirecciones = () => {
        if (mostrarLista) {
            return (
                <div style={{ width: "70%" }}>
                    <Directions />
                    <Button type="primary" onClick={onClick}>Agregar nueva direccion <FontAwesomeIcon style={{ marginLeft: "1%" }} icon={faLocationDot} /> </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button type="primary" onClick={onClick}>Volver a la lista <FontAwesomeIcon style={{ marginLeft: "1%" }} icon={faList} /> </Button>
                </div>
            )
        }
    }


    return (
        <Row style={{ justifyContent: "center" }}>
            {renderDirecciones()}
        </Row>
    );
}
export default CompraDireccion;