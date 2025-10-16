import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react'
import { add } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import { List } from '../state/store'

export default function HomeScreen({ lists }: { lists: List[] }) {
  const history = useHistory()
  return (
    <div style={{ padding: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Dine lister</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Hold oversikt over alt – mat, hytte og mer.</p>
        </div>
        <IonButton onClick={() => history.push('/lists/new')}>
          <IonIcon icon={add} />
        </IonButton>
      </div>
      {lists.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 8px', color: '#6b7280' }}>
          <p>Ingen lister enda.</p>
          <p>Trykk på + for å lage din første liste.</p>
        </div>
      ) : (
        <IonList>
          {lists.map((l) => (
            <IonItem key={l.id} button onClick={() => history.push(`/lists/${l.id}`)}>
              <IonLabel>
                <h2 style={{ margin: 0 }}>{l.name}</h2>
                {l.description && <p style={{ marginTop: 4 }}>{l.description}</p>}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  )
}


