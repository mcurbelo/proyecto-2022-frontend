import { Card, Row } from "antd";
import { useEffect, useState } from "react";
import { AdministradorService } from "shopit-shared";
import { EstadoUsuario } from "shopit-shared/dist/user/AdministradorService";
import { DtUsuarioSlim } from "shopit-shared/dist/user/VendedorService";
import UsersTable from "../components/UsersTable";

const UserList = () => {
  const [users, setUsers] = useState([] as DtUsuarioSlim[])
  const [currentPage, setCurrentPage] = useState("0")
  const [reload, setReload] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let token = localStorage.getItem("token")!
    AdministradorService.listadoUsuarios(
      token,
      currentPage,
      "10"
    ).then((response) => {
      if (response.usuarios) {
        setUsers(response.usuarios)
        setTotalUsers(response.totalItems)
      }
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
    })
  }, [currentPage, reload])


  const buscar = (nombre: string, correo: string, estado: EstadoUsuario, campoOrden: string, orden: string) => {
    setIsLoading(true);
    let token = localStorage.getItem("token")!
    AdministradorService.listadoUsuarios(
      token,
      "0",
      "10",
      campoOrden,
      orden,
      { nombre: nombre, correo, estado: estado }
    ).then((response) => {
      if (response.usuarios) {
        setUsers(response.usuarios)
        setTotalUsers(response.totalItems)
      }
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
    })
  }

  return (
    <>
      <Row justify="center">
        <h1>Gestión de usuarios</h1>
      </Row>
      <Row justify="center">
        <UsersTable users={users} totalUsers={totalUsers} isLoading={isLoading}
          buscar={(nombre, correo, estado, campoOrden, orden) => { buscar(nombre, correo, estado, campoOrden, orden) }} onReload={() => { reload ? setReload(false) : setReload(true) }} onPageChange={page => { setCurrentPage(page.toString()) }} />
      </Row>
    </>
  )
}

export default UserList;