import Button from "antd-button-color";
import { useEffect, useState } from "react";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { createUseStyles } from "react-jss";
import { Card, Row, Typography } from "antd";
import { faCirclePlus, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCard from "../components/AddCard";
import CardList from "../components/CardList";

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



export const TarjetasPage = () => {
    const styles = useStyles()
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
                    <h1 style={{ textAlign: "center" }}>Mis tarjetas:</h1>
                    <div style={{ paddingLeft: "15px", display: "flex" }}>
                        <Button with="link" type="success" onClick={onClick}><b>Agregar tarjeta <FontAwesomeIcon icon={faCirclePlus} style={{ display: "inline-block", marginLeft: "5px" }} /></b></Button>
                    </div>
                    <CardList />
                </>
            )
        } else {
            return (
                <>
                    <div style={{ display: "flex", cursor: "pointer" }} onClick={onClick}>
                        <Text> <FontAwesomeIcon icon={faLeftLong} />Volver a la lista</Text>
                    </div>
                    <AddCard onCardAdd={() => { setMostrar(true) }} />
                </>
            )
        }
    }

    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <Row style={{ justifyContent: "center" }}>
            <Card className={styles.container}>
                {renderTarjetas()}
            </Card>
        </Row>


    );
}
export default TarjetasPage;