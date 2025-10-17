import { } from 'react'
import { IonSegment, IonSegmentButton, IonLabel, IonSelect, IonSelectOption } from '@ionic/react'
import { List } from '../state/store'

export type ListTabsProps = {
  lists: List[]
  selectedListId: string | null
  onSelect: (listId: string) => void
}

export default function ListTabs(props: ListTabsProps) {
  const { lists, selectedListId, onSelect } = props

  const value = selectedListId ?? undefined

  const showDropdown = lists.length > 3

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        {showDropdown ? (
          <IonSelect interface="popover" value={value} placeholder="Velg liste" onIonChange={(e: any) => e.detail.value && onSelect(String(e.detail.value))}>
            {lists.map((l) => (
              <IonSelectOption key={l.id} value={l.id}>
                {l.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        ) : (
          <IonSegment value={value} onIonChange={(e: any) => e.detail.value && onSelect(String(e.detail.value))}>
            {lists.map((l) => (
              <IonSegmentButton key={l.id} value={l.id}>
                <IonLabel>{l.name}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        )}
      </div>
    </div>
  )
}


