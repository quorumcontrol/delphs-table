import * as dotenv from "dotenv";
dotenv.config({
  path: '.env.local'
})

import { handle } from '../serverless/gameCalculator'

export function main() {
  return new Promise((resolve) => {
    handle({body: JSON.stringify({ tableId: '0xcedc9fd8af09c4d22ae9e3a4d6d54a94db28b7f20729d497068c3d76a5f8c1bf'})}, {}, (...resp:any) => {
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
