import { useEffect, useMemo, useState } from 'react'
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import AddListScreen from './components/AddListScreen'
import ListDetailScreen from './components/ListDetailScreen'
import { List, TodoItem } from './state/store'
import { listFilenameFromSlug, listsIndexPath, readJson, writeJson } from './services/filesystemService'

export default function App() {
  const [lists, setLists] = useState<List[]>([])
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [itemsByListId, setItemsByListId] = useState<Record<string, TodoItem[]>>({})

  const selectedItems = useMemo(() => (selectedListId ? itemsByListId[selectedListId] ?? [] : []), [itemsByListId, selectedListId])

  // Load lists index and selected list items on startup
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

  // Note: delete list flow can be added on the detail screen later

  function addItem(text: string) {
    if (!selectedListId) return
    const newItem: TodoItem = { id: crypto.randomUUID(), text, done: false }
    setItemsByListId((prev: Record<string, TodoItem[]>) => ({ ...prev, [selectedListId]: [...(prev[selectedListId] ?? []), newItem] }))
    const path = listFilenameFromSlug(selectedListId)
    const next = [...selectedItems, newItem]
    void writeJson(path, next)
  }

  function toggleItem(id: string) {
    if (!selectedListId) return
    setItemsByListId((prev: Record<string, TodoItem[]>) => ({
      ...prev,
      [selectedListId]: (prev[selectedListId] ?? []).map((it: TodoItem) => (it.id === id ? { ...it, done: !it.done } : it)),
    }))
    const path = listFilenameFromSlug(selectedListId)
    const next = selectedItems.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    void writeJson(path, next)
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

  // Lazy-load items when switching lists
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

  return (
    <Router>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TodoList</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Switch>
          <Route exact path="/">
            <HomeScreen lists={lists} />
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
            />
          </Route>
        </Switch>
      </IonContent>
    </Router>
  )
}


