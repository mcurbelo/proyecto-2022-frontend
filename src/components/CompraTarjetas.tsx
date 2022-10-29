import { faCreditCard, faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { render } from "@testing-library/react";
import { Button, Row } from "antd";
import React, { MouseEventHandler, useState } from "react";
import AddCard from "./AddCard";
import AddDirection from "./AddDirection";
import CardList from "./CardList";
import CreditCard from "./CreditCard";

type CompraTarjetaProps = {
    onSelectCard: (id: string) => void
}

export const CompraTarjeta = (props: CompraTarjetaProps) => {
    const { onSelectCard } = props;
    const [tarjetaId, setTarjetaId] = useState("");
    const [mostrarLista, setMostrar] = useState(true)

    const onClick = () => {
        setMostrar(!mostrarLista)
    };

    const renderTarjetas = () => {
        if (mostrarLista) {
            return (
                <div style={{ width: "70%" }}>
                    <CardList onSelectCard={(id) => { if (id !== null) onSelectCard(id) }} />
                    <div>
                        <Button type="primary" onClick={onClick}>Agregar otra tarjeta...  <FontAwesomeIcon icon={faCreditCard} /></Button>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <AddCard onCardAdd={() => { setMostrar(true) }} />
                    <Button type="primary" onClick={onClick}>Volver a la lista <FontAwesomeIcon style={{ marginLeft: "1%" }} icon={faList} /> </Button>
                </div>
            )
        }
    }


    return (
        <>
            <Row style={{ justifyContent: "center" }}>
                {renderTarjetas()}
            </Row>
        </>
    );
}
export default CompraTarjeta;