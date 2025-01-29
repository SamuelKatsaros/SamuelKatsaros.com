// @ts-check
import mdx from '@astrojs/mdx'
import node from '@astrojs/node'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'
import { defineConfig, envField } from 'astro/config'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

let adapter = vercel({
  webAnalytics: {
    enabled: true
  },
  imageService: true
})

if (process.argv[3] === '--node' || process.argv[4] === '--node') {
  adapter = node({ mode: 'standalone' })
}

// https://astro.build/config
export default defineConfig({
  adapter,
  output: 'server',
  site: 'https://samuelkatsaros.com',
  
  markdown: {
    shikiConfig: {
      theme: 'poimandres'
    }
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'load'
  },

  image: {
    domains: ['images-na.ssl-images-amazon.com', 'pbs.twimg.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.ssl-images-amazon.com' },
      { protocol: 'https', hostname: '*.twimg.com' },
      { protocol: 'https', hostname: '*.githubusercontent.com' }
    ]
  },

  env: {
    schema: {
      MAPTILER_API_KEY: envField.string({
        context: 'server',
        access: 'secret'
      }),
      GITHUB_ACCESS_TOKEN: envField.string({
        context: 'server',
        access: 'secret'
      }),
      MONKEYTYPE_API_KEY: envField.string({
        context: 'server',
        access: 'secret'
      }),
      PUBLIC_VERCEL_ENV: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'development'
      }),
      PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true
      }),
      PUBLIC_VERCEL_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true
      }),
      APPLE_MUSIC_PRIVATE_KEY: envField.string({
        context: 'server',
        access: 'secret'
      }),
      APPLE_MUSIC_KEY_ID: envField.string({
        context: 'server',
        access: 'secret'
      }),
      APPLE_MUSIC_TEAM_ID: envField.string({
        context: 'server',
        access: 'secret'
      }),
      OPENAI_API_KEY: envField.string({
        context: 'server',
        access: 'secret'
      }),
      TWILIO_ACCOUNT_SID: envField.string({
        context: 'server',
        access: 'secret'
      }),
      TWILIO_AUTH_TOKEN: envField.string({
        context: 'server',
        access: 'secret'
      }),
      TWILIO_PHONE_NUMBER: envField.string({
        context: 'server',
        access: 'secret'
      }),
      ADMIN_PHONE_NUMBER: envField.string({
        context: 'server',
        access: 'secret'
      }),
      APPLE_MUSIC_USER_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true
      }),
    }
  },

  vite: {
    ssr: {
      noExternal: ['path-to-regexp', 'react-tweet']
    }
  },

  integrations: [
    mdx({
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            headingProperties: {
              class: 'article-heading'
            }
          }
        ]
      ]
    }),
    (await import('@playform/compress')).default({
      HTML: {
        'html-minifier-terser': {
          collapseWhitespace: false
        }
      }
    }),
    sitemap(),
    react(),
    tailwind({
      applyBaseStyles: false
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      }
    })
  ]
})
