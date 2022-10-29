import { faList, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Radio, RadioChangeEvent, Row, Typography } from "antd";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { Direccion } from "shopit-shared/dist/user/ProductoService";
import AddDirection from "./AddDirection";

type CompraDireccionProps = {
    onSelectDireccion: (id: string) => void,
    permiteEnvio: boolean
    onSelectEsEnvio: (opc: boolean) => void,
    direcciones: Direccion[]
}

const useStyles = createUseStyles({
    wrapper: {
        display: "flex",
        backgroundColor: "#f9f9f9",
        borderRadius: 4,
        borderColor: "#000000",
        borderWidth: 0.5,
        borderStyle: "solid",
        marginBottom: 16,
        padding: 8,
        alignItems: "center",
        "&:hover": {
            borderColor: "#1890ff",
            cursor: "pointer"
        }
    },
    cardData: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 12,
    }
})

export const CompraDireccion = (props: CompraDireccionProps) => {
    const styles = useStyles()
    const { onSelectDireccion } = props;
    const { onSelectEsEnvio } = props;
    const { direcciones } = props;
    const { permiteEnvio } = props
    const [mostrarLista, setMostrar] = useState(true);
    const [value, setValue] = useState(false);
    const [valueDireccion, setValueDireccion] = useState("");

    const onClick = () => {
        setMostrar(!mostrarLista)
    };

    const onChange = (e: RadioChangeEvent) => {
        onSelectEsEnvio(e.target.value)
        setValue(e.target.value)
        setValueDireccion("");
    };

    const onChangeDireccion = (e: RadioChangeEvent) => {
        onSelectDireccion(e.target.value)
        setValueDireccion(e.target.value)
    };

    const renderOpciones = () => {
        if (permiteEnvio) {
            return (
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={false}>En local</Radio>
                    <Radio value={true}>Por envío</Radio>
                </Radio.Group>

            )
        } else {
            return (
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={false}>En local</Radio>
                    <Radio value={true} disabled={true}>Por envío</Radio>
                </Radio.Group>
            )
        }
    }


    const renderDirecciones = () => {
        console.log(direcciones);
        if (mostrarLista) {
            return (
                <div style={{ width: "70%" }}>
                    <div>
                        <h1>Tipo de entrega:</h1>
                        {renderOpciones()}
                        <Row style={{ justifyContent: "center" }}>
                            <Radio.Group onChange={onChangeDireccion} value={valueDireccion}>
                                {
                                    direcciones.map(direccion => (<div className={styles.wrapper} key={direccion.id} onClick={() => onSelectDireccion(direccion.id.toString())}>
                                        <Radio value={direccion.id.toString()} onClick={() => onSelectDireccion(direccion.id.toString())} >
                                            <Typography>
                                                {direccion.calle + " " + direccion.numero + ". " + direccion.localidad + ", " + direccion.departamento}
                                            </Typography>
                                        </Radio>
                                    </div>))

                                }
                            </Radio.Group>
                        </Row>
                    </div>

                    <div>
                        <Button type="primary" onClick={onClick}>Agregar nueva dirección <FontAwesomeIcon style={{ marginLeft: "1%" }} icon={faLocationDot} /> </Button>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <AddDirection esVendedor={false} callBack={undefined} editar={false} />
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