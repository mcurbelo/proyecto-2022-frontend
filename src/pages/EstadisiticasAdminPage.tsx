import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, Row, Tooltip } from "antd"
import { createUseStyles } from "react-jss";
import { EstReclamos } from "../components/EstReclamos";
import { EstUsuarios } from "../components/EstUsuarios";
import { EstVentasCompras } from "../components/EstVentasCompras";


const useStyles = createUseStyles({

    ContainerCollapse: {
        width: "60%"
    },

    '@media screen and (max-width: 740px)': {
        ContainerCollapse: {
            width: "95%"
        },
    }
})


const EstadisiticasVendedor = () => {
    const { Panel } = Collapse;
    const styles = useStyles();
    document.body.style.backgroundColor = "#F0F0F0"
    return (
        <div style={{ paddingBottom: "10%" }}>
            <h1 style={{ textAlign: "center" }}>Estadísticas referentes al sistema</h1>
            <Row justify="center" >
                <div className={styles.ContainerCollapse}>
                    <Collapse style={{ width: "100%" }}>
                        <Panel header={<span>Referente a usuarios
                            <Tooltip title="Muestra la cantidad de usuarios, clasificados por tipo y estado. Tambien permite conocer esta información según fecha de registro en un período de tiempo elegido, pudiendo conocer el estado actual de ese conjunto.">
                                <FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faQuestionCircle} /></Tooltip></span>} key="1" >
                            <EstUsuarios />
                        </Panel>
                        <Panel header={<span> Referente a ventas/compras
                            <Tooltip title="Muestra la cantidad de ventas/compras y clasificación por estado. Tambien permite conocer esta información en ventas/compras ocurridas en un período de tiempo elegido, pudiendo conocer el estado actual de ese conjunto.">
                                <FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faQuestionCircle} /></Tooltip></span>} key="2">
                            <EstVentasCompras />
                        </Panel>
                        <Panel header={<span> Referente a reclamos
                            <Tooltip title="Muestra todos los reclamos mostrando la cantidad por tipo y por resolución. Tambien permite conocer esta información en un período de tiempo elegido, pudiendo conocer el estado actual de ese conjunto.">
                                <FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faQuestionCircle} /></Tooltip></span>} key="3">
                            <EstReclamos />
                        </Panel>
                    </Collapse>
                </div>
            </Row>
        </div>
    )
}
export default EstadisiticasVendedor