import { useEffect, useState } from "react";
import { AdministradorService } from "shopit-shared";
import { DtUsuarioSlim } from "shopit-shared/dist/user/VendedorService";
import UsersTable from "../components/UsersTable";

const UserList = () => {
  const [users, setUsers] = useState([] as DtUsuarioSlim[])
  const [currentPage, setCurrentPage] = useState("0")
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    let token = localStorage.getItem("token")!
    AdministradorService.listadoUsuarios(
      token,
      currentPage,
      "10"
    ).then((response) => {
      console.log(response)
      if (response.usuarios) {
        setUsers(response.usuarios)
        setTotalUsers(response.totalItems)
      }
    }).catch((error) => {
      console.log(error)
    })
  }, [currentPage])

  return (
    <UsersTable users={users} totalUsers={totalUsers} onPageChange={page => { setCurrentPage(page.toString()) }} />
  )
}

export default UserList;