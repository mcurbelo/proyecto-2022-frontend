import { SearchOutlined } from "@ant-design/icons";
import { Button, Image, Input, Dropdown, Avatar, Menu } from "antd";
import React from "react";
import { createUseStyles } from "react-jss";
import { useMitt } from "react-mitt";
import logo from "./../images/logo192.png"
type MainHeaderProps = {}


const useStyles = createUseStyles({
  wrapper: {
    display: "grid",
    background: "#FFFFA7",
    height: 100,
    gridTemplateRows: "1fr 1fr 1fr "
  },
  firstRow: {
    gridRow: "1 / span 2",
    display: "grid",
    marginTop: "auto",
    gridTemplateColumns: "1fr 1fr 1fr",
  },
  secondRow: {
    gridRow: "3",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto"
  },
  profileImage: {
    borderRadius: "50%",
    height: 50,
    width: 50
  },
  searchBar: {
    height: 32,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center"
  },
  categoryContainer: {
    width: "50%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
  },
  categoryButton: {
    "&:hover": {
      cursor: "pointer"
    }
  }
})


const menu = (
  <Menu
    items={[
      {
        key: '1',
        label: (
          <a rel="noopener noreferrer" href="/profile">
            Ver perfil
          </a>
        ),
      },
      {
        key: '2',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="/logout">
            Cerrar sesion
          </a>
        ),
      }
    ]}
  />
);



const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const { emitter } = useMitt()
  const styles = useStyles()
  const sesionIniciada = true;

  const buscarProducto = (event: React.MouseEvent<HTMLButtonElement>) => {
    emitter.emit('busquedaCategoria', {data: "ESAAAAAA"})
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.firstRow}>
        <div style={{ gridRow: 1, marginLeft: 24 }}>
          <Image
            preview={false}
            className={styles.profileImage}
            src={logo} />
        </div>
        <Input
          style={{ gridColumn: 2, textAlign: "center" }}
          className={styles.searchBar}
          placeholder="Buscar productos"
          suffix={<SearchOutlined />}
        />

        {sesionIniciada ?
          <Dropdown overlay={menu} placement="bottomLeft" >
            <Avatar size="large" src="https://xsgames.co/randomusers/avatar.php?g=male" style={{ justifySelf: "end", gridColumn: 3, marginRight: 24 }} />
          </Dropdown> :

          <Button
            type="primary"
            style={{ justifySelf: "end", gridColumn: 3, marginRight: 24 }}>Iniciar Sesion</Button>
        }
      </div>
      <div className={styles.secondRow}>
        <div className={styles.categoryContainer}>
          <Button type="text" style={{ gridColumn: 1 }} onClick={buscarProducto}>Categoría 1</Button>
          <Button type="text" style={{ gridColumn: 2 }} >Categoría 2</Button>
          <Button type="text" style={{ gridColumn: 3 }} >Categoría 3</Button>
          <Button type="text" style={{ gridColumn: 4 }} >Categoría 4</Button>
          <Button type="text" style={{ gridColumn: 5 }} >Categoría 5</Button>
        </div>
      </div>
    </div>
  )
}

export default MainHeader;