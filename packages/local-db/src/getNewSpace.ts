import { nanoid } from 'nanoid'
import { SettingsType } from '@penx/constants'
import { ISpace } from '@penx/types'

export function getNewSpace(data: Partial<ISpace>): ISpace {
  return {
    id: nanoid(),
    name: 'My Space',
    isActive: true,
    favorites: [],
    children: [],
    snapshot: {
      version: 0,
      nodeMap: {},
    },
    settings: {
      [SettingsType.APPEARANCE]: {},

      [SettingsType.PREFERENCES]: {},

      [SettingsType.HOTKEYS]: {},

      [SettingsType.EXTENSIONS]: {},
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data,
  }
}
