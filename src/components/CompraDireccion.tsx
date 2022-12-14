import { faLeftLong, faLocationDot, faShop, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Radio, RadioChangeEvent, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { DtCompra, DtDireccion } from "shopit-shared/dist/user/CompradorService";
import { Direccion } from "shopit-shared/dist/user/ProductoService";
import AddDirection from "./AddDirection";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import Button from "antd-button-color";
import { CompradorService } from "shopit-shared";

type CompraDireccionProps = {
    onSelectDireccion: (infoDireccion: Direccion | DtDireccion) => void,
    permiteEnvio: boolean
    onSelectEsEnvio: (opc: boolean) => void,
    direccionesVendedor: Direccion[]
    selecionPrevia: DtCompra
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
        },
    },
    cardData: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 12,
    },
    container: {
        width: "40%"
    },

    '@media screen and (max-width: 700px)': {
        container: {
            width: "auto"
        },
    }
})

export const CompraDireccion = (props: CompraDireccionProps) => {
    const styles = useStyles()
    const { onSelectDireccion } = props;
    const { onSelectEsEnvio } = props;
    const { selecionPrevia } = props;

    const { direccionesVendedor } = props;
    const { permiteEnvio } = props
    const [mostrarLista, setMostrar] = useState(true);
    const [esEnvio, SetEsEnvio] = useState(selecionPrevia.esParaEnvio);
    const [valueDireccion, setValueDireccion] = useState("");
    const [direccionesComprador, setDireccionComprador] = useState([] as DtDireccion[])
    const [actualizar, setActualizar] = useState(false);
    const onClick = () => {
        setMostrar(!mostrarLista)
        setActualizar(!actualizar)
    };
    const { Text } = Typography;

    const onChange = (e: RadioChangeEvent) => {
        onSelectEsEnvio(e.target.value)
        SetEsEnvio(e.target.value)
        setValueDireccion("");
    };

    const clickDiv = (direccion: Direccion | DtDireccion) => {
        onSelectDireccion(direccion)
        setValueDireccion(direccion.id!.toString())
    }

    const onChangeDireccion = (e: RadioChangeEvent) => {
        onSelectDireccion(e.target.value)
        setValueDireccion(e.target.value)
    };


    useEffect(() => {
        if (esEnvio) {
            let token = localStorage.getItem("token");
            CompradorService.obtenerDirecciones(token!).then((result) => {
                setDireccionComprador(result)
            })
            if (selecionPrevia.idDireccionEnvio !== -1) {
                setValueDireccion(selecionPrevia.idDireccionEnvio!.toString())
            }
        }


        if (!selecionPrevia.esParaEnvio && selecionPrevia.idDireccionLocal !== -1) {
            setValueDireccion(selecionPrevia.idDireccionLocal!.toString())
        }
    }, [esEnvio == true, actualizar])

    const renderOpciones = () => {
        if (permiteEnvio) {
            return (
                <Radio.Group onChange={onChange} value={esEnvio}>
                    <Radio value={false}>En local</Radio>
                    <Radio value={true}>Por env??o</Radio>
                </Radio.Group>

            )
        } else {
            return (
                <Radio.Group onChange={onChange} value={esEnvio}>
                    <Radio value={false} >En local</Radio>
                    <Radio value={true} disabled={true}>Por env??o</Radio>
                </Radio.Group>
            )
        }
    }

    const subtitulo = () => {
        if (esEnvio && direccionesComprador.length === 0)
            return ("No hay direcciones disponibles")
        else if (esEnvio && direccionesComprador.length !== 0)
            return ("Mis direcciones:")
        else
            return ("Locales:")
    }

    const renderDirecciones = () => {
        let direcciones;
        if (esEnvio)
            direcciones = direccionesComprador;
        else
            direcciones = direccionesVendedor

        if (direcciones.length > 0) {
            return (
                <>
                    <Row style={{ justifyContent: "center" }}>
                        <Radio.Group style={{ padding: 15, width: "100%" }} onChange={onChangeDireccion} value={valueDireccion}>
                            {
                                direcciones.map(direccion => (
                                    <div className={styles.wrapper} key={direccion.id} onClick={() => { clickDiv(direccion) }} >
                                        <Radio value={direccion.id!.toString()} onClick={() => onSelectDireccion(direccion)} >
                                            <div className={styles.cardData}>
                                                <Typography>
                                                    {<FontAwesomeIcon icon={(esEnvio) ? faLocationDot : faShop} style={{ display: "inline-block", marginRight: "5px" }} />}  {direccion.calle + " " + direccion.numero + ". " + direccion.localidad + ", " + direccion.departamento}
                                                </Typography>
                                            </div>
                                        </Radio>
                                    </div>
                                ))
                            }
                        </Radio.Group>
                    </Row>
                </>
            )
        }
    }

    const botonAdd = () => {
        if (esEnvio) {
            return (
                <div style={{ paddingLeft: "15px", display: "flex", justifyContent: (direccionesComprador.length === 0) ? "center" : "normal" }}>
                    <Button with="link" type="success" onClick={onClick}><b>Agregar direcci??n <FontAwesomeIcon icon={faSquarePlus} /></b></Button>
                </div>
            )
        }
    }

    const render = () => {
        if (mostrarLista) {
            return (
                <>
                    <div>
                        <h1>Tipo de entrega:</h1>
                        {renderOpciones()}
                        <h2 style={{ marginTop: "0.5rem" }}>{subtitulo()}</h2>
                        {botonAdd()}
                        {renderDirecciones()}
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div style={{ display: "flex", cursor: "pointer" }} onClick={onClick}>
                        <Text> <FontAwesomeIcon icon={faLeftLong} /> Volver a la lista</Text>
                    </div>
                    <AddDirection esVendedor={false} callBack={onClick} editar={false} />
                </>
            )
        }
    }


    return (
        <Row style={{ justifyContent: "center" }}>
            <div className={styles.container}>
                {render()}
            </div>
        </Row>
    );
}
export default CompraDireccion;