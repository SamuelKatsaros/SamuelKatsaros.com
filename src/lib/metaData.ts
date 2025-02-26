import { z } from 'astro/zod'

const LINE_BREAK = {
  '{n}': ' <br /> ',
  '{nSm}': " <br class='max-sm:hidden'/> ",
  '{nMd}': " <br class='max-md:hidden'/> ",
  '{nLg}': " <br class='max-lg:hidden'/> "
}

interface ParseTextOptions {
  isCleanText?: boolean
}

const parseText = (text: string, opts?: ParseTextOptions): string => {
  let newText = text
  Object.keys(LINE_BREAK).forEach((key) => {
    newText = newText.replaceAll(
      key,
      opts?.isCleanText ? ' ' : LINE_BREAK[key as keyof typeof LINE_BREAK]
    )
  })
  return newText
}

const metaDataSchema = z
  .object({ title: z.string(), description: z.string() })
  .transform((value) => ({
    title: parseText(value.title, { isCleanText: true }),
    htmlTitle: parseText(value.title),
    description: parseText(value.description, { isCleanText: true }),
    htmlDescription: parseText(value.description)
  }))

type MetaData = z.output<typeof metaDataSchema>
type MetaDataInput = z.input<typeof metaDataSchema>

const _mainMetaData: MetaDataInput = {
  title: 'Samuel E Katsaros',
  description:
    'Building, Acquiring, Operating, and Learning.'
}
export const mainMetaData = metaDataSchema.parse(_mainMetaData)

const _projectMetaData: MetaDataInput = {
  title: 'Curiosities Developed',
  description:
    'I try to document the projects I work on. I often find myself curious, but rarely have the{nSm}time to commit to such project. Though, when I do, my creations teach me more than I anticipated.'
}
export const projectMetaData: MetaData = metaDataSchema.parse(_projectMetaData)

const _blogMetaData: MetaDataInput = {
  title: 'My Thoughts in .mdx',
  description:
    'Whether reading, writing, or coding, I try to document my thoughts. Though my most{nSm}have a quick expiration, I found putting them down in markdown helps with my daily introspection.'
}
export const blogMetaData: MetaData = metaDataSchema.parse(_blogMetaData)
