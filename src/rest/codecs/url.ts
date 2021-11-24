import * as IOE from 'fp-ts/IOEither'
import * as f from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as t from 'io-ts'

const newURL = IOE.fromIOK((v: string) => () => new URL(v))

const newURLOption: (v: string) => IO.IO<O.Option<URL>> =
  f.flow(
    newURL,
    IO.map(O.fromEither)
  )

const isStringOptional: (v: unknown) => O.Option<string> =
  O.fromPredicate((v: unknown): v is string => typeof v === 'string')

const optionTraverseIO = O.traverse(IO.Applicative)

const getURLFromUnknown: (v: unknown) => IO.IO<O.Option<URL>> = f.flow(
  isStringOptional,
  optionTraverseIO(newURLOption),
  IO.map(O.flatten)
)

export const urlCodec = new t.Type<URL, URL, unknown>(
  'URL',
  (v: unknown): v is URL => f.pipe(
    getURLFromUnknown(v),
    IO.map(O.isSome),
    (run) => run()
  ),
  (v, context) => f.pipe(
    getURLFromUnknown(v),
    IO.map(
      O.fold(
        f.constant(t.failure<URL>(v, context)),
        t.success
      )
    ),
    (run) => run()
  ),
  t.identity
)