import { Select } from "antd";
import { useEffect, useState } from "react";
import { CategoriaService } from "shopit-shared"
import { DtCategoria } from "shopit-shared/dist/user/CategoriaService";

type PickerCategoriaState = {
  categorias: DtCategoria[]
}
type PickerCategoriaProps = {
  onSelect : (categoria: string[]) => void
}
const PickerCategoria: React.FC<PickerCategoriaProps> = (props) => {
  const [state, setState] = useState({ categorias: [] } as PickerCategoriaState)
  useEffect(() => {
    CategoriaService.listarCategorias().then(result => {
      setState({ categorias: result })
    })
  }, [])
  return (
    <div>
      {state.categorias.length && 
      <Select
        onChange={event => props.onSelect(event)}
        mode="multiple"
        style={{width: "100%"}}
      >
        {state.categorias.map((item) => {
          return (<Select.Option key={item.nombre}>{item.nombre}</Select.Option>)
        })}
      </Select>}
    </div>
  )
}

export default PickerCategoria;