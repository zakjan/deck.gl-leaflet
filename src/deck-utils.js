import * as L from 'leaflet';
import { Deck } from 'deck.gl';

/** @typedef {import('deck.gl').DeckProps} DeckProps */
/** @typedef {import('@deck.gl/core/lib/deck').ViewStateProps} ViewStateProps */

/**
 * @param {L.Map} map
 * @returns {ViewStateProps}
 */
function getViewState(map) {
  const container = map.getContainer();
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  const bounds = map.getBounds();
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();
  const topRight = map.project(northEast);
  const bottomLeft = map.project(southWest);

  // compute fractional zoom
  const scale = height ? (bottomLeft.y - topRight.y) / height : 1;
  const zoom = Math.log2(scale || 1) + map.getZoom() - 1;

  return {
    longitude: map.getCenter().lng,
    latitude: map.getCenter().lat,
    zoom: zoom,
    pitch: 0,
    bearing: 0
  };
}

/**
 * @param {L.Map} map
 * @param {HTMLElement} container
 * @param {Deck} deck
 * @param {DeckProps} props
 * @returns {Deck}
 */
export function createDeckInstance(map, container, deck, props) {
  if (!deck) {
    const viewState = getViewState(map);
    deck = new Deck({
      ...props,
      parent: container,
      controller: false,
      viewState
    });
  }
  return deck;
}

/**
 * @param {Deck} deck
 * @param {L.Map} map
 */
export function updateDeckView(deck, map) {
  const viewState = getViewState(map);
  // console.log(viewState);

  deck.setProps({ viewState });
  deck.redraw(false);
}
