import { useEffect, useMemo, useState } from 'react'
import { IonButtons, IonButton, IonCheckbox, IonIcon, IonItem, IonLabel, IonList, IonReorder, IonReorderGroup, IonSearchbar } from '@ionic/react'
import { createOutline, trash } from 'ionicons/icons'
import { useHistory, useParams } from 'react-router-dom'
import { List, TodoItem } from '../state/store'
import TodoInput from './TodoInput'
import ListTabs from './ListTabs'

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
  // delete control removed from tabs
}

export default function ListDetailScreen(props: ListDetailScreenProps) {
  const { id } = (useParams() as any) as { id?: string }
  const { lists, selectedListId, setSelectedListId, itemsByListId, addItem, toggleItem, editItem, deleteItem, setItemOrder } = props
  const history = useHistory()

  useEffect(() => {
    if (id && id !== selectedListId) setSelectedListId(id)
  }, [id, selectedListId])

  const list = lists.find((l) => l.id === id)
  const allItems = (id && itemsByListId[id]) || []
  const [query, setQuery] = useState('')
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allItems
    return allItems.filter((it) => it.text.toLowerCase().includes(q))
  }, [allItems, query])

  if (!list) return <div style={{ padding: '8px' }}>Fant ikke listen.</div>

  return (
    <div style={{ padding: '8px' }}>
      <ListTabs
        lists={lists}
        selectedListId={selectedListId}
        onSelect={(listId: string) => {
          setSelectedListId(listId)
          history.replace(`/lists/${listId}`)
        }}
      />
      <h2 style={{ margin: '8px 0' }}>{list.name}</h2>
      {list.description && <p style={{ marginTop: 0 }}>{list.description}</p>}
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 260 }}>
          <IonSearchbar
            value={query}
            placeholder="Søk i innslag"
            onIonInput={(e: any) => setQuery(String(e.detail.value ?? ''))}
            animated
            showClearButton="always"
            style={{ '--border-radius': '9999px' } as any}
          />
        </div>
      </div>
      <TodoInput onAdd={addItem} />
      <IonList>
        <IonReorderGroup
          disabled={query.trim().length > 0}
          onIonItemReorder={(e: any) => {
            const from = e.detail.from as number
            const to = e.detail.to as number
            const newItems = [...allItems]
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


