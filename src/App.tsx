import React, { useEffect, useMemo } from 'react'
import * as O from 'fp-ts/Option'
import { useProperty } from '@frp-ts/react';
import './App.css';
import { ModelDeps } from './model/types'
import { getAppMain } from './model'
import { Meow } from './rest'

const Card = (v: Meow) => (
  <div style={{ padding: 10, width: 150, display: 'inline-block', overflow: 'hidden' }}>
    <div style={{
      width: 150,
      height: 150,
      backgroundImage: `url(${v.file.toString()})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    }}/>
    <p style={{ fontSize: 12, height: 50, textOverflow: 'ellipsis' }}>{v.data.join('\n')}</p>
  </div>
)

function App({ fetch, clock }: ModelDeps) {
  const property = useMemo(() => getAppMain({ fetch, clock }), [fetch, clock])

  const { loading, result, favorites } = useProperty(property)

  useEffect(() => {
    property.onNext()
  }, [property])

  return (
    <div className="App">
      { O.isSome(result) && <Card {...result.value}/> }

      <div>
        <button onClick={property.onNext}>Hide</button>
        <button onClick={property.onFavorite}>Favorite</button>
        { loading && <span>Loading</span> }
      </div>

      <div>
        <p>Favorites</p>
        { favorites.map((v, i) => (
          <Card key={favorites.length-i} {...v}/>
        )) }
      </div>
    </div>
  );
}

export default App;
