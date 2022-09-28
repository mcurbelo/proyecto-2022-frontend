import { MoreOutlined } from "@ant-design/icons";
import { Button, Popover, Table } from "antd";
import { useState } from "react";
import { createUseStyles } from "react-jss";
import { User } from "../types";

type UsersTableProps = {
  users: User[];
}

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    justifyContent: "center",
  }
})


const UsersTable: React.FC<UsersTableProps> = (props) => {
  
  const { users } = props;
  const styles = useStyles();
  return (
    <div>
      <div className={styles.wrapper}>
        <Table<User>
          style={{ width: "50%" }}
          bordered={true}
          dataSource={users}
          pagination={false}
          rowKey="ci"
        >
          <Table.Column<User>
            title="CI"
            render={(_, data) => data.ci}
          />
          <Table.Column<User>
            title="Nombre"
            render={(_, data) => data.name}
          />
          <Table.Column<User>
            title="Apellido"
            render={(_, data) => <PopOver data={data} />}
          />
        </Table>
      </div>
    </div>
  )
};

const PopOver: React.FC<{data: User}> = (props) => {
  const {data} = props;
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {data.lastName}
      <Popover
        trigger="click"
        open={isOpen}
        content={
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button type="text" disabled={data.blocked}>Desbloquear</Button>
            <Button danger type="text" disabled={!data.blocked}>Bloquear</Button>
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