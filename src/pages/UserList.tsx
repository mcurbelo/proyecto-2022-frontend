import UsersTable from "../components/UsersTable";
import { User } from "../types";

const dummyData: User[] = [
  {
    name: "Mauro",
    lastName: "Curbelo",
    ci: "5.162.728-9",
    blocked: false
  },
  {
    name: "Vittorio",
    lastName: "Montini",
    ci: "1.234.567-8",
    blocked: true
  },
  {
    name: "Tito",
    lastName: "Flores",
    ci: "2.344.567-8",
    blocked: false
  },
  {
    name: "Nicolas",
    lastName: "Sposito",
    ci: "3.456.789-0",
    blocked: true
  },
  {
    name: "Gerardo",
    lastName: "Admitoquenose",
    ci: "6.789.123-4",
    blocked: false
  }
]

const UserList = () => {
  return (
    <UsersTable users={dummyData} />
  )
}

export default UserList;