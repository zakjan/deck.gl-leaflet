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
  animateZoomBound = this.animateZoom.bind(this);

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
    this._container.className = 'leaflet-layer';
    this._container.style.pointerEvents = 'none';
    if (this._zoomAnimated) {
      L.DomUtil.addClass(this._container, 'leaflet-zoom-animated');
    }
    this.getPane().appendChild(this._container);

    this._deck = createDeckInstance(this._map, this._container, this._deck, this.props);

    this._map.on('resize', this.updateBound);
    this._map.on('move', this.updateBound);
    this._map.on('zoomanim', this.animateZoomBound);
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
    this._map.off('zoomanim', this.animateZoomBound);
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
    const offset = this._map._getMapPanePos().multiplyBy(-1);
    L.DomUtil.setPosition(this._container, offset);

    updateDeckView(this._deck, this._map);
  }

  /**
   * @param {L.ZoomAnimEvent} event
   * @returns {void}
   */
  animateZoom(event) {
    this.updateTransform(event.center, event.zoom);
  }

  /**
   * see https://stackoverflow.com/a/67107000/1823988
   * see L.Renderer._updateTransform https://github.com/Leaflet/Leaflet/blob/master/src/layer/vector/Renderer.js#L90-L105
   * @param {L.LatLng} center
   * @param {number} zoom
   */
  updateTransform(center, zoom) {
    var scale = this._map.getZoomScale(zoom, this._map.getZoom()),
        position = L.DomUtil.getPosition(this._container),
        viewHalf = this._map.getSize().multiplyBy(0.5),
        currentCenterPoint = this._map.project(this._map.getCenter(), zoom),
        destCenterPoint = this._map.project(center, zoom),
        centerOffset = destCenterPoint.subtract(currentCenterPoint),

        topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

    if (L.Browser.any3d) {
      L.DomUtil.setTransform(this._container, topLeftOffset, scale);
    } else {
      L.DomUtil.setPosition(this._container, topLeftOffset);
    }
  }
}
