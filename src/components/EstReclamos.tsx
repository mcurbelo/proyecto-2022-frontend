import { faBagShopping, faBullhorn, faCheck, faCircleCheck, faCircleXmark, faClock, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, DatePicker, Divider, Form, Radio, Row, Statistic } from "antd"
import { RangePickerProps } from "antd/lib/date-picker";
import { useEffect, useState } from "react";
import { ResponsiveContainer, Tooltip, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { AdministradorService } from "shopit-shared";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { SearchOutlined } from "@ant-design/icons";
import { EstAdm, ReclamosEst, VentasEst } from "shopit-shared/dist/user/AdministradorService";

const { RangePicker } = DatePicker;


export const EstReclamos = () => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [eleccion, setEleccion] = useState({
        esHistorico: true,
        inicio: "",
        fin: ""
    })
    const [datos, setDatos] = useState<ReclamosEst>()
    const [buscar, setBuscar] = useState(false);

    const onChangeRangePicker: RangePickerProps['onChange'] = (date, dateString) => {
        setEleccion({ inicio: dateString[0], fin: dateString[1], esHistorico: false })
    };

    useEffect(() => {
        busqueda()
    }, [])

    const busqueda = () => {
        setBuscar(true)
        AdministradorService.estadisticasAdm(token!, EstAdm.Reclamos, (eleccion.esHistorico) ? "" : eleccion.inicio, (eleccion.esHistorico) ? "" : eleccion.fin).then((response) => {
            if (response.reclamos) {
                setDatos(response.reclamos);
                setBuscar(false)
            }
        })
    }

    const reclamosTipo = [
        { nombre: "Desperfecto", Cantidad: datos?.tipoDesperfecto, fill: "#880E4F " },
        { nombre: "Repetición", Cantidad: datos?.tipoRepeticion, fill: "#4A148C" },
        { nombre: "No recibido", Cantidad: datos?.tipoProductoNoRecibo, fill: "#311B92" },
        { nombre: "Producto erroneo", Cantidad: datos?.tipoProductoNoRecibo, fill: "#01579B" },
        { nombre: "Otro", Cantidad: datos?.tipoOtro, fill: "#006064 " },
    ]

    const reclamosResolucion = [
        { nombre: "No resueltos", Cantidad: datos?.noResueltos, fill: "#cf1322" },
        { nombre: "Por chat", Cantidad: datos?.resueltosChat, fill: "#389e0d" },
        { nombre: "Por devolución", Cantidad: datos?.resueltosDevolucion, fill: "#d46b08" },
    ]


    return (
        <div>
            <Row justify="center">
                <Card >
                    <Row justify="center">
                        <Radio.Group value={eleccion.esHistorico} onChange={(e) => setEleccion({ ...eleccion, esHistorico: e.target.value })} >
                            <Radio value={true} >
                                <h3>Historico</h3>
                            </Radio>
                            <Radio value={false} >
                                <h3>Por rango</h3>
                            </Radio>
                        </Radio.Group>
                    </Row>
                    <Form name="rango"
                        form={form}
                        onFinish={busqueda}>
                        <Row justify="center">
                            <Form.Item name="rango" rules={[{ required: !eleccion.esHistorico, message: "El rango de fecha es obligatorio" }]}>
                                <RangePicker id="rango" disabled={eleccion.esHistorico} format={"DD/MM/YYYY"} placeholder={["Inicio", "Fin"]} onChange={onChangeRangePicker} />
                            </Form.Item>
                        </Row>
                        <Divider></Divider>
                        <Row justify="center">
                            <Form.Item >
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={buscar}>Buscar</Button>
                            </Form.Item>
                        </Row>

                    </Form>
                </Card>
            </Row >
            {(datos) && (datos!.muestra != 0) ?
                <div style={{ marginTop: "10px" }}>
                    <Card>
                        <Row justify="space-around">
                            <Statistic
                                title="Muestra / Total"
                                value={datos.muestra}
                                suffix={<><span>/ {datos.total}</span> <FontAwesomeIcon icon={faBullhorn} /></>}
                            />
                        </Row>
                        <Divider />
                        <Row gutter={16} justify="center" style={{ marginTop: "10px" }}>
                            <h1 style={{ textAlign: "center" }}>Cantidad por cada tipo de reclamo</h1>
                            <ResponsiveContainer width={'95%'} height={400}>
                                <BarChart
                                    width={500}
                                    height={600}
                                    data={reclamosTipo}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        bottom: 20,
                                        left: 20
                                    }}
                                >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <YAxis type="number" allowDecimals={false} tickLine={false} />
                                    <XAxis dataKey="nombre" type="category" allowDataOverflow tickLine={false} />
                                    <Tooltip cursor={false} />
                                    <Bar dataKey="Cantidad" barSize={20} fill="#413ea0" />
                                </BarChart>

                            </ResponsiveContainer>
                        </Row>

                        <Row gutter={16} justify="center" style={{ marginTop: "10px" }}>
                            <h1 style={{ textAlign: "center" }}>Cantidad por cada resolución de reclamo</h1>
                            <ResponsiveContainer width={'95%'} height={400}>
                                <BarChart
                                    width={500}
                                    height={600}
                                    data={reclamosResolucion}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        bottom: 20,
                                        left: 20
                                    }}
                                >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <YAxis type="number" allowDecimals={false} tickLine={false} />
                                    <XAxis dataKey="nombre" type="category" allowDataOverflow tickLine={false} />
                                    <Tooltip cursor={false} />
                                    <Bar dataKey="Cantidad" barSize={20} fill="#413ea0" />
                                </BarChart>

                            </ResponsiveContainer>
                        </Row>
                    </Card>
                </div>
                :
                <Row gutter={16} justify="center">
                    <Card bordered={false}>
                        <h2>No se encontraron datos :(</h2>
                    </Card>
                </Row>

            }
        </div >
    )
}
