import { faCoins, faSackDollar, faShop, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Checkbox, Col, DatePicker, Divider, Form, Radio, Row, Statistic } from "antd"
import { RangePickerProps } from "antd/lib/date-picker";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { VendedorService } from "shopit-shared";
import { DtBalance, EstVendedor } from "shopit-shared/dist/user/VendedorService";
import Button from 'antd-button-color';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import { SearchOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;


export const Balance = () => {
    const idUsuario = localStorage.getItem("uuid");
    const token = localStorage.getItem("token");
    const [form] = Form.useForm();
    const [eleccion, setEleccion] = useState({
        esHistorico: true,
        inicio: "",
        fin: ""
    })
    const [datos, setDatos] = useState<DtBalance>({
        cantidadPorEnvio: 0,
        cantidadPorRetiro: 0,
        ganadoPorEnvio: 0,
        ganadoPorRetiro: 0,
        totalGanado: 0,
        perdidoPorComision: 0
    })
    const [buscar, setBuscar] = useState(false);

    const onChangeRangePicker: RangePickerProps['onChange'] = (date, dateString) => {
        setEleccion({ inicio: dateString[0], fin: dateString[1], esHistorico: false })
    };

    useEffect(() => {
        busqueda()
    }, [])

    const busqueda = () => {
        setBuscar(true)
        VendedorService.estadisticasVenedor(idUsuario!, token!, EstVendedor.Balance, (eleccion.esHistorico) ? "" : eleccion.inicio, (eleccion.esHistorico) ? "" : eleccion.fin).then((response) => {
            if (response.balance) {
                setDatos(response.balance);
                setBuscar(false)
            }
        })
    }

    const COLORS = ['#E96E02', '#0F02AC'];
    const RADIAN = Math.PI / 180;

    const data = [
        { name: 'Por envío', value: datos.cantidadPorEnvio },
        { name: 'Por retiro', value: datos.cantidadPorRetiro }
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
            {(datos.totalGanado != 0) ?
                <Row gutter={16} justify="center">
                    <div>
                        <Card>
                            <h1>Cantidades por tipos de entrega</h1>
                            <ResponsiveContainer width={'95%'} height={400}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                            return (
                                                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        labelLine={false}>

                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>

                    <Card>
                        <Col >
                            <Statistic
                                title="Por envios"
                                value={datos.ganadoPorEnvio}
                                precision={2}
                                valueStyle={{ color: '#E96E02' }}
                                prefix="$"
                                suffix={<FontAwesomeIcon icon={faTruckFast} />}
                            />
                        </Col>
                        <Divider></Divider>
                        <Col >

                            <Statistic
                                title="Por retiros"
                                value={datos.ganadoPorRetiro}
                                precision={2}
                                valueStyle={{ color: '#0F02AC' }}
                                prefix="$"
                                suffix={<FontAwesomeIcon icon={faShop} />}
                            />
                        </Col>
                        <Divider></Divider>
                        <Col >
                            <Statistic
                                title="Comisión ShopNow"
                                value={datos.perdidoPorComision}
                                precision={2}
                                valueStyle={{ color: '#ff4d4f' }}
                                prefix="$ "
                                suffix={<FontAwesomeIcon icon={faCoins} />}
                            />
                        </Col>
                        <Divider />
                        <Col >
                            <Statistic
                                title="Total"
                                value={datos.totalGanado}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix="$"
                                suffix={<FontAwesomeIcon icon={faSackDollar} />}
                            />
                        </Col>
                    </Card>

                </Row>

                :
                <Row gutter={16} justify="center">
                    <Card bordered={false}>
                        <h2>No se encontraron ventas :(</h2>
                    </Card>
                </Row>

            }
        </div >
    )
}
