import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, Row, Tooltip } from "antd"
import { createUseStyles } from "react-jss";
import { Balance } from "../components/EstVendedorBalance";
import { EstVendedorTop10Calificados } from "../components/EstVendedorTop10Calificados";
import { EstVendedorTop10Vendidos } from "../components/EstVendedorTop10Vendidos";


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
            <h1 style={{ textAlign: "center" }}>Estadísticas referentes a ventas</h1>
            <Row justify="center" >
                <div className={styles.ContainerCollapse}>
                    <Collapse defaultActiveKey={['1']} style={{ width: "100%" }}>
                        <Panel header={<span>Balance de ventas
                            <Tooltip title="Muestra las ganancias generadas teniendo en cuenta las ventas completadas.">
                                <FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faQuestionCircle} /></Tooltip></span>} key="1" >
                            <Balance />
                        </Panel>
                        <Panel header={<span> Top 10 productos más vendidos
                            <Tooltip title="Muestra los productos más vendido dentro teniendo en cuenta las ventas completadas.">
                                <FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faQuestionCircle} /></Tooltip></span>} key="2">
                            <EstVendedorTop10Vendidos />
                        </Panel>
                        <Panel header={<span> Top 10 productos que contienen mejores calificaciones
                            <Tooltip title="Muestra los productos que tienen en promedio mejor calificacion teniendo en cuenta las ventas completadas.">
                                <FontAwesomeIcon type="regular" style={{ marginLeft: "5px" }} icon={faQuestionCircle} /></Tooltip></span>} key="3">
                            <EstVendedorTop10Calificados />
                        </Panel>
                    </Collapse>
                </div>
            </Row>
        </div>
    )
}
export default EstadisiticasVendedor