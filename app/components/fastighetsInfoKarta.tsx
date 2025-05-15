import { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FastighetsInfoRedigeraPolygon } from "./fastighetsInfoRedigeraPolygon";

export function FastighetsInfoKarta(props: any) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapObject, setMapObject] = useState(null);
  const [mainMap, setMainMap] = useState<maplibregl.Map | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (props.isOpen == false) return;
      const map = new maplibregl.Map({
        container: mapContainerRef.current!,
        attributionControl: false,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [
                "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
              ],
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

      setMainMap(map);

      map.scrollZoom.disable();

      map.addControl(
        new maplibregl.NavigationControl({
          showZoom: true,
          showCompass: false,
        }),
        "bottom-right"
      );
      return () => {
        map.remove();
      };
    });
  }, [props.isOpen]);

  useEffect(() => {
    const map = mapRef.current!;
    if (!map) return;

    props.setMainMap(map);

    setTimeout(() => {
      const adresserGeoJsonData: any = [];

      props.addresses.forEach((address: any) => {
        const point = {
          id: address.mapObject[0].id,
          type: "Feature",

          geometry: {
            type: "Point",
            coordinates: address.mapObject[0].geometry.coordinates,
          },
          properties: {
            description: address.adress,
          },
        };

        adresserGeoJsonData.push(point);
      });

      let fastighetGeoJsonData: any;
      if (mapObject == null) {
        fastighetGeoJsonData = props.fastighet.mapObject[0];
      } else {
        fastighetGeoJsonData = mapObject;
      }
      if (map.getLayer("fastighet")) {
        map.removeLayer("fastighet");
        map.removeSource("fastighet");
      }

      if (map.getLayer("fastighet-outline")) {
        map.removeLayer("fastighet-outline");
        map.removeSource("fastighet-outline");
      }

      map.addLayer({
        id: "fastighet",
        type: "fill",
        source: {
          type: "geojson",
          data: fastighetGeoJsonData,
        },
        paint: {
          "fill-color": "#404040",
          "fill-opacity": 0.5,
        },
      });

      map.addLayer({
        id: "fastighet-outline",
        type: "line",
        source: {
          type: "geojson",
          data: fastighetGeoJsonData,
        },
        paint: {
          "line-color": "#000000",
          "line-width": 3,
        },
      });

      adresserGeoJsonData.forEach((point: any) => {
        if (map.getLayer(point.id)) {
          map.removeLayer(point.id);
          map.removeSource(point.id);
        }
        map.addLayer({
          id: point.id,
          type: "circle",
          source: {
            type: "geojson",
            data: point,
          },
          paint: {
            "circle-radius": 10,
            "circle-color": "#ff8880",
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 3,
          },
        });

        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: "custom-popup",
        });

        map.on("mouseenter", point.id, (e) => {
          map.getCanvas().style.cursor = "pointer";

          const geometry: any = e.features?.[0]?.geometry;

          const coordinates = geometry?.coordinates.slice();
          const props = e.features?.[0]?.properties;

          popup
            .setLngLat(coordinates)
            .setHTML(`${props?.description || "Ingen data"}`)
            .addTo(map);
        });

        map.on("mouseleave", point.id, () => {
          map.getCanvas().style.cursor = "";
          popup.remove();
        });
      });

      const bounds = new maplibregl.LngLatBounds();

      fastighetGeoJsonData.geometry.coordinates[0].forEach((coord: any) => {
        bounds.extend(coord);
      });

      map.fitBounds(bounds, {
        padding: 100,
      });
    }, 0);
  }, [props.isOpen, mapObject, mainMap, props.addresses]);

  return (
    <>
      <div className="relative w-full h-full">
        <div
          ref={mapContainerRef}
          className="w-full h-full bg-gray-300 rounded-lg"
        />
      </div>

      <div className="absolute bottom-1 left-6 z-10">
        <FastighetsInfoRedigeraPolygon
          fastighet={mapObject == null ? props.fastighet : mapObject}
          setMapObject={setMapObject}
          setMapObjectAddress={props.setMapObjectAddress}
        />
      </div>
    </>
  );
}
