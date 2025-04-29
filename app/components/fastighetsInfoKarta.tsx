import { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FastighetsInfoRedigeraPolygon } from "./fastighetsInfoRedigeraPolygon";
import { toast } from "sonner";

export function FastighetsInfoKarta(props: any) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapUpdated, setMapUpdated] = useState(false);
  const [fastighet, setFastighet] = useState(props.fastighet);
  const fastighetRef = useRef(fastighet);
  const [addresses, setAddresses] = useState([]);
  const addressesRef = useRef(addresses);

  useEffect(() => {
    fastighetRef.current = fastighet;
    addressesRef.current = addresses;
  }, [fastighet, addresses]);

  const fetchAdresses = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/getAddresses/${props.fastighet.id}`
      );
      if (!res.ok) {
        toast("Ett fel uppstod vid laddning av adresser");
        return;
      }
      const json = await res.json();
      setAddresses(json.address);
      return;
    } catch (err) {
      return;
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/getProperty/${props.fastighet.id}`
      );
      if (!res.ok) {
        return;
      }
      const json = await res.json();
      setFastighet(json.property);
      return;
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (props.isOpen == false) return;
      fetchProperties();
      fetchAdresses();

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

      map.scrollZoom.disable();

      map.addControl(
        new maplibregl.NavigationControl({
          showZoom: true,
          showCompass: false,
        }),
        "bottom-right"
      );

      setTimeout(() => {
        const adresserGeoJsonData: any = [];

        addressesRef.current.forEach((address: any) => {
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

        const fastighetGeoJsonData = fastighetRef.current.mapObject[0];
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

            const coordinates = e.features?.[0]?.geometry?.coordinates?.slice();
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
      }, 80);

      return () => {
        map.remove();
      };
    }, 50);
  }, [props.isOpen, mapUpdated, props.mapState]);

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
          fastighet={fastighet}
          onSave={() => setMapUpdated(!mapUpdated)}
        />
      </div>
    </>
  );
}
