import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import * as terraDraw from "@watergis/maplibre-gl-terradraw";

export function FastighetsInfoRedigeraPolygon(props: any) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawControlRef = useRef<MaplibreTerradrawControl | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!isOpen) return;
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
        modes: ["select", "polygon"],
        open: true,
      });

      drawControlRef.current = drawControl;
      map.addControl(drawControl);

      const controls = mapContainerRef.current?.querySelector(
        ".maplibregl-ctrl-top-right"
      );
      if (controls) {
        (controls as HTMLElement).style.display = "none";
      }

      const geoJsonData = props.fastighet.mapObject[0];

      setTimeout(() => {
        const drawInstance = drawControl.getTerraDrawInstance();

        const [addedFeature] = drawInstance.addFeatures([geoJsonData]);

        drawInstance.selectFeature(addedFeature.id);

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
  }, [isOpen]);

  function handleEdit() {
    const drawInstance = drawControlRef.current?.getTerraDrawInstance();
    const snapshot = drawInstance.getSnapshot();

    const id = props.fastighet.id;

    const fastigheter = JSON.parse(localStorage.getItem("properties") || "[]");

    const index = fastigheter.findIndex((f: { id: string }) => f.id === id);

    if (index !== -1) {
      fastigheter[index].mapObject = [snapshot[0]];

      localStorage.setItem("properties", JSON.stringify(fastigheter));
      toast("Ändringar sparade");

      props.onSave();
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setTimeout(() => {
            props.onRefresh?.();
          }, 400);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Redigera</Button>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: "51vw" }}>
        <DialogHeader>
          <DialogTitle>Redigera fastighet</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Redigera fastigheten genom att klicka och dra i punkterna.
        </DialogDescription>
        <div ref={mapContainerRef} className="w-full h-[60vh] rounded-xl" />
        <div className="flex gap-2">
          <Button
            onClick={() => {
              handleEdit();
              setIsOpen(false);
            }}
          >
            Spara
          </Button>
          <Button variant={"destructive"} onClick={() => setIsOpen(false)}>
            Avbryt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
