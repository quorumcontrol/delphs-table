import * as dotenv from "dotenv";
dotenv.config({
  path: '.env.local'
})

import { handle } from '../serverless/gameCalculator'

export function main() {
  return new Promise((resolve) => {
    handle({body: JSON.stringify({ tableId: '0x6d77ec8e6b511936939b2f47b4eecf6587b2a9abbaad7c1b55bb11f28a4e455c'})}, {}, (...resp:any) => {
      console.log('resp: ', resp)
      resolve(resp)
    })
  })
}

main().then(() => {
  console.log('done')
}).catch((err) => {
  console.error('error: ', err)
})
