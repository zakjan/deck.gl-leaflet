import * as L from 'leaflet';
import type { Deck, DeckProps } from '@deck.gl/core';
import { createDeckInstance, updateDeckView } from './deck-utils.js';

export class LeafletLayer extends L.Layer {  
  #props: DeckProps;
  #container: HTMLDivElement | undefined = undefined;
  #deck: Deck | undefined = undefined;
  #animate: boolean | undefined = undefined;

  constructor(props: DeckProps) {
    super();

    this.#props = props;
  }

  onAdd(): this {
    let pane = this.getPane();
    if (!pane) {
      return this;
    }

    this.#container = L.DomUtil.create('div');
    this.#container.className = 'leaflet-layer';
    if (this.#getZoomAnimated()) {
      L.DomUtil.addClass(this.#container, 'leaflet-zoom-animated');
    }

    pane.appendChild(this.#container);
    this.#deck = createDeckInstance(this._map, this.#container, this.#deck, this.#props);
    this.#update();

    return this;
  }

  onRemove(_map: L.Map): this {
    if (!this.#container || !this.#deck) {
      return this;
    }

    L.DomUtil.remove(this.#container);
    this.#container = undefined;

    this.#deck.finalize();
    this.#deck = undefined;

    return this;
  }

  getEvents(): { [name: string]: L.LeafletEventHandlerFn } {
    return {
      viewreset: this.#reset,
      movestart: this.#onMoveStart,
      moveend: this.#onMoveEnd,
      zoomstart: this.#onZoomStart,
      zoom: this.#onZoom,
      zoomend: this.#onZoomEnd,
      ...(this.#getZoomAnimated() ? { zoomanim: this.#onAnimZoom as L.LeafletEventHandlerFn } : {}),
    };
  }

  setProps(props: DeckProps): void {
    Object.assign(this.#props, props);

    if (this.#deck) {
      this.#deck.setProps(props);
    }
  }

  pickObject(opts: Parameters<Deck['pickObject']>[0]): ReturnType<Deck['pickObject']> {
    if (!this.#deck) {
      return null;
    }

    return this.#deck.pickObject(opts);
  }

  pickMultipleObjects(opts: Parameters<Deck['pickMultipleObjects']>[0]): ReturnType<Deck['pickMultipleObjects']> {
    if (!this.#deck) {
      return [];
    }

    return this.#deck.pickMultipleObjects(opts);
  }

  pickObjects(opts: Parameters<Deck['pickObjects']>[0]): ReturnType<Deck['pickObjects']> {
    if (!this.#deck) {
      return [];
    }

    return this.#deck.pickObjects(opts);
  }

  #getMap(): L.Map & { _animatingZoom: boolean, _getMapPanePos: () => L.Point } {
    return (this as any)._map;
  }

  #getZoomAnimated(): boolean {
    return (this as any)._zoomAnimated;
  }

  #update(): void {
    if (!this.#container || !this.#deck) {
      return;
    }
    if (this.#getMap()._animatingZoom) {
      return;
    }

    const size = this.#getMap().getSize();
    this.#container.style.width = `${size.x}px`;
    this.#container.style.height = `${size.y}px`;

    // invert map position
    const offset = this.#getMap()._getMapPanePos().multiplyBy(-1);
    L.DomUtil.setPosition(this.#container, offset);

    updateDeckView(this.#deck, this._map);
  }

  #pauseAnimation(): void {
    if (!this.#deck) {
      return;
    }

    if (this.#deck.props._animate) {
      this.#animate = this.#deck.props._animate;
      this.#deck.setProps({ _animate: false });
    }
  }

  #unpauseAnimation(): void {
    if (!this.#deck) {
      return;
    }

    if (this.#animate) {
      this.#deck.setProps({ _animate: this.#animate });
      this.#animate = undefined;
    }
  }

  #reset(): void {
		this.#updateTransform(this.#getMap().getCenter(), this.#getMap().getZoom());
		this.#update();
  }

  #onMoveStart(): void {
    this.#pauseAnimation();
  }

  #onMoveEnd(): void {
    this.#update();
    this.#unpauseAnimation();
  }

  #onZoomStart(): void {
    this.#pauseAnimation();
  }

  #onAnimZoom(event: L.ZoomAnimEvent): void {
    this.#updateTransform(event.center, event.zoom);
  }

  #onZoom(): void {
    this.#updateTransform(this.#getMap().getCenter(), this.#getMap().getZoom());
  }

  #onZoomEnd(): void {
    this.#unpauseAnimation();
  }

  /**
   * see https://stackoverflow.com/a/67107000/1823988
   * see L.Renderer._updateTransform https://github.com/Leaflet/Leaflet/blob/master/src/layer/vector/Renderer.js#L90-L105
   */
  #updateTransform(center: L.LatLng, zoom: number): void {
    if (!this.#container) {
      return;
    }

    const scale = this.#getMap().getZoomScale(zoom, this.#getMap().getZoom());
    const position = L.DomUtil.getPosition(this.#container);
    const viewHalf = this.#getMap().getSize().multiplyBy(0.5);
    const currentCenterPoint = this.#getMap().project(this.#getMap().getCenter(), zoom);
    const destCenterPoint = this.#getMap().project(center, zoom);
    const centerOffset = destCenterPoint.subtract(currentCenterPoint);
    const topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

    if (L.Browser.any3d) {
      L.DomUtil.setTransform(this.#container, topLeftOffset, scale);
    } else {
      L.DomUtil.setPosition(this.#container, topLeftOffset);
    }
  }
}
