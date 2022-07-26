import * as dotenv from "dotenv";
dotenv.config({
  path: '.env.local'
})

import { handle } from '../serverless/tablePlayer'

export function main() {
  return new Promise((resolve) => {
    handle({}, {}, (...resp:any) => {
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
