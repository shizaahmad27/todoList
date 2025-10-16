import { useEffect, useMemo, useState } from 'react'
import { IonButtons, IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/react'
import { BrowserRouter as Router, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { chevronBack } from 'ionicons/icons'
import HomeScreen from './components/HomeScreen'
import AddListScreen from './components/AddListScreen'
import ListDetailScreen from './components/ListDetailScreen'
import { List, TodoItem, Priority } from './state/store'
import { deleteFile, listFilenameFromSlug, listsIndexPath, readJson, writeJson } from './services/filesystemService'

export default function App() {
  const [lists, setLists] = useState<List[]>([])
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [itemsByListId, setItemsByListId] = useState<Record<string, TodoItem[]>>({})

  const selectedItems = useMemo(() => (selectedListId ? itemsByListId[selectedListId] ?? [] : []), [itemsByListId, selectedListId])

  useEffect(() => {
    ;(async () => {
      const storedLists = await readJson<List[]>(listsIndexPath, [])
      if (storedLists.length === 0) {
        const defaultList: List = { id: 'default', name: 'Dagligvarer' }
        setLists([defaultList])
        setSelectedListId('default')
        await writeJson(listsIndexPath, [defaultList])
        const path = listFilenameFromSlug('default')
        const data = await readJson<TodoItem[]>(path, [])
        setItemsByListId({ default: data })
      } else {
        setLists(storedLists)
        const initialSelected = storedLists[0]?.id ?? null
        setSelectedListId(initialSelected)
        if (initialSelected) {
          const path = listFilenameFromSlug(initialSelected)
          const data = await readJson<TodoItem[]>(path, [])
          setItemsByListId({ [initialSelected]: data })
        }
      }
    })()
  }, [])

  function addList(name: string, description?: string) {
    const id = crypto.randomUUID()
    const newList = { id, name, description }
    const updated = [...lists, newList]
    setLists(updated)
    void writeJson(listsIndexPath, updated)
    setSelectedListId(id)
    setItemsByListId((prev) => ({ ...prev, [id]: prev[id] ?? [] }))
  }


  function addItem(text: string) {
    if (!selectedListId) return
    const newItem: TodoItem = { id: crypto.randomUUID(), text, done: false, priority: 'normal' }
    const source = itemsByListId[selectedListId] ?? []
    const pending: TodoItem[] = []
    const doneItems: TodoItem[] = []
    for (const it of source) {
      if (it.done) doneItems.push(it)
      else pending.push(it)
    }
    const priorityOrder = { high: 0, normal: 1, low: 2 }
    const sortedPending = [...pending, newItem].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    const next = [...sortedPending, ...doneItems]
    setItemsByListId((prev: Record<string, TodoItem[]>) => ({ ...prev, [selectedListId]: next }))
    const path = listFilenameFromSlug(selectedListId)
    void writeJson(path, next)
  }

  function toggleItem(id: string) {
    if (!selectedListId) return
    const path = listFilenameFromSlug(selectedListId)
    const source = itemsByListId[selectedListId] ?? []
    const toggled = source.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    const pending: TodoItem[] = []
    const doneItems: TodoItem[] = []
    for (const it of toggled) {
      if (it.done) doneItems.push(it)
      else pending.push(it)
    }
    const priorityOrder = { high: 0, normal: 1, low: 2 }
    const sortedPending = pending.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    const nextOrdered = [...sortedPending, ...doneItems]
    setItemsByListId((prev: Record<string, TodoItem[]>) => ({ ...prev, [selectedListId]: nextOrdered }))
    void writeJson(path, nextOrdered)
  }

  function editItem(id: string, newText: string) {
    if (!selectedListId) return
    const trimmed = newText.trim()
    if (!trimmed) return
    setItemsByListId((prev: Record<string, TodoItem[]>) => ({
      ...prev,
      [selectedListId]: (prev[selectedListId] ?? []).map((it: TodoItem) => (it.id === id ? { ...it, text: trimmed } : it)),
    }))
    const path = listFilenameFromSlug(selectedListId)
    const next = selectedItems.map((it) => (it.id === id ? { ...it, text: trimmed } : it))
    void writeJson(path, next)
  }

  function updateItemPriority(id: string, priority: Priority) {
    if (!selectedListId) return
    const path = listFilenameFromSlug(selectedListId)
    const source = itemsByListId[selectedListId] ?? []
    const updated = source.map((it) => (it.id === id ? { ...it, priority } : it))
    const pending: TodoItem[] = []
    const doneItems: TodoItem[] = []
    for (const it of updated) {
      if (it.done) doneItems.push(it)
      else pending.push(it)
    }
    const priorityOrder = { high: 0, normal: 1, low: 2 }
    const sortedPending = pending.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    const nextOrdered = [...sortedPending, ...doneItems]
    setItemsByListId((prev: Record<string, TodoItem[]>) => ({ ...prev, [selectedListId]: nextOrdered }))
    void writeJson(path, nextOrdered)
  }

  function deleteItem(id: string) {
    if (!selectedListId) return
    const next = selectedItems.filter((it) => it.id !== id)
    setItemsByListId((prev: Record<string, TodoItem[]>) => ({
      ...prev,
      [selectedListId]: next,
    }))
    const path = listFilenameFromSlug(selectedListId)
    void writeJson(path, next)
  }

  function setItemOrder(newOrder: TodoItem[]) {
    if (!selectedListId) return
    setItemsByListId((prev: Record<string, TodoItem[]>) => ({
      ...prev,
      [selectedListId]: newOrder,
    }))
    const path = listFilenameFromSlug(selectedListId)
    void writeJson(path, newOrder)
  }

  useEffect(() => {
    ;(async () => {
      if (!selectedListId) return
      if (itemsByListId[selectedListId]) return
      const path = listFilenameFromSlug(selectedListId)
      const data = await readJson<TodoItem[]>(path, [])
      setItemsByListId((prev) => ({ ...prev, [selectedListId]: data }))
    })()
  }, [selectedListId])

  const ListDetailAny = ListDetailScreen as any
  function editList(listId: string, name: string, description?: string) {
    const updated = lists.map((l) => (l.id === listId ? { ...l, name, description } : l))
    setLists(updated)
    void writeJson(listsIndexPath, updated)
  }

  function deleteList(listId: string) {
    const remaining = lists.filter((l) => l.id !== listId)
    setLists(remaining)
    void writeJson(listsIndexPath, remaining)
    const { [listId]: _removed, ...rest } = itemsByListId
    setItemsByListId(rest)
    void deleteFile(listFilenameFromSlug(listId))
    if (selectedListId === listId) {
      setSelectedListId(remaining[0]?.id ?? null)
    }
  }

  function HeaderBar() {
    const location = useLocation()
    const history = useHistory()
    const showBack = location.pathname !== '/'
    return (
      <IonHeader>
        <IonToolbar>
          {showBack && (
            <IonButtons slot="start">
              <IonButton onClick={() => history.push('/')}> 
                <IonIcon icon={chevronBack} />
              </IonButton>
            </IonButtons>
          )}
          <IonTitle>TodoList</IonTitle>
        </IonToolbar>
      </IonHeader>
    )
  }

  return (
    <Router>
      <HeaderBar />
      <IonContent fullscreen>
        <Switch>
          <Route exact path="/">
            <HomeScreen lists={lists} onEditList={editList} onDeleteList={deleteList} />
          </Route>
          <Route exact path="/lists/new">
            <AddListScreen onCreate={addList} />
          </Route>
          <Route path="/lists/:id">
            <ListDetailAny
              lists={lists}
              selectedListId={selectedListId}
              setSelectedListId={setSelectedListId}
              itemsByListId={itemsByListId}
              addItem={addItem}
              toggleItem={toggleItem}
              editItem={editItem}
              deleteItem={deleteItem}
              setItemOrder={setItemOrder}
              updateItemPriority={updateItemPriority}
            />
          </Route>
        </Switch>
      </IonContent>
    </Router>
  )
}


