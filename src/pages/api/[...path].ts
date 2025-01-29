import { zValidator } from '@hono/zod-validator'
import type { APIRoute } from 'astro'
import { z } from 'astro:schema'
import { Hono } from 'hono'

import github from './_services/github'
import getLinkMetadata from './_services/linkMetadata'
import getMonkeytypeData from './_services/monkeytype'
import getTweetContent from './_services/tweetContent'
import getAppleMusicData from './_services/applemusic'
import getGoodreadsData from './_services/goodreads'

const app = new Hono()
  .basePath('/api')
  .onError((error, c) => {
    console.error('error occured >>', error)
    return c.json({ error: 'Something went wrong' }, 500)
  })
  .route('/github', github)
  .get(
    '/link-metadata',
    zValidator('query', z.object({ url: z.string() })),
    async (c) => {
      const { url } = c.req.valid('query')
      return c.json(await getLinkMetadata(url))
    }
  )
  .get('/monkeytype', async (c) =>
    c.json(await getMonkeytypeData(), 200, {
      'Cache-Control': 's-maxage=43200, stale-while-revalidate=600'
    })
  )
  .get(
    '/tweet-content/:id',
    zValidator('param', z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid('param')
      return c.json(await getTweetContent(id), 200, {
        'Cache-Control': 'max-age=86400, s-maxage=86400, stale-while-revalidate=600'
      })
    }
  )
  .get('/applemusic', async (c) => c.json(await getAppleMusicData()))
  .get('/goodreads', async (c) => c.json(await getGoodreadsData()))

export const ALL: APIRoute = (context) => app.fetch(context.request)

export const prerender = false

export type APIType = typeof app
