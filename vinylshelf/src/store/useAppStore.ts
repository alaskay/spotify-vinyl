import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ShelfAlbum {
  id: string
  name: string
  artist: string
  coverUrl: string
  addedAt: number
  uri: string
}

interface AppStore {
  token: string | null
  activeAlbum: ShelfAlbum | null
  shelfAlbums: ShelfAlbum[]
  setToken: (token: string | null) => void
  setActiveAlbum: (album: ShelfAlbum | null) => void
  addToShelf: (album: ShelfAlbum) => void
  removeFromShelf: (id: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      token: null,
      activeAlbum: null,
      shelfAlbums: [],
      setToken: (token) => set({ token }),
      setActiveAlbum: (album) => set({ activeAlbum: album }),
      addToShelf: (album) =>
        set((s) => ({ shelfAlbums: [album, ...s.shelfAlbums] })),
      removeFromShelf: (id) =>
        set((s) => ({ shelfAlbums: s.shelfAlbums.filter((a) => a.id !== id) })),
    }),
    { name: 'vs_shelf' }
  )
)