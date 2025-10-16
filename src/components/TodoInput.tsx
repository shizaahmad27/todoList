import { useEffect, useRef, useState } from 'react'
import { IonInput } from '@ionic/react'

export type TodoInputProps = {
  onAdd: (text: string) => void
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLIonInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.setFocus()
  }, [])

  return (
    <div style={{ padding: '8px' }}>
      <IonInput
        ref={inputRef}
        value={text}
        placeholder="Legg til nytt innslag"
        inputMode="text"
        enterkeyhint="done"
        onIonInput={(e: any) => setText(String(e.detail.value ?? ''))}
        onKeyDown={(e: any) => {
          if (e.key === 'Enter' && text.trim()) {
            onAdd(text.trim())
            setText('')
            inputRef.current?.setFocus()
          }
        }}
      />
    </div>
  )
}


