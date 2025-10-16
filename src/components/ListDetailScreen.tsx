import { useEffect, useMemo } from 'react'
import { IonButtons, IonButton, IonCheckbox, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react'
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
}

export default function ListDetailScreen(props: ListDetailScreenProps) {
  const { id } = useParams<{ id: string }>()
  const { lists, selectedListId, setSelectedListId, itemsByListId, addItem, toggleItem, editItem, deleteItem } = props

  useEffect(() => {
    if (id && id !== selectedListId) setSelectedListId(id)
  }, [id, selectedListId])

  const list = lists.find((l) => l.id === id)
  const items = (id && itemsByListId[id]) || []
  const [pending, done] = useMemo(() => {
    const p: TodoItem[] = []
    const d: TodoItem[] = []
    for (const it of items) {
      if (it.done) d.push(it)
      else p.push(it)
    }
    return [p, d]
  }, [items])

  if (!list) return <div style={{ padding: '8px' }}>Fant ikke listen.</div>

  return (
    <div style={{ padding: '8px' }}>
      <h2 style={{ margin: '8px 0' }}>{list.name}</h2>
      {list.description && <p style={{ marginTop: 0 }}>{list.description}</p>}
      <TodoInput onAdd={addItem} />
      <IonList>
        {pending.map((it) => (
          <IonItem key={it.id}>
            <IonCheckbox checked={it.done} onIonChange={() => toggleItem(it.id)} slot="start" />
            <IonLabel style={{ textDecoration: it.done ? 'line-through' : 'none', color: it.done ? '#6b7280' : undefined, opacity: it.done ? 0.7 : 1 }}>
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
      </IonList>
      <IonList>
        {done.map((it) => (
          <IonItem key={it.id} color="light">
            <IonCheckbox checked={it.done} onIonChange={() => toggleItem(it.id)} slot="start" />
            <IonLabel style={{ textDecoration: 'line-through', color: '#6b7280', opacity: 0.7 }}>
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
      </IonList>
    </div>
  )
}


