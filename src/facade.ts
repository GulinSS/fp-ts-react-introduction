import * as O from 'fp-ts/Option'
import * as IO from 'fp-ts/IO'
import * as f from 'fp-ts/function'
import { ApiDeps, getMeow, Meow } from './rest'
import { useAsync } from './useAsync'
import { useMemo, useState } from 'react'

export const useMeow = (v: ApiDeps) => {
  const [favorites, setFavorites] = useState<ReadonlyArray<Meow>>([])
  const [refreshCount, setRefreshCount] = useState(0)

  const currentMeow = useAsync(() => f.pipe(
    getMeow()(v),
    (run) => run()
  ), [refreshCount, v])

  const reloadMeow = useMemo(
    () => () => setRefreshCount((prev) => prev++),
    [setRefreshCount]
  )

  const addMeow = useMemo(
    () => (v: Meow) => () => setFavorites((prev) => [v, ...prev]),
    [setFavorites]
  )

  const passLike = useMemo(() => f.flow(
      addMeow,
      IO.chain(f.constant(reloadMeow))
    ),
    [addMeow, reloadMeow]
  )

  return {
    favorites,
    passLike,
    meow: f.pipe(
      O.fromNullable(currentMeow.res),
      O.flatten
    ),
    loading: currentMeow.loading,
    passDislike: reloadMeow
  }
}
