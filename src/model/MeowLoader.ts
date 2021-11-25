import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import * as IO from 'fp-ts/IO'
import * as frp from '@frp-ts/core'
import * as f from 'fp-ts/function'
import { getMeow, Meow } from '../rest'
import { getAtomReverse, ModelDeps } from './types'
import * as A from 'fp-ts/Apply'
import * as TO from 'fp-ts/TaskOption'
import * as T from 'fp-ts/Task'

export type MeowLoaderState = {
  readonly loading: boolean
  readonly result: O.Option<Meow>
}

export interface MeowLoader extends frp.Property<MeowLoaderState> {
  readonly onNext: IO.IO<void>
}

export type GetMeowLoader = R.Reader<ModelDeps, MeowLoader>

const sequenceSReader = A.sequenceS(R.Applicative)

export const getMeowLoader: GetMeowLoader = f.pipe(
  sequenceSReader({
    task: f.pipe(
      R.ask<ModelDeps>(),
      R.map(getMeow())
    ),
    atom: f.pipe(
      R.ask<ModelDeps>(),
      R.map(getAtomReverse<MeowLoaderState>({
        loading: false,
        result: O.none
      }))
    )
  }),
  R.map(({ task, atom }): MeowLoader => {
    const onNextCall: T.Task<void> = f.pipe(
      TO.fromIO(() => { atom.modify((prev) => ({ ...prev, loading: true })) }),
      TO.chain(f.constant(task)),
      T.chainIOK((result) => () => { atom.set({ result, loading: false }) })
    )

    return {
      subscribe: atom.subscribe,
      get: atom.get,
      onNext: () => { onNextCall().catch(console.error) }
    }
  })
)
