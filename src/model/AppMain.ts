import * as O from 'fp-ts/Option'
import { Meow } from '../rest'
import * as frp from '@frp-ts/core'
import { fptsProperty } from '@frp-ts/fp-ts'
import * as IO from 'fp-ts/IO'
import * as f from 'fp-ts/function'
import * as R from 'fp-ts/Reader'
import { getAtomReverse, ModelDeps } from './types'
import { getMeowLoader } from './MeowLoader'
import * as A from 'fp-ts/Apply'

export type AppMainState = {
  readonly loading: boolean
  readonly result: O.Option<Meow>
  readonly favorites: ReadonlyArray<Meow>
}

export interface AppMain extends frp.Property<AppMainState> {
  readonly onNext: IO.IO<void>
  readonly onFavorite: IO.IO<void>
}

export type GetAppMain = R.Reader<ModelDeps, AppMain>

const sequenceSReader = A.sequenceS(R.Applicative)

export const getAppMain: GetAppMain = f.pipe(
  sequenceSReader({
    meowLoader: getMeowLoader,
    atom: f.pipe(
      R.ask<ModelDeps>(),
      R.map(getAtomReverse<ReadonlyArray<Meow>>([]))
    )
  }),
  R.map(({ meowLoader, atom }) => {
    const atomSum = f.pipe(
      fptsProperty.sequenceT(meowLoader, atom),
      fptsProperty.map(([ m, a ]) => ({
        ...m,
        favorites: a
      }))
    )

    const onFavoriteCall = f.pipe(
      () => meowLoader.get().result,
      IO.chain(
        O.fold(
          f.constant(f.constVoid),
          (m) => () => {
            atom.modify((v) => [m, ...v])
          }
        )
      ),
      IO.chain(f.constant(() => {
        meowLoader.onNext()
      }))
    )

    return {
      subscribe: atomSum.subscribe,
      get: atomSum.get,
      onNext: meowLoader.onNext,
      onFavorite: onFavoriteCall
    }
  })
)