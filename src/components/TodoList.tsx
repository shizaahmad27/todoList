import { useMemo } from 'react'
import { IonItem, IonLabel, IonList } from '@ionic/react'
import { TodoItem } from '../state/store'

export type TodoListProps = {
  items: TodoItem[]
  onToggle: (id: string) => void
}

export default function TodoList({ items, onToggle }: TodoListProps) {
  const [pending, done] = useMemo(() => {
    const p: TodoItem[] = []
    const d: TodoItem[] = []
    for (const it of items) {
      if (it.done) d.push(it)
      else p.push(it)
    }
    return [p, d]
  }, [items])

  return (
    <div>
      <IonList>
        {pending.map((it: TodoItem) => (
          <IonItem key={it.id} button onClick={() => onToggle(it.id)}>
            <IonLabel>{it.text}</IonLabel>
          </IonItem>
        ))}
      </IonList>
      <IonList>
        {done.map((it: TodoItem) => (
          <IonItem key={it.id} button onClick={() => onToggle(it.id)} color="light">
            <IonLabel>{it.text}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  )
}


