import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonSearchbar, IonToggle, IonNote } from '@ionic/react'
import { add, createOutline, trash } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import { List, TodoItem } from '../state/store'
import { useMemo, useState } from 'react'

export default function HomeScreen({ lists, itemsByListId, onEditList, onDeleteList }: { lists: List[]; itemsByListId: Record<string, TodoItem[]>; onEditList: (listId: string, name: string, description?: string) => void; onDeleteList: (listId: string) => void }) {
  const history = useHistory()
  const [query, setQuery] = useState('')
  const [global, setGlobal] = useState(false)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return lists
    if (!global) {
      return lists.filter((l) => l.name.toLowerCase().includes(q) || (l.description ?? '').toLowerCase().includes(q))
    }
    return lists.filter((l) => {
      const items = itemsByListId[l.id] ?? []
      return (
        l.name.toLowerCase().includes(q) ||
        (l.description ?? '').toLowerCase().includes(q) ||
        items.some((it) => it.text.toLowerCase().includes(q))
      )
    })
  }, [lists, query, global, itemsByListId])
  const globalResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!global || !q) return [] as Array<{ listId: string; listName: string; item: TodoItem }>
    const rows: Array<{ listId: string; listName: string; item: TodoItem }> = []
    for (const l of lists) {
      const items = itemsByListId[l.id] ?? []
      for (const it of items) {
        if (it.text.toLowerCase().includes(q)) rows.push({ listId: l.id, listName: l.name, item: it })
      }
    }
    return rows
  }, [lists, itemsByListId, global, query])
  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h1 style={{ marginLeft: 10 }}>Dine lister</h1>
          <p style={{ marginLeft: 10, color: '#6b7280' }}>Hold oversikt over alt – mat, hytte og mer.</p>
        </div>
        <IonButton style={{ marginRight: 10 }} onClick={() => history.push('/lists/new')}>
          <IonIcon icon={add} />
        </IonButton>
      </div>
      <div style={{ padding: '0 10px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IonToggle checked={global} onIonChange={(e) => setGlobal(!!e.detail.checked)} />
          <IonNote>{global ? 'Søk i alle lister' : 'Søk etter lister'}</IonNote>
        </div>
        <div style={{ width: 260 }}>
          <IonSearchbar
            value={query}
            placeholder={global ? 'Søk i alle lister' : 'Søk etter lister'}
            onIonInput={(e: any) => setQuery(String(e.detail.value ?? ''))}
            animated
            showClearButton="always"
            style={{ '--border-radius': '9999px' } as any}
          />
        </div>
      </div>
      {global && query.trim() ? (
        <IonList>
          {globalResults.length === 0 ? (
            <IonItem>
              <IonLabel>Ingen treff i noen lister.</IonLabel>
            </IonItem>
          ) : (
            globalResults.map((r) => (
              <IonItem key={`${r.listId}-${r.item.id}`} onClick={() => history.push(`/lists/${r.listId}`)}>
                <IonLabel>
                  <h2 style={{ margin: 0 }}>{r.item.text}</h2>
                  <p style={{ marginTop: 4 }}>i {r.listName}</p>
                </IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 8px', color: '#6b7280' }}>
          <p style={{ marginLeft: 10 }}>{query ? 'Ingen treff.' : 'Ingen lister enda.'}</p>
          {!query && <p style={{ marginLeft: 10 }}>Trykk på + for å lage din første liste.</p>}
        </div>
      ) : (
        <IonList>
          {filtered.map((l) => (
            <IonItem key={l.id}>
              <div style={{ flex: 1 }} onClick={() => history.push(`/lists/${l.id}`)}>
                <IonLabel>
                  <h2 style={{ margin: 0, marginLeft: 10 }}>{l.name}</h2>
                  {l.description && <p style={{ marginTop: 4, marginLeft: 10 }}>{l.description}</p>}
                </IonLabel>
              </div>
              <IonButton fill="clear" onClick={() => {
                const newName = prompt('Nytt navn for lista', l.name) || ''
                if (!newName.trim()) return
                const newDesc = prompt('Ny beskrivelse (valgfritt)', l.description ?? '') || ''
                onEditList(l.id, newName.trim(), newDesc.trim() || undefined)
              }}>
                <IonIcon icon={createOutline} style={{ color: '#000', fontSize: '20px', marginRight: 5 }} />
              </IonButton>
              <IonButton color="danger" onClick={() => onDeleteList(l.id)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  )
}


