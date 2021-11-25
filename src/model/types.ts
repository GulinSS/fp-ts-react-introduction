import * as frp from '@frp-ts/core'
import { ApiDeps } from '../rest'
import * as R from 'fp-ts/Reader'

export type ModelDeps = { clock: frp.Clock } & ApiDeps

export const getAtomReverse: <A>(initial: A) =>
  R.Reader<frp.Env, frp.atom.Atom<A>> =
  (initial) => (env: frp.Env) =>
    frp.atom.newAtom(env)(initial)
