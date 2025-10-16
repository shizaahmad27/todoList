import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react'
import { add } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import { List } from '../state/store'

export default function HomeScreen({ lists }: { lists: List[] }) {
  const history = useHistory()
  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <IonButton onClick={() => history.push('/lists/new')}>
          <IonIcon icon={add} />
        </IonButton>
      </div>
      <IonList>
        {lists.map((l) => (
          <IonItem key={l.id} button onClick={() => history.push(`/lists/${l.id}`)}>
            <IonLabel>
              <h2>{l.name}</h2>
              {l.description && <p>{l.description}</p>}
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  )
}


