// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    res.status(401).json({ value: 'Unauthorized' })
    return
  }

  try {
    await res.unstable_revalidate('/')
    return res.json({ revalidated: true })
  } catch (err) {
    res.status(500).json({ value: 'Internal server error' })
    return
  }
}
