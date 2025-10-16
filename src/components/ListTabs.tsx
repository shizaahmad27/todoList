import { useMemo, useRef, useState } from 'react'
import { IonButton, IonIcon, IonInput, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react'
import { add, trash } from 'ionicons/icons'
import { List } from '../state/store'

export type ListTabsProps = {
  lists: List[]
  selectedListId: string | null
  onSelect: (listId: string) => void
  onAddList: (name: string, description?: string) => void
  onDeleteSelected: () => void
}

export default function ListTabs(props: ListTabsProps) {
  const { lists, selectedListId, onSelect, onAddList, onDeleteSelected } = props
  const [newListName, setNewListName] = useState('')
  const inputRef = useRef<HTMLIonInputElement | null>(null)

  const value = selectedListId ?? undefined
  const canDelete = useMemo(() => lists.length > 0 && !!selectedListId, [lists.length, selectedListId])

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <IonInput
          ref={inputRef}
          value={newListName}
          placeholder="Ny liste"
          enterkeyhint="done"
          onIonInput={(e: any) => setNewListName(String(e.detail.value ?? ''))}
          onIonChange={(e: any) => setNewListName(String(e.detail.value ?? ''))}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' && newListName.trim()) {
              onAddList(newListName.trim())
              setNewListName('')
              inputRef.current?.setFocus()
            }
          }}
        />
        <IonButton
          onClick={() => {
            console.log('Plus button clicked. Current input value:', newListName)
            const trimmed = newListName.trim()
            if (trimmed) {
              console.log('Adding list:', trimmed)
              onAddList(trimmed)
              setNewListName('')
              inputRef.current?.setFocus()
            } else {
              console.log('No name entered; ignoring add.')
            }
          }}
        >
          <IonIcon icon={add} />
        </IonButton>
        <IonButton color="danger" disabled={!canDelete} onClick={onDeleteSelected}>
          <IonIcon icon={trash} />
        </IonButton>
      </div>

      <IonSegment value={value} onIonChange={(e: any) => e.detail.value && onSelect(String(e.detail.value))}>
        {lists.map((l) => (
          <IonSegmentButton key={l.id} value={l.id}>
            <IonLabel>{l.name}</IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>
    </div>
  )
}


