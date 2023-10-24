import { SettingsType } from '@penx/constants'

export enum ChangeType {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ADD = 'ADD',
}

export interface ISpace {
  id: string

  name: string

  description?: string

  isActive: boolean

  activeNodeId?: string

  // favorites node IDs
  favorites: string[]

  // root node IDs
  children: string[]

  snapshot: {
    repo: string
    version: number
    hashMap: Record<string, string>
  }

  settings: {
    [SettingsType.SYNC]: {
      githubToken: string
      repo: string
      privateKey: string
    }
    [SettingsType.APPEARANCE]: Record<string, any>
    [SettingsType.HOTKEYS]: Record<string, any>
    [SettingsType.PREFERENCES]: Record<string, any>
    [SettingsType.EXTENSIONS]: Record<string, any>
    [key: string]: Record<string, any>
  }

  createdAt: number

  updatedAt: number
}
