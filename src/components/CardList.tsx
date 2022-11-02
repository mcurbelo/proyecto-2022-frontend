import { Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { CardService } from "shopit-shared";
import CreditCard from "./CreditCard";

export type CreditCardData = {
  id: string;
  last4: string;
  expiration: string;
  imageUrl: string;
  selected: boolean;
}
type CardListState = {
  cards: CreditCardData[];
}

type CardListProps = {
  onSelectCard: (id: string) => void
  selectedCard?: string
  onSelectedCardInfo?: (card: CreditCardData) => void,
}

const CardList: React.FC<CardListProps> = (props) => {
  const { onSelectCard } = props;
  const [state, setState] = useState({ cards: [] } as CardListState)
  const { selectedCard } = props
  const { onSelectedCardInfo } = props
  useEffect(() => {
    let uuid = localStorage.getItem("uuid");
    let token = localStorage.getItem("token");
    CardService.fetchTarjetas({
      uuid: uuid!,
      token: token!
    }).then(response => setState({ cards: (response.data as CreditCardData[]) }))
  }, [])

  const selectCard = (id: string) => {
    if (state.cards.some(card => card.id == id && card.selected)) return; // Card didn't change

    state.cards.forEach(card => card.selected = false)
    let card = state.cards.find(card => card.id == id)
    if (onSelectedCardInfo) onSelectedCardInfo(card!)
    if (card) card.selected = true
    setState({ cards: state.cards })
    onSelectCard(id)

  }

  return (
    <div style={{ padding: 15 }}>
      {state.cards.map(card => <CreditCard
        onCardSelected={selectCard}
        checked={(card.id === selectedCard) ? true : card.selected}
        key={card.id}
        id={card.id}
        last4={card.last4}
        expiration={card.expiration}
        imageUrl={card.imageUrl} />
      )}
    </div>
  )
}

export default CardList;