'use client'

import { useCreateSpaceDialog } from '@/components/CreateSpaceDialog/useCreateSpaceDialog'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { channelsAtom } from '@/hooks/useChannels'
import { postsAtom } from '@/hooks/usePosts'
import { useSpaceId } from '@/hooks/useSpaceId'
import { useSpaces } from '@/hooks/useSpaces'
import { api } from '@/lib/trpc'
import { store } from '@/store'
import { ChevronDown, Plus, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function SpacesSelect() {
  const { push } = useRouter()
  const { space, spaces } = useSpaces()
  const { setSpaceId } = useSpaceId()
  const { setIsOpen } = useCreateSpaceDialog()
  const { data: session } = useSession()

  async function selectSpace(spaceId: string) {
    setSpaceId(spaceId)

    const [posts, channels] = await Promise.all([
      api.post.listBySpaceId.query(spaceId),
      api.channel.listBySpaceId.query(spaceId),
    ])
    store.set(postsAtom, posts)
    store.set(channelsAtom, channels)
    push(`/~/space/${spaceId}`)
  }

  if (!space)
    return (
      <div
        className="cursor-pointer flex gap-2 items-center h-12 px-3 hover:bg-sidebar border-b"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={24} className="inline-flex text-neutral-600" />
        <div className="text-base font-semibold">Create Space</div>
      </div>
    )

  return (
    <div className="relative">
      {session?.userId === space.userId && (
        <div
          className="w-8 h-8 hover:bg-sidebar flex items-center justify-center absolute right-2 top-2 rounded-md cursor-pointer"
          onClick={() => {
            push('/~/settings')
          }}
        >
          <Settings width={18} />
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-between px-4 hover:bg-sidebar/50 cursor-pointer font-semibold h-12">
            <div className="flex items-center gap-2">
              <Image
                src={space.logo!}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />

              <div>{space.name}</div>
              <ChevronDown size={16} className="text-neutral-600" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          alignOffset={10}
          className="w-[260px]"
        >
          {spaces.map((space) => (
            <DropdownMenuItem
              key={space.id}
              className="cursor-pointer flex gap-2 items-center justify-between"
              onClick={async () => {
                await selectSpace(space.id)
              }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={space.logo!}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                />
                <div className="text-base font-semibold">{space.name}</div>
              </div>
              <Badge variant="secondary">
                {session?.userId === space.userId ? 'Owner' : 'Member'}
              </Badge>
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem
            key={space.id}
            className="cursor-pointer flex gap-2 items-center"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            <Plus size={24} className="inline-flex" />
            <div className="text-base font-semibold">Create Space</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}