import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import * as turf from "@turf/turf";
import * as terraDraw from "terra-draw";

export function FastighetsInfoAddAdress(props: any) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawControlRef = useRef<MaplibreTerradrawControl | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSave() {
    const adress = document.getElementById("adress") as HTMLInputElement;
    const drawInstance = drawControlRef.current!.getTerraDrawInstance();
    const snapshot = drawInstance.getSnapshot();

    if (!adress.value) {
      toast("Fyll i adress");
      return;
    }

    const property_id = props.fastighet.id;

    const id = crypto.randomUUID();

    const newEntry = {
      id: id,
      property_id: property_id,
      adress: adress.value,
      mapObject: snapshot,
    };

    try {
      fetch("api/insertAddress", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });
    } catch (err) {}

    toast("Adress sparad");
    props.setAddresses((prev: any) => [...prev, newEntry]);
    setIsOpen(false);
    const newPoint = {
      id: newEntry.mapObject[0].id,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: newEntry.mapObject[0].geometry.coordinates,
      },
      properties: {
        description: newEntry.adress,
      },
    };

    const map = props.mainMap;
    if (map) {
      drawPointsOnMap(map, newPoint);
    }
  }

  function drawPointsOnMap(map: maplibregl.Map, point: any) {
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
  }

  useEffect(() => {
    setTimeout(() => {
      if (!isOpen) return;
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

      const drawControl = new MaplibreTerradrawControl({
        modes: ["select", "point"],
        open: true,
        modeOptions: {
          point: new terraDraw.TerraDrawPointMode({
            styles: {
              pointColor: "#7ED957",
              pointOutlineColor: "#FFFFFF",
              pointWidth: 10,
              pointOutlineWidth: 5,
            },
          }),
          select: new terraDraw.TerraDrawSelectMode({
            styles: {
              selectedPointColor: "#7ED957",
              selectedPointOutlineColor: "#FFFFFF",
              selectedPointWidth: 10,
              selectedPointOutlineWidth: 5,
            },
          }),
        },
      });

      drawControlRef.current = drawControl;
      map.addControl(drawControl);

      const controls = mapContainerRef.current?.querySelector(
        ".maplibregl-ctrl-top-right"
      );
      if (controls) {
        (controls as HTMLElement).style.display = "none";
      }

      setTimeout(() => {
        const geoJsonData =
          props.mapObjectAddress || props.fastighet.mapObject[0];

        map.addLayer({
          id: "fastighet",
          type: "fill",
          source: {
            type: "geojson",
            data: geoJsonData,
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
            data: geoJsonData,
          },
          paint: {
            "line-color": "#000000",
            "line-width": 3,
          },
        });

        const bounds = new maplibregl.LngLatBounds();

        geoJsonData.geometry.coordinates[0].forEach((coord: any) => {
          bounds.extend(coord);
        });

        const drawInstance = drawControl.getTerraDrawInstance();

        drawInstance.setMode("point");

        drawInstance.on("finish", () => {
          const snapshot: any = drawInstance.getSnapshot();

          if (!turf.booleanPointInPolygon(snapshot[0].geometry, geoJsonData)) {
            setTimeout(() => {
              drawInstance.clear();
              drawInstance.setMode("point");
            }, 0);
            toast("Adressen ska ligga inom fastigheten");
            return;
          }

          // implementera i framtid
          /* drawInstance.on("deselect", () => {
            const snapshot: any = drawInstance.getSnapshot();
            setTimeout(() => {
              drawInstance.selectFeature(snapshot[0].id);
            }, 0);
          }); */

          drawInstance.setMode("select");
          drawInstance.selectFeature(snapshot[0].id);
        });

        map.fitBounds(bounds, {
          padding: 100,
        });

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
        adresserGeoJsonData.forEach((point: any) => {
          drawPointsOnMap(map, point);
        });
      }, 50);

      return () => {
        map.remove();
      };
    }, 50);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Lägg till</Button>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: "80vw" }}>
        <DialogHeader>
          <DialogTitle>Lägg till adress</DialogTitle>
          <DialogDescription>
            Rita ut en punkt där adressen ska ligga.
          </DialogDescription>
        </DialogHeader>
        <div
          ref={mapContainerRef}
          className="w-full h-[60vh] rounded-lg bg-gray-300"
        />
        <div className="flex justify-start gap-2">
          <Input id="adress" placeholder="Grafikergatan 2a" className="w-1/4" />
          <Button onClick={handleSave}>Lägg till</Button>
          <Button variant={"outline"} onClick={() => setIsOpen(false)}>
            Avbryt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
