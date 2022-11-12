import { useEffect, useState } from "react";
import { AdministradorService } from "shopit-shared";
import { DtUsuarioSlim } from "shopit-shared/dist/user/VendedorService";
import UsersTable from "../components/UsersTable";

const UserList = () => {
  const [users, setUsers] = useState([] as DtUsuarioSlim[])
  const [currentPage, setCurrentPage] = useState("0")
  const [reload, setReload] = useState(false);
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
  }, [currentPage, reload])

  return (
    <UsersTable users={users} totalUsers={totalUsers} onReload={() => {reload ? setReload(false) : setReload(true)}} onPageChange={page => { debugger; setCurrentPage(page.toString()) }} />
  )
}

export default UserList;