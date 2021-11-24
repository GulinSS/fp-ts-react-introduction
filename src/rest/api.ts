import * as O from 'fp-ts/Option'
import * as TO from 'fp-ts/TaskOption'
import * as RT from 'fp-ts/ReaderTask'
import * as f from 'fp-ts/function'
import { MeowFacts, MeowFile } from './types'

export type ApiDeps = { fetch: typeof fetch }

const GET_MEOW_FACTS = 'https://meowfacts.herokuapp.com/'

export const getMeowFacts: () => RT.ReaderTask<ApiDeps, O.Option<MeowFacts>> =
  () => ({ fetch }) => f.pipe(
    TO.tryCatch(() => fetch(GET_MEOW_FACTS).then((r) => r.json())),
    TO.chainOptionK(f.flow(
      MeowFacts.decode,
      O.fromEither
    ))
  )

const GET_MEOW_FILE = 'https://aws.random.cat/meow'

export const getMeowFile: () => RT.ReaderTask<ApiDeps, O.Option<MeowFile>> =
  () => ({ fetch }) => f.pipe(
    TO.tryCatch(() => fetch(GET_MEOW_FILE).then((r) => r.json())),
    TO.chainOptionK(f.flow(
      MeowFile.decode,
      O.fromEither
    ))
  )
