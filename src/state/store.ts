export type List = {
  id: string
  name: string
  description?: string
}

export type TodoItem = {
  id: string
  text: string
  done: boolean
}

export type AppState = {
  lists: List[]
  selectedListId: string | null
  itemsByListId: Record<string, TodoItem[]>
}

export const initialState: AppState = {
  lists: [],
  selectedListId: null,
  itemsByListId: {},
}


