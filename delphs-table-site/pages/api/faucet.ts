// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers, utils, Wallet } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { BadgeOfAssembly__factory } from "../../badge-of-assembly-types/typechain";
import { skaleMainnet, skaleTestnet } from '../../src/utils/SkaleChains'
import isTestnet from "../../src/utils/isTestnet";
import { BOA_ADDRESS } from "../../src/hooks/BadgeOfAssembly";
import debug from 'debug'

const log = debug('faucet')
debug.enable('faucet')

if (!process.env.DELPHS_PRIVATE_KEY) {
  throw new Error("must have a badge minter private key")
}

const rpcUrl = isTestnet ? skaleTestnet.rpcUrls.default : skaleMainnet.rpcUrls.default

const schainProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
const schainSigner = new Wallet(process.env.DELPHS_PRIVATE_KEY).connect(schainProvider)

const badgeOfAssembly = BadgeOfAssembly__factory.connect(BOA_ADDRESS, schainSigner)

const highWaterForSFuel = utils.parseEther('0.5')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{message?: string, transactionId?: string}>
) {
  const address = JSON.parse(req.body).address
  log(address)

  // first get the balances
  const [sfuelBalance, badgeBalance] = await Promise.all([
    schainProvider.getBalance(address),
    badgeOfAssembly.balanceOf(address, 1)
  ])

  log(address, 'sfuel: ', utils.formatEther(sfuelBalance), 'badge: ', badgeBalance.toNumber())

  if (badgeBalance.eq(0)) {
    log(address, 'no badge')
    res.status(400).json({message: 'requires badge'})
    return
  }

  if (sfuelBalance.gte(highWaterForSFuel)) {
    log(address, 'balance is high enough not to mint')
    res.status(200).json({message: 'you have enough'})
    return
  }

  log('sending sfuel')
  const tx = await schainSigner.sendTransaction({
    to: address,
    value: highWaterForSFuel,
  })
  log(address, 'tx submitted: ', tx.hash)

  res.status(201).json({message: 'ok', transactionId: tx.hash})
  return
}
