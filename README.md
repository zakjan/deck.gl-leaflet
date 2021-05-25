# deck.gl-leaflet

[![](https://img.shields.io/npm/dm/deck.gl-leaflet)](https://www.npmjs.com/package/deck.gl-leaflet)
[![](https://img.shields.io/david/zakjan/deck.gl-leaflet)](https://www.npmjs.com/package/deck.gl-leaflet)
[![](https://img.shields.io/bundlephobia/min/deck.gl-leaflet)](https://www.npmjs.com/package/deck.gl-leaflet)

deck.gl plugin for Leaflet

[Demo](https://zakjan.github.io/deck.gl-leaflet/)

<img src="docs/screenshot@2x.jpg" alt="Screenshot" width="640" height="320">

## Install

```
npm install deck.gl-leaflet
```

or

```
<script src="https://unpkg.com/deck.gl-leaflet@1.0.4/dist/deck.gl-leaflet.min.js"></script>
```

## Usage

```
import { LeafletLayer } from 'deck.gl-leaflet';
```

```
const map = L.map(...);
const deckLayer = new LeafletLayer({
  views: [
    new MapView({
      repeat: true
    })
  ],
  layers: [
    new ScatterplotLayer({
      data: [...],
    })
  ]
});
map.addLayer(deckLayer);
```