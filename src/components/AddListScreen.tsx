import { IonButton, IonInput, IonTextarea } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import { useRef, useState } from 'react'

export default function AddListScreen({ onCreate }: { onCreate: (name: string, description?: string) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const history = useHistory()
  const nameRef = useRef<HTMLIonInputElement | null>(null)

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <IonInput
        ref={nameRef}
        value={name}
        placeholder="Navn på liste"
        onIonInput={(e: any) => setName(String(e.detail.value ?? ''))}
      />
      <IonTextarea
        value={description}
        placeholder="Beskrivelse (valgfritt)"
        onIonInput={(e: any) => setDescription(String(e.detail.value ?? ''))}
      />
      <IonButton
        onClick={() => {
          const n = name.trim()
          if (!n) return
          onCreate(n, description.trim() || undefined)
          history.replace('/')
        }}
      >
        Opprett liste
      </IonButton>
    </div>
  )
}


