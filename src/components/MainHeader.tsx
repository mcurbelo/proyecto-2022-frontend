import { SearchOutlined } from "@ant-design/icons";
import { Button, Image, Input, Dropdown, Avatar, Menu } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useMitt } from "react-mitt";
import { useNavigate } from "react-router";
import { CategoriaService } from "shopit-shared";
import { DtCategoria } from "shopit-shared/dist/user/CategoriaService";
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
          <Button type="text"
            onClick={(_) => {
              localStorage.removeItem("token")
              localStorage.removeItem("uuid")
              window.location.reload()
            }}
          >
          {/* <a target="_blank" rel="noopener noreferrer" href="/logout"> */}
            Cerrar sesion
          {/* </a> */}
          </Button>
        ),
      }
    ]}
  />
);



const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const { emitter } = useMitt()
  const styles = useStyles()
  const [categorias, setCategorias] = useState<DtCategoria[]>([])
  const [sesionIniciada, setSesionIniciada] = useState(false)

  const buscarProducto = (value: string) => {
    emitter.emit('busquedaProducto', { data: value });
  };

  const buscarCategoria = (event: React.MouseEvent<HTMLButtonElement>) => {
    emitter.emit('busquedaCategoria', { data: event.currentTarget.value.toString() });
  };

  const obtenerCategorias = () => {
    CategoriaService.listarCategorias().then((result) => {
      if (result) {
        setCategorias(result);
      }
    })
  }

  useEffect(() => {
    obtenerCategorias();
    let token = localStorage.getItem("token")
    if(token) setSesionIniciada(true)
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.firstRow}>
        <div style={{ gridRow: 1, marginLeft: 24 }}>
          <Image
            preview={false}
            className={styles.profileImage}
            src={logo} />
        </div>
        <Search

          placeholder="Buscar productos"
          onSearch={buscarProducto}
        />

        {sesionIniciada ?
          <Dropdown overlay={menu} placement="bottomLeft" >
            <Avatar size="large" src="https://xsgames.co/randomusers/avatar.php?g=male" style={{ justifySelf: "end", gridColumn: 3, marginRight: 24 }} />
          </Dropdown> :

          <Button
            onClick={(_) => {
              window.location.href = "/signin"
            }}
            type="primary"
            style={{ justifySelf: "end", gridColumn: 3, marginRight: 24 }}>Iniciar Sesion</Button>
        }
      </div>
      <div className={styles.secondRow}>
        <div className={styles.categoryContainer}>
          {
            categorias.map((categoria, index) => {
              return (
                <Button type="text" style={{ gridColumn: index + 1 }} key={index} value={categoria.toString()} onClick={buscarCategoria}>{categoria.toString()}</Button>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default MainHeader;