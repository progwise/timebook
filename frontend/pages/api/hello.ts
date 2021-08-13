// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiHandler } from 'next'

const helloHandler: NextApiHandler = (request, response) => {
    response.status(200).json({ name: 'John Doe' })
}

export default helloHandler
