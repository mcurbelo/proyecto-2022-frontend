import { Descriptions, Row } from "antd"
import { createUseStyles } from "react-jss"
import { DtCompra } from "shopit-shared/dist/user/CompradorService"
import { DtProducto } from "shopit-shared/dist/user/ProductoService"
import { CreditCardData } from "./CardList"

type InfoProp = {
    producto: DtProducto,
    compra: DtCompra,
    infoTarjeta: CreditCardData
    direccion: string
}

const useStyles = createUseStyles({
    container: {
        width: "55%"
    },

    '@media screen and (max-width: 800px)': {
        container: {
            width: "auto"
        },
    }
})


export const CompraFinal = (prop: InfoProp) => {
    const styles = useStyles()
    const { producto } = prop;
    const { compra } = prop
    const { infoTarjeta } = prop
    const { direccion } = prop

    return (
        <div style={{marginBottom:"20px"}}>
            <h1>A punto de terminar...</h1>
            <Row style={{ justifyContent: "center" }}>
                <Descriptions className={styles.container} title="Resumen de la compra:" bordered column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="Producto:">{producto.nombre}</Descriptions.Item>
                    <Descriptions.Item label="Vendedor:">{producto.nombreVendedor}</Descriptions.Item>
                    <Descriptions.Item label="Cantidad:">{compra.cantidad} {(compra.cantidad === 1) ? "unidad" : "unidades"}</Descriptions.Item>
                    <Descriptions.Item label="Precio total:"> ${compra.cantidad * producto.precio}</Descriptions.Item>
                    <Descriptions.Item label="Forma de pago:"><b>&#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022; &#x2022;&#x2022;&#x2022;&#x2022;</b> {infoTarjeta.last4} - Expiración: {infoTarjeta.expiration}</Descriptions.Item>
                    <Descriptions.Item label="Entrega:">{(compra.esParaEnvio) ? "Por envío." : "Retiro en local."}</Descriptions.Item>
                    <Descriptions.Item label="Dirección:">{direccion}</Descriptions.Item>
                </Descriptions>
            </Row>
        </div>
    )

}
export default CompraFinal;
