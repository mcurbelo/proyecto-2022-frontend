import { InfoCircleFilled, TagsOutlined } from '@ant-design/icons';
import { Col, Card, Button } from 'antd';
import { DtProductoSlim } from 'shopit-shared/dist/user/VendedorService';

interface Props {
  producto: DtProductoSlim
}
const { Meta } = Card;

export const ItemPublication = ({ producto }: Props) => {
  return (
    <Col span={5}>
      <Card
        key={producto.idProducto}
        hoverable
        style={{ width: '100%'}}
        cover={<img alt='' src={producto.imagen} />} actions={[<Button type="primary" shape="round" style={{width:'90%'}} icon={<InfoCircleFilled />} >
          Ver detalles
        </Button>]}>
        <Meta title={producto.nombre} description={"Precio: $" + producto.precio} />
      </Card>
    </Col>
  )
};
