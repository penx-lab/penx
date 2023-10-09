import { Box } from '@fower/react'
import { CommandDrawer } from './CommandDrawer'
import { DrawerSidebar } from './SidebarDrawer'

export const MobileNav = () => {
  return (
    <Box
      h-48
      sticky
      top0
      toCenterY
      toBetween
      px2
      display={['inline-flex', 'inline-flex', 'none']}
      w-100p
      bgWhite
      zIndex-10
    >
      <DrawerSidebar />
      <CommandDrawer />
    </Box>
  )
}
