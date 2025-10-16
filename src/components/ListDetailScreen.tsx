import { useEffect } from 'react'
import { IonItem, IonLabel, IonList } from '@ionic/react'
import { useParams } from 'react-router-dom'
import { List, TodoItem } from '../state/store'
import TodoInput from './TodoInput'

export default function ListDetailScreen(props: {
  lists: List[]
  selectedListId: string | null
  setSelectedListId: (id: string) => void
  itemsByListId: Record<string, TodoItem[]>
  addItem: (text: string) => void
  toggleItem: (id: string) => void
}) {
  const { id } = useParams<{ id: string }>()
  const { lists, selectedListId, setSelectedListId, itemsByListId, addItem, toggleItem } = props

  useEffect(() => {
    if (id && id !== selectedListId) setSelectedListId(id)
  }, [id, selectedListId])

  const list = lists.find((l) => l.id === id)
  const items = (id && itemsByListId[id]) || []

  if (!list) return <div style={{ padding: '8px' }}>Fant ikke listen.</div>

  return (
    <div style={{ padding: '8px' }}>
      <h2 style={{ margin: '8px 0' }}>{list.name}</h2>
      {list.description && <p style={{ marginTop: 0 }}>{list.description}</p>}
      <TodoInput onAdd={addItem} />
      <IonList>
        {items.map((it) => (
          <IonItem key={it.id} button onClick={() => toggleItem(it.id)}>
            <IonLabel>{it.text}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  )
}


