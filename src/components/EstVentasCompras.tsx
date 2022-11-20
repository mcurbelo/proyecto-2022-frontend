import { faBagShopping, faCheck, faCircleCheck, faCircleXmark, faClock, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, DatePicker, Divider, Form, Radio, Row, Statistic } from "antd"
import { RangePickerProps } from "antd/lib/date-picker";
import { useEffect, useState } from "react";
import { ResponsiveContainer, Tooltip, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar } from 'recharts';
import { AdministradorService } from "shopit-shared";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { SearchOutlined } from "@ant-design/icons";
import { EstAdm, VentasEst } from "shopit-shared/dist/user/AdministradorService";

const { RangePicker } = DatePicker;


export const EstVentasCompras = () => {
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [eleccion, setEleccion] = useState({
        esHistorico: true,
        inicio: "",
        fin: ""
    })
    const [datos, setDatos] = useState<VentasEst>()
    const [buscar, setBuscar] = useState(false);

    const onChangeRangePicker: RangePickerProps['onChange'] = (date, dateString) => {
        setEleccion({ inicio: dateString[0], fin: dateString[1], esHistorico: false })
    };

    useEffect(() => {
        busqueda()
    }, [])

    const busqueda = () => {
        setBuscar(true)
        AdministradorService.estadisticasAdm(token!, EstAdm.Ventas, (eleccion.esHistorico) ? "" : eleccion.inicio, (eleccion.esHistorico) ? "" : eleccion.fin).then((response) => {
            if (response.ventas) {
                setDatos(response.ventas);
                setBuscar(false)
            }
        })
    }



    const data = [
        {
            subject: 'Pendientes',
            Compras: datos?.pendientes,
            fullMark: datos?.total,
        },
        {
            subject: 'Confirmadas',
            Compras: datos?.aceptadas,
            fullMark: datos?.total,
        },
        {
            subject: 'Canceladas',
            Compras: datos?.canceladas,
            fullMark: datos?.total,
        },
        {
            subject: 'Completadas',
            Compras: datos?.completadas,
            fullMark: datos?.total,
        },
        {
            subject: 'Reembolsadas',
            Compras: datos?.reembolsadas,
            fullMark: datos?.total,
        },

    ];

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
                                title="Pendientes"
                                value={datos.pendientes}
                                valueStyle={{ color: '#04143b' }}
                                suffix={<FontAwesomeIcon icon={faClock} />}
                            />
                            <Statistic
                                title="Confirmadas"
                                value={datos.aceptadas}
                                valueStyle={{ color: '#389e0d' }}
                                suffix={<FontAwesomeIcon icon={faCheck} />}
                            />
                            <Statistic
                                title="Canceladas"
                                value={datos.canceladas}
                                valueStyle={{ color: '#cf1322' }}
                                suffix={<FontAwesomeIcon icon={faCircleXmark} />}
                            />
                            <Statistic
                                title="Completadas"
                                value={datos.completadas}
                                valueStyle={{ color: '#389e0d' }}
                                suffix={<FontAwesomeIcon icon={faCircleCheck} />}
                            />
                            <Statistic
                                title="Reembolsadas"
                                value={datos.reembolsadas}
                                valueStyle={{ color: '#d46b08' }}
                                suffix={<FontAwesomeIcon icon={faMoneyBillTransfer} />}
                            />

                            <Divider ></Divider>
                            <Row justify="space-around">

                                <Statistic
                                    title="Muestra / Total"
                                    value={datos.muestra}
                                    suffix={<><span>/ {datos.total}</span> <FontAwesomeIcon icon={faBagShopping} /></>}
                                />
                            </Row>
                        </Row>

                        <Divider />
                        <Row gutter={16} justify="center" style={{ marginTop: "10px" }}>
                            <h1 style={{ textAlign: "center" }}>Radar de compra/ventas</h1>
                            <ResponsiveContainer width={'95%'} height={400}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis />
                                    <Radar dataKey="Compras" stroke="#2d77f5" fill="#2d77f5" fillOpacity={0.6} />
                                    <Tooltip></Tooltip>
                                </RadarChart>

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
