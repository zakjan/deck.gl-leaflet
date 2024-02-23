import type { Layer, Map } from 'leaflet';
import type { DeckProps } from '@deck.gl/core/lib/deck';

export class LeafletLayer extends Layer {
  public props: DeckProps;
  
  constructor(props: DeckProps);
  
  onAdd(): this;
  onRemove(_map: Map): this;
  getEvents(): { [key: string]: () => void };
  setProps(props: DeckProps): void;
  pickObject(params: any): any;
  pickMultipleObjects(params: any): any;
  pickObjects(params: any): any;
}
