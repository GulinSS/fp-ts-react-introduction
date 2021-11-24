import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import { urlCodec } from './codecs/url'

/**
 * See https://github.com/wh-iterabb-it/meowfacts
 * See https://meowfacts.herokuapp.com/
 */
export const MeowFacts = t.readonly(t.strict({
  data: tt.readonlyNonEmptyArray(t.string)
}))

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MeowFacts = t.TypeOf<typeof MeowFacts>


/**
 * See https://aws.random.cat/
 * See https://aws.random.cat/meow
 */
export const MeowFile = t.readonly(t.strict({
  file: urlCodec
}))

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MeowFile = t.TypeOf<typeof MeowFile>