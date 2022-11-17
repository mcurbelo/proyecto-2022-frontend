import { MoreOutlined } from "@ant-design/icons";
import { Button, Pagination, PaginationProps, Popover, Table, Modal, Input, message, Spin, Row, Select } from "antd";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { AdministradorService } from "shopit-shared";
import { EstadoUsuario } from "shopit-shared/dist/user/AdministradorService";
import { DtUsuarioSlim } from "shopit-shared/dist/user/VendedorService";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

type UsersTableProps = {
  users: DtUsuarioSlim[];
  totalUsers: number;
  onPageChange: (page: number) => void;
  onReload: () => void;
  buscar: (nombre: string, correo: string, estado: EstadoUsuario, campoOrden: string, orden: string) => void;
}

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    padding: 15
  },
  filtroUsuarios: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width:"40%",
    marginBottom: "2%"
  },
  sort: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    width:"40%",
    marginBottom: "2%"
  }
})


const UsersTable: React.FC<UsersTableProps> = (props) => {
  const {Option} = Select;
  const [nombrefiltro, setnombrefiltro] = useState("");
  const [correo, setCorreo] = useState("");
  const [estado, setEstado] = useState(EstadoUsuario.Activo);
  const [campoOrden, setCampoOrden] = useState("");
  const [orden, setOrden] = useState("desc");

  const onChange: PaginationProps['onChange'] = page => {
    console.log(page);
    props.onPageChange(page - 1)
  };

  const reload = () => {
    props.onReload();
  };

  
  const buscar = () => {
      props.buscar(nombrefiltro, correo, estado, campoOrden, orden);
  }

  const { users } = props;
  const styles = useStyles();
  return (
    <div style={{width:"80%"}}>
      <div className={styles.wrapper}>
        <div className={styles.filtroUsuarios}>
          <Input style={{marginLeft:"5px"}} placeholder="Buscar por nombre y apellido" value={nombrefiltro} onChange={(evt) => {setnombrefiltro(evt.target.value)}}></Input>
          <Input style={{marginLeft:"5px"}} placeholder="Correo" value={correo} onChange={(evt) => {setCorreo(evt.target.value)}}></Input>
          <Select style={{marginLeft:"5px"}} defaultValue={EstadoUsuario.Activo} onChange={(valor) => { setEstado(valor)}}>
            <Option value={EstadoUsuario.Activo}>Activo</Option>
            <Option value={EstadoUsuario.Eliminado}>Eliminado</Option>
            <Option value={EstadoUsuario.Bloqueado}>Bloqueado</Option>
          </Select>
          <Button style={{marginLeft:"10px"}} type="primary" onClick={buscar}>Buscar</Button>
        </div>
        <div className={styles.sort}>
          <div>
            <label>Ordenar por:</label>
            <Select style={{marginLeft:"5px"}} defaultValue="Nombre" onChange={(valor) => { setCampoOrden(valor)}}>
              <Option value="nombre">Nombre</Option>
              <Option value="apellido">Apellido</Option>
              <Option value="correo">Correo</Option>
            </Select>
          </div>
          <div style={{marginLeft: "5px"}}>
            <label>Orden</label>
            <Select style={{marginLeft:"5px"}} defaultValue="desc" onChange={(valor) => { setOrden(valor)}}>
              <Option value="desc">Descendiente</Option>
              <Option value="asc">Ascendiente</Option>
            </Select>
          </div>
          
        </div>
        <Table<DtUsuarioSlim>
          style={{ width: "100%" }}
          bordered={true}
          dataSource={users}
          pagination={false}
          rowKey="id"
        >
          <Table.Column<DtUsuarioSlim>
            sorter={(a, b) => {
              if (a.correo > b.correo) return 1
              if (a.correo < b.correo) return -1
              return 0
            }}
            title="Correo"
            render={(_, data) => data.correo}
          />
          <Table.Column<DtUsuarioSlim>
            sorter={(a, b) => {
              if (a.nombre > b.nombre) return 1
              if (a.nombre < b.nombre) return -1
              return 0
            }}
            title="Nombre"
            render={(_, data) => data.nombre}
          />
          <Table.Column<DtUsuarioSlim>
            sorter={(a, b) => {
              if (a.correo > b.correo) return 1
              if (a.correo < b.correo) return -1
              return 0
            }}
            title="Estado"
            render={(_, data) => data.estadoUsuario}
          />
          <Table.Column<DtUsuarioSlim>
            sorter={(a, b) => {
              if (a.apellido > b.apellido) return 1
              if (a.apellido < b.apellido) return -1
              return 0
            }}
            title="Apellido"
            render={(_, data) => <PopOver data={data} reloadFunction={reload} />}
          />
        </Table>


        <Pagination style={{ display: 'flex', justifyContent: 'center', marginTop: '3%' }} defaultCurrent={1} total={props.totalUsers} onChange={onChange} pageSize={10} />
      </div>
    </div>
  )
};

