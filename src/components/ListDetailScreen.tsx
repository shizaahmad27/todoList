import { useEffect } from 'react'
import { IonButtons, IonButton, IonCheckbox, IonIcon, IonItem, IonLabel, IonList, IonReorder, IonReorderGroup } from '@ionic/react'
import { createOutline, trash } from 'ionicons/icons'
import { useParams } from 'react-router-dom'
import { List, TodoItem } from '../state/store'
import TodoInput from './TodoInput'

export type ListDetailScreenProps = {
  lists: List[]
  selectedListId: string | null
  setSelectedListId: (id: string) => void
  itemsByListId: Record<string, TodoItem[]>
  addItem: (text: string) => void
  toggleItem: (id: string) => void
  editItem: (id: string, newText: string) => void
  deleteItem: (id: string) => void
  setItemOrder: (items: TodoItem[]) => void
}

export default function ListDetailScreen(props: ListDetailScreenProps) {
  const { id } = (useParams() as any) as { id?: string }
  const { lists, selectedListId, setSelectedListId, itemsByListId, addItem, toggleItem, editItem, deleteItem, setItemOrder } = props

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
        <IonReorderGroup
          disabled={false}
          onIonItemReorder={(e: any) => {
            const from = e.detail.from as number
            const to = e.detail.to as number
            const newItems = [...items]
            const [moved] = newItems.splice(from, 1)
            newItems.splice(to, 0, moved)
            setItemOrder(newItems)
            e.detail.complete(true)
          }}
        >
          {items.map((it: TodoItem) => (
            <IonItem key={it.id} color={it.done ? 'light' : undefined} className="item-animated-move">
              <IonReorder slot="start" />
              <IonCheckbox checked={it.done} onIonChange={() => toggleItem(it.id)} />
              <IonLabel style={{ marginLeft: 8, textDecoration: it.done ? 'line-through' : 'none', color: it.done ? '#6b7280' : undefined, opacity: it.done ? 0.7 : 1 }}>
                {it.text}
              </IonLabel>
              <IonButtons slot="end">
                <IonButton
                  onClick={async () => {
                    const newText = prompt('Rediger tekst', it.text) || ''
                    if (newText.trim()) editItem(it.id, newText)
                  }}
                >
                  <IonIcon icon={createOutline} />
                </IonButton>
                <IonButton color="danger" onClick={() => deleteItem(it.id)}>
                  <IonIcon icon={trash} />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonReorderGroup>
      </IonList>
      
    </div>
  )
}


