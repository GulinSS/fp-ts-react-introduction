import * as A from 'fp-ts/Apply'
import * as R from 'fp-ts/Reader'
import * as O from 'fp-ts/Option'
import * as TO from 'fp-ts/TaskOption'
import * as T from 'fp-ts/Task'
import * as f from 'fp-ts/function'
import { ApiDeps, getMeowFile, getMeowFacts } from './api'
import { MeowFacts, MeowFile } from './types'

export type { ApiDeps } from './api'

const sequenceTReader = A.sequenceT(R.Applicative)
const sequenceTTaskPar = A.sequenceT(T.ApplicativePar)
const sequenceTOption = A.sequenceT(O.Applicative)

export type Meow = MeowFacts & MeowFile

export const getMeow = (): R.Reader<ApiDeps, TO.TaskOption<Meow>> => f.pipe(
  sequenceTReader(
    getMeowFile(),
    getMeowFacts()
  ),
  R.map((v) => f.pipe(
    sequenceTTaskPar(...v),
    T.map((vv) => f.pipe(
      sequenceTOption(...vv),
      O.map(([file, facts]) => ({
        ...file,
        ...facts
      }))
    ))
  ))
)
