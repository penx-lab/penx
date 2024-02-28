import { ethers, deployments } from 'hardhat'
import { precision } from './precision'
import { BountyFacet, DaoVault, Diamond, INK, MockToken, RoleAccessControlFacet } from '../types'

export type Fixture = Awaited<ReturnType<typeof deployFixture>>

export async function deployFixture() {
  await deployments.fixture()
  const accountList = await ethers.getSigners()
  const { deployer, keeper } = await ethers.getNamedSigners()

  const [
    wallet,
    user0,
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    signer0,
    signer1,
    signer2,
    signer3,
    signer4,
    signer5,
    signer6,
    signer7,
    signer8,
    signer9,
  ] = accountList

  const [usdt, usdc, dai, ink, daoVault] = await Promise.all([
    ethers.getContract<MockToken>('USDT'),
    ethers.getContract<MockToken>('USDC'),
    ethers.getContract<MockToken>('DAI'),
    ethers.getContract<INK>('INK'),
    ethers.getContract('DaoVault') as Promise<DaoVault>,
  ])

  const diamond = await ethers.getContract<Diamond>('Diamond')
  const diamondAddr = await diamond.getAddress()

  // await usdt.mint(user0.address, precision.token(1_000_000, 6))
  // await usdc.mint(user0.address, precision.token(1_000_000, 6))
  // await dai.mint(user0.address, precision.token(1_000_000))

  const [inkAddress, daoVaultAddress, bountyFacet, roleAccessControlFacet] = await Promise.all([
    ink.getAddress(),
    daoVault.getAddress(),
    ethers.getContractAt('BountyFacet', diamondAddr) as unknown as Promise<BountyFacet>,
    ethers.getContractAt('RoleAccessControlFacet', diamondAddr) as unknown as Promise<RoleAccessControlFacet>,
  ])

  const accounts = {
    deployer,
    keeper,

    wallet,
    user0,
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8,
    signer0,
    signer1,
    signer2,
    signer3,
    signer4,
    signer5,
    signer6,
    signer7,
    signer8,
    signer9,
    signers: [signer0, signer1, signer2, signer3, signer4, signer5, signer6],
  }

  return {
    getContract: async (name: string) => {
      return await ethers.getContractAt(name, diamondAddr)
    },

    accounts,
    ...accounts,

    usdt,
    usdc,
    dai,
    ink,

    daoVault,

    bountyFacet,
    roleAccessControlFacet,

    // address
    inkAddress,
    daoVaultAddress,
  }
}