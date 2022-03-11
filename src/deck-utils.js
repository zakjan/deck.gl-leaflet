import * as L from 'leaflet';
import { Deck } from '@deck.gl/core';

/** @typedef {import('@deck.gl/core/lib/deck').DeckProps} DeckProps */
/** @typedef {import('@deck.gl/core/lib/deck').ViewStateProps} ViewStateProps */

/**
 * @param {L.Map} map
 * @returns {ViewStateProps}
 */
function getViewState(map) {
  return {
    longitude: map.getCenter().lng,
    latitude: map.getCenter().lat,
    zoom: map.getZoom() - 1,
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
      style: { zIndex: 'auto' },
      viewState,
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
