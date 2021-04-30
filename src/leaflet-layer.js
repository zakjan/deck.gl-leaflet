import * as L from 'leaflet';
import { createDeckInstance, updateDeckView } from './deck-utils';

/** @typedef {import('deck.gl').Deck} Deck */
/** @typedef {import('deck.gl').DeckProps} DeckProps */

export default class LeafletLayer extends L.Layer {
  /** @type {L.Map | undefined} */
  _map = undefined;

  /** @type {HTMLElement | undefined} */
  _container = undefined;

  /** @type {Deck | undefined} */
  _deck = undefined;

  updateBound = this.update.bind(this);

  /**
   * @param {DeckProps} props
   */
  constructor(props) {
    super();

    this.props = props;
  }

  /**
   * @param {L.Map} map
   * @returns {this}
   */
  onAdd(map) {
    this._map = map;
    this._container = L.DomUtil.create('div');
    this._container.style.pointerEvents = 'none';
    this.getPane().appendChild(this._container);
    this._deck = createDeckInstance(this._map, this._container, this._deck, this.props);

    this._map.on('resize', this.updateBound);
    this._map.on('move', this.updateBound);
    this._map.on('zoom', this.updateBound);

    this.update();

    return this;
  }

  /**
   * @param {L.Map} _map
   * @returns {this}
   */
  onRemove(_map) {
    this._map.off('resize', this.updateBound);
    this._map.off('move', this.updateBound);
    this._map.off('zoom', this.updateBound);

    this._map = undefined;
    L.DomUtil.remove(this._container);
    this._container = undefined;
    this._deck.finalize();
    this._deck = undefined;

    return this;
  }

  /**
   * @param {DeckProps} props
   * @returns {void}
   */
  setProps(props) {
    Object.assign(this.props, props);

    if (this._deck) {
      this._deck.setProps(props);
    }
  }

  /**
   * @returns {void}
   */
  update() {
    this._container.style.width = `${this._map.getSize().x}px`;
    this._container.style.height = `${this._map.getSize().y}px`;

    // invert map position
    const offset = L.DomUtil.getPosition(this._map.getPanes().mapPane).multiplyBy(-1);
    L.DomUtil.setPosition(this._container, offset);

    updateDeckView(this._deck, this._map);
  }
}