const PopOver: React.FC<{ data: DtUsuarioSlim, reloadFunction: () => void }> = (props) => {
  const { data, reloadFunction } = props;
  const [isOpen, setIsOpen] = useState(false)
  const [modalBloqueoOpen, isModalBloqueoOpen] = useState(false);
  const [modalEliminarCuenta, isModalEliminarCuentaOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const { TextArea } = Input;

  const onBloquear = () => {
    setIsOpen(false);
    isModalBloqueoOpen(true);
  }

  const onEliminar = () => {
    setIsOpen(false);
    isModalEliminarCuentaOpen(true);
  }

  const acceptBlock = (id: string, motivo: string) => {
    setLoading(true);
    isModalBloqueoOpen(false);
    console.log("id: " + id + "motivo: " + motivo);
    let token: string = localStorage.getItem("token") as string;
    AdministradorService.cambiarEstadoUsuario(id, token, { motivo: motivo }, EstadoUsuario.Bloqueado).then((res) => {
      message.success("Usuario bloqueado con exito");
      setLoading(false);
      reloadFunction();
    })
  }

  const cerrarModal = () => {
    isModalBloqueoOpen(false);
    isModalEliminarCuentaOpen(false);
  }

  const onDesbloquear = (id: string) => {
    setIsOpen(false);
    let token: string = localStorage.getItem("token") as string;
    AdministradorService.cambiarEstadoUsuario(id, token, { motivo: "Desbloqueo" }, EstadoUsuario.Activo).then((res) => {
      message.success("Usuario desbloqueado con éxito");
      isModalBloqueoOpen(false);
      reloadFunction();
    })
  }

  const loadMotivo = (e: any) => {
    console.log(e.target.value);
    setMotivo(e.target.value);
  }

  const eliminarCuenta = (id: string, motivo: string) => {
    isModalEliminarCuentaOpen(false);
    confirmAlert({
      title: 'Confirmacion acción',
      message: 'Esta seguro que desea eliminar el usuario?',
      buttons: [
        {
          label: 'Si',
          onClick: () => {
            let token: string = localStorage.getItem("token") as string;
            AdministradorService.cambiarEstadoUsuario(id, token, { motivo: motivo }, EstadoUsuario.Eliminado).then((res) => {
              message.success("Usuario eliminado con exito");
              reloadFunction();
            })
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });




  }


  return (
 
      <Spin spinning={loading}>
        <div style={{ display: "flex", flexDirection: "row" }}>

          {data.apellido}

          <Popover
            trigger="click"
            open={isOpen}
            content={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button type="text" disabled={!(data.estadoUsuario != "Activo")} onClick={() => onDesbloquear(data.id)}>Desbloquear</Button>
                <Button danger type="text" disabled={!(data.estadoUsuario == "Activo")} onClick={() => onBloquear()}>Bloquear</Button>
                <Button danger type="text" onClick={() => onEliminar()}>Eliminar cuenta</Button>
              </div>
            }
            onOpenChange={(open) => setIsOpen(open)}
          >
            <MoreOutlined style={{ marginLeft: "auto" }} onClick={() => setIsOpen(true)} />
          </Popover>

          <Modal title="Bloquear Usuario" open={modalBloqueoOpen} onOk={() => acceptBlock(data.id, motivo)} onCancel={cerrarModal}>
            <TextArea rows={4} placeholder="Ingrese un motivo" onChange={(e) => loadMotivo(e)} />
          </Modal>

          <Modal title="Eliminar Cuenta" open={modalEliminarCuenta} onOk={() => eliminarCuenta(data.id, motivo)} onCancel={cerrarModal}>
            <TextArea rows={4} placeholder="Ingrese un motivo" onChange={(e) => loadMotivo(e)} />
          </Modal>
        </div>
      </Spin>
  )
}

export default UsersTable;