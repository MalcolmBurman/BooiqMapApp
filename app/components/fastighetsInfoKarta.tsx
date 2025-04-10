import { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FastighetsInfoRedigeraPolygon } from "./fastighetsInfoRedigeraPolygon";

export function FastighetsInfoKarta(props: any) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapUpdated, setMapUpdated] = useState(false);
  const [fastighet, setFastighet] = useState(props.fastighet);

  useEffect(() => {
    setTimeout(() => {
      if (props.isOpen == false) return;
      const map = new maplibregl.Map({
        container: mapContainerRef.current!,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "osm-layer",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center: [16.25, 63],
        zoom: 4,
      });

      mapRef.current = map;

      const fastigheter = JSON.parse(
        localStorage.getItem("properties") || "[]"
      );

      const index = fastigheter.findIndex(
        (f: { id: string }) => f.id === props.fastighet.id
      );

      const geoJsonData = fastigheter[index].mapObject[0];
      setFastighet(fastigheter[index]);

      setTimeout(() => {
        map.addLayer({
          id: "fastighet",
          type: "fill",
          source: {
            type: "geojson",
            data: geoJsonData,
          },
          paint: {
            "fill-color": "#0080ff",
            "fill-opacity": 0.5,
          },
        });

        const bounds = new maplibregl.LngLatBounds();

        geoJsonData.geometry.coordinates[0].forEach((coord: any) => {
          bounds.extend(coord);
        });

        map.fitBounds(bounds, {
          padding: 100,
        });
      }, 50);

      return () => {
        map.remove();
      };
    }, 50);
  }, [props.isOpen, mapUpdated]);

  return (
    <>
      <div
        ref={mapContainerRef}
        className="w-full h-full bg-gray-300 rounded-xl"
      />

      <div className="absolute bottom-4 left-4 z-10">
        <FastighetsInfoRedigeraPolygon
          fastighet={fastighet}
          onSave={() => setMapUpdated(!mapUpdated)}
        />
      </div>
    </>
  );
}
