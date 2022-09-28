import { SearchOutlined } from "@ant-design/icons";
import { Button, Image, Input } from "antd";
import { createUseStyles } from "react-jss";

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
  }
})

const MainHeader: React.FC<MainHeaderProps> = (props) => {
  const styles = useStyles()
  return (
    <div className={styles.wrapper}>
      <div className={styles.firstRow}>
        <div style={{ gridRow: 1, marginLeft: 24 }}>
          <Image
            className={styles.profileImage}
            src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80" />
        </div>

        <Input
          style={{ gridColumn: 2, textAlign: "center" }}
          className={styles.searchBar}
          placeholder="Buscar productos"
          suffix={<SearchOutlined />} />

        <Button
          type="primary"
          style={{ justifySelf: "end", gridColumn: 3, marginRight: 24 }}
        >Iniciar Sesion</Button>
      </div>
      <div className={styles.secondRow}>
        <div>Cat! </div>
        <div>Cat! </div>
      </div>
    </div>
  )
}

export default MainHeader;