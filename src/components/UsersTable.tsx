import { MoreOutlined } from "@ant-design/icons";
import { Button, Pagination, PaginationProps, Popover, Table } from "antd";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { DtUsuarioSlim } from "shopit-shared/dist/user/VendedorService";

type UsersTableProps = {
  users: DtUsuarioSlim[];
  totalUsers: number;
  onPageChange: (page: number) => void;
}

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width:"100%",
    padding: 15
  }
})


const UsersTable: React.FC<UsersTableProps> = (props) => {

  const onChange: PaginationProps['onChange'] = page => {
    console.log(page);
    props.onPageChange(page - 1)
  };
  
  const { users } = props;
  const styles = useStyles();
  return (
    <div>
      <div className={styles.wrapper}>
        <Table<DtUsuarioSlim>
          style={{width:"100%"}}
          bordered={true}
          dataSource={users}
          pagination={false}
          rowKey="id"
        >
          <Table.Column<DtUsuarioSlim>
            sorter={(a, b) => {
              if(a.correo > b.correo) return 1
              if(a.correo < b.correo) return -1
              return 0
            }}
            title="Correo"
            render={(_, data) => data.correo}
          />
          <Table.Column<DtUsuarioSlim>
            sorter={(a, b) => {
              if(a.nombre > b.nombre) return 1
              if(a.nombre < b.nombre) return -1
              return 0
            }}
            title="Nombre"
            render={(_, data) => data.nombre}
          />
          <Table.Column<DtUsuarioSlim>
            sorter={(a, b) => {
              if(a.apellido > b.apellido) return 1
              if(a.apellido < b.apellido) return -1
              return 0
            }}
            title="Apellido"
            render={(_, data) => <PopOver data={data} />}
          />
        </Table>

        <Pagination style={{paddingTop: 15}} defaultCurrent={1} total={props.totalUsers} onChange={onChange} pageSize={10}/>
      </div>
    </div>
  )
};

const PopOver: React.FC<{data: DtUsuarioSlim}> = (props) => {
  const {data} = props;
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {data.apellido}
      <Popover
        trigger="click"
        open={isOpen}
        content={
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button type="text" disabled={!(data.estadoUsuario != "Activo")}>Desbloquear</Button>
            <Button danger type="text" disabled={!(data.estadoUsuario == "Activo")}>Bloquear</Button>
          </div>
        }
        onOpenChange={(open) => setIsOpen(open)}
      >
        <MoreOutlined style={{ marginLeft: "auto" }} onClick={() => setIsOpen(true)} />
      </Popover>
    </div>
  )
}

export default UsersTable;