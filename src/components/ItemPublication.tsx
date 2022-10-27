import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleFilled } from '@ant-design/icons';
import { Card, Button, Typography } from 'antd';
import { DtProductoSlim } from 'shopit-shared/dist/user/VendedorService';

interface Props {
  producto: DtProductoSlim
}
const { Meta } = Card;
const { Text } = Typography;

export const ItemPublication = ({ producto }: Props) => {
  return (
    <Card
      key={producto.idProducto}
      hoverable
      bodyStyle={{ padding: "5%" }}
      cover={<img alt='' src={producto.imagen} />} actions={[<Button type="primary" id={producto.idProducto} style={{ width: '90%' }} icon={<InfoCircleFilled />} >
        Ver detalles
      </Button>]}>
      <Meta title={producto.nombre} style={{ whiteSpace: "pre-line" }} />
      <div className="additional" style={{ marginTop: "10%" }}>
        <Text >{"$" + producto.precio}</Text>
        <br></br>
        <Text>Permite envío {(producto.permiteEnvio) ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />}</Text>
      </div>
    </Card>
  )
};
