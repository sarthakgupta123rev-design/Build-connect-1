declare namespace L {
  type Map = any;
  type LayerGroup = any;
  type LeafletMouseEvent = any;
}

declare module 'leaflet' {
  const L: any;
  export default L;
}
