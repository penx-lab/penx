import React from 'react'
import { Box } from '@fower/react'
import { useAccount, useReadContract } from 'wagmi'
import { erc20Abi } from '@penx/abi'
import { precision } from '@penx/math'
import { addressMap } from '@penx/wagmi'

const VaultInk = () => {
  const { data, isLoading } = useReadContract({
    address: addressMap.INK,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [addressMap.DaoVault],
  })

  if (isLoading) return null

  return (
    <Box toCenterY>
      <Box>Vault: </Box>
      <Box>
        {!!data && precision.toTokenDecimal(data)}
        INK
      </Box>
    </Box>
  )
}

export default VaultInk