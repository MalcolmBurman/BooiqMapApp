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

        const [addedFeature]: any = drawInstance.addFeatures([geoJsonData]);

        drawInstance.selectFeature(addedFeature.id);

        drawInstance.on("deselect", () => {
          setTimeout(() => {
            drawInstance.selectFeature(addedFeature.id);
          }, 50);
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
  }, [isOpen]);

  async function handleEdit() {
    const drawInstance = drawControlRef.current!.getTerraDrawInstance();
    const snapshot = drawInstance.getSnapshot();

    try {
      const response = await fetch(
        `http://localhost:3001/updateProperty/${props.fastighet.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mapObject: [snapshot[0]],
          }),
        }
      );

      if (response.ok) {
        toast("Ändringar sparade");
        props.onSave();
      } else {
        toast("Kunde inte uppdatera fastighet");
      }
    } catch (error) {
      console.error("Drizzle error:", error);
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
        <Button className="mb-1" variant={"outline"}>
          Redigera
        </Button>
      </DialogTrigger>
      <DialogContent style={{ maxWidth: "70vw" }}>
        <DialogHeader>
          <DialogTitle>Redigera fastighet</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Redigera fastigheten genom att klicka och dra i punkterna.
        </DialogDescription>
        <div ref={mapContainerRef} className="w-full h-[60vh] rounded-lg" />
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
