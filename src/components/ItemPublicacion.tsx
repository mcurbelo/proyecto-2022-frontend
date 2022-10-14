import { Col, Card } from 'antd';


type itemPublicacionProps = {
    titulo: string;
    descripcion: string;
    precio: number;
    imagen: string;
  };

export const ItemPublicacion = (itemProps: itemPublicacionProps) => {
    const { Meta } = Card;
    return (
        <Col span={5}>
          <Card
          hoverable
          style={{ width: '100%', height: '450px'}}
          cover={<img alt='' src={itemProps.imagen} />}>
            <Meta style={{position: "absolute", bottom: 20,left: 20}} title={itemProps.titulo} description={itemProps.descripcion} />
          </Card>
      </Col>
    )
};
