import {
    Map,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapZoomControl,
} from "@/components/ui/map"
<Map center={[43.6532, -79.3832]}>
    <MapTileLayer />
    <MapZoomControl />
    <MapMarker position={[43.6532, -79.3832]}>
        <MapPopup>A map component for shadcn/ui.</MapPopup>
    </MapMarker>
</Map>