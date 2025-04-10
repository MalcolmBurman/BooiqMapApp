import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "sonner";
import { PropertiesForm } from "./propertiesForm";

export function Maplibre() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawControlRef = useRef<MaplibreTerradrawControl | null>(null);
  const [featureData, setFeatureData] = useState<any>(null);

  useEffect(() => {
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

    const drawControl = new MaplibreTerradrawControl({
      modes: [
        "render",
        "point",
        "polygon",
        "rectangle",
        "freehand",
        "select",
        "delete-selection",
        "delete",
      ],
      open: true,
    });

    drawControlRef.current = drawControl;
    map.addControl(drawControl, "top-right");

    const drawInstance = drawControl.getTerraDrawInstance();

    const handleFinish = () => {
      const snapshot = drawInstance.getSnapshot();

      if (snapshot.length > 1 && drawInstance.getMode() !== "select") {
        setFeatureData(null);
        toast("Du kan bara spara en fastighet i taget");
        return;
      }

      if (snapshot.length > 0 && drawInstance.getMode() === "select") {
        setFeatureData([snapshot[0]]);
      }

      if (snapshot.length > 0 && drawInstance.getMode() !== "select") {
        setFeatureData(snapshot);
      }
    };

    drawInstance.on("finish", handleFinish);

    return () => {
      drawInstance.off("finish", handleFinish);
      map.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={mapContainerRef}
        style={{
          width: "98vw",
          height: "97vh",
          borderRadius: "1rem",
        }}
      />
      <PropertiesForm feature={featureData} />
    </>
  );
}
