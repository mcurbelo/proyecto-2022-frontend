import { faCirclePlus, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Typography } from "antd";
import { useEffect, useState } from "react";
import AddCard from "./AddCard";
import CardList, { CreditCardData } from "./CardList";
import Button from "antd-button-color";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { createUseStyles } from "react-jss";


const useStyles = createUseStyles({
    container: {
        width: "50%"
    },

    '@media screen and (max-width: 700px)': {
        container: {
            width: "auto"
        },
    }
})

type CompraTarjetaProps = {
    onSelectCard: (id: string) => void
    idSeleccionPrevia: string;
    infoCard: (id: CreditCardData) => void
}

export const CompraTarjeta = (props: CompraTarjetaProps) => {
    const styles = useStyles()
    const { idSeleccionPrevia } = props
    const { onSelectCard } = props;
    const { infoCard } = props
    const [mostrarLista, setMostrar] = useState(true)
    const { Text } = Typography;
    const onClick = () => {
        setMostrar(!mostrarLista)
    };

    useEffect(() => {
    }, [])


    const renderTarjetas = () => {
        if (mostrarLista) {
            return (
                <>
                    <h1>Mis tarjetas:</h1>
                    <div style={{ paddingLeft: "15px", display: "flex" }}>
                        <Button with="link" type="success" onClick={onClick}><b>Agregar tarjeta <FontAwesomeIcon icon={faCirclePlus} style={{ display: "inline-block", marginLeft: "5px" }} /></b></Button>
                    </div>
                    <CardList onSelectCard={(id) => { if (id !== null) onSelectCard(id) }} selectedCard={idSeleccionPrevia} onSelectedCardInfo={(card) => { infoCard(card) }} />
                </>
            )
        } else {
            return (
                <>
                    <div style={{ display: "flex", cursor: "pointer" }} onClick={onClick}>
                        <Text> <FontAwesomeIcon icon={faLeftLong} /> Volver a la lista</Text>
                    </div>
                    <AddCard onCardAdd={() => { setMostrar(true) }} />
                </>
            )
        }
    }


    return (
        <>
            <Row style={{ justifyContent: "center" }}>
                <div className={styles.container}>
                    {renderTarjetas()}
                </div>
            </Row>
        </>
    );
}
export default CompraTarjeta;