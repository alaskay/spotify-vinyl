import { getValidToken } from '@/services/spotify-auth'

export interface SpotifyUser {
  id: string
  display_name: string
  email: string
  images: { url: string; width: number; height: number }[]
}

export async function fetchCurrentUser(): Promise<SpotifyUser> {
  const token = await getValidToken()
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch user profile')
  return res.json() as Promise<SpotifyUser>
}

export interface SpotifyAlbumResult {
  id: string
  name: string
  uri: string
  artists: { name: string }[]
  images: { url: string; width: number; height: number }[]
  release_date: string
}

export async function searchAlbums(query: string): Promise<SpotifyAlbumResult[]> {
  const token = await getValidToken()
  const params = new URLSearchParams({ q: query, type: 'album', limit: '12' })
  const res = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json() as { albums: { items: SpotifyAlbumResult[] } }
  return data.albums.items
}
