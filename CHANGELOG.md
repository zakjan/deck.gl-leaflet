# Changelog

# 1.3.1

- fix exposing fields

# 1.3.0

- migrate to TS, ESM

# 1.2.1

- fix tooltip position by resetting deck z-index

# 1.2.0

- add picking support

# 1.1.2

- update dependency from deck.gl to @deck.gl/core

# 1.1.1

- pause deck.gl animation during Leaflet move

# 1.1.0

- pause deck.gl animation during Leaflet zoom animation
- animate zoom with CSS transition

## 1.0.6

- add leaflet-layer class

## 1.0.5

- remove support for rendering multiple copies of the map, prefer passing MapView in props

## 1.0.4

- fix low zoom levels

## 1.0.3

- support rendering multiple copies of the map at low zoom levels #3 (previous implementation was incorrect)

## 1.0.2

- support rendering multiple copies of the map at low zoom levels #2 (previous implementation was incorrect)

## 1.0.1

- support rendering multiple copies of the map at low zoom levels
- ignore mouse events on deck.gl layer (temporary until picking support is implemented)

## 1.0.0

- initial release
