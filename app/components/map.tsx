import { useEffect, useRef, useState } from "react";
import maplibregl, { type Feature } from "maplibre-gl";
import { MaplibreTerradrawControl } from "@watergis/maplibre-gl-terradraw";
import "@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { PropertiesForm } from "./propertiesForm";
import { Button } from "./ui/button";
import { FastighetsInfoKartvy } from "./fastighetsInfokartvy";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./ui/card";
import { PenLine } from "lucide-react";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { Input } from "./ui/input";
import * as terraDraw from "terra-draw";
import * as turf from "@turf/turf";
import { pointOnFeature } from "@turf/turf";

export function Maplibre() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawControlRef = useRef<MaplibreTerradrawControl | null>(null);
  const [drawnFeature, setDrawnFeature] = useState<boolean>(false);
  const [drawnAdress, setDrawnAdress] = useState<boolean>(false);
  const [drawingFeature, setDrawingFeature] = useState<boolean>(false);
  const [drawingAdress, setDrawingAdress] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [fastigheter, setFastigheter] = useState<any>([]);
  const [addresses, setAddresses] = useState<any>([]);
  const drawingFeatureRef = useRef(drawingFeature);
  const drawnFeatureRef = useRef(drawnFeature);
  const drawingAdressRef = useRef(drawingAdress);
  const drawnAdressRef = useRef(drawnAdress);
  const selectedFeatureRef = useRef(selectedFeature);
  const fastigheterRef = useRef(fastigheter);
  const addressesRef = useRef(addresses);
  const previousSelectedFeatureRef = useRef<number | null>(null);
  const popupListenersRef = useRef<Set<string>>(new Set());
  const pointLayerIdsRef = useRef<string[]>([]);

  const fetchProperties = async () => {
    try {
      const res = await fetch("http://localhost:3001/getProperties");
      const json = await res.json();
      setFastigheter(json.properties);
      return;
    } catch (err) {
      return;
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`http://localhost:3001/getAddresses`);
      if (!res.ok) {
        return;
      }
      const json = await res.json();
      setAddresses(json.addresses);
      return;
    } catch (err) {
      return;
    }
  };

  //Uppdaterar statevariabler
  useEffect(() => {
    drawingFeatureRef.current = drawingFeature;
    drawnFeatureRef.current = drawnFeature;
    drawingAdressRef.current = drawingAdress;
    drawnAdressRef.current = drawnAdress;
    selectedFeatureRef.current = selectedFeature;
    fastigheterRef.current = fastigheter;
    addressesRef.current = addresses;
  }, [
    drawingFeature,
    drawnFeature,
    drawingAdress,
    drawnAdress,
    selectedFeature,
    fastigheter,
    addresses,
  ]);

  //Initierar kartan
  useEffect(() => {
    fetchProperties();
    fetchAddresses();

    //Cool 3D buildings!
    /*
    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      attributionControl: false,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [17.1383, 60.674],
      zoom: 15,
    });
    */

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", // "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
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
      center: [17.1383, 60.674], // [16.25, 63]
      zoom: 15,
    });

    mapRef.current = map;

    const drawControl = new MaplibreTerradrawControl({
      modes: ["polygon", "select", "point"],
      open: true,
      modeOptions: {
        polygon: new terraDraw.TerraDrawPolygonMode({
          keyEvents: null,
        }),
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

    const drawInstance = drawControl.getTerraDrawInstance();

    const handleFinish = () => {
      const snapshot = drawInstance.getSnapshot();

      if (
        drawingFeatureRef.current ||
        drawnFeatureRef.current ||
        drawingAdressRef.current ||
        drawnAdressRef.current
      ) {
        drawInstance.on("deselect", () => {
          setTimeout(() => {
            if (snapshot[0].id) {
              drawInstance.selectFeature(snapshot[0].id);
            }
          }, 0);
        });
      }

      if (
        snapshot.length > 0 &&
        drawInstance.getMode() !== "select" &&
        !drawingAdressRef.current &&
        !drawnAdressRef.current
      ) {
        drawInstance.setMode("select");
        if (snapshot[0].id) {
          drawInstance.selectFeature(snapshot[0].id);
        }
        setDrawnFeature(true);
        setDrawingFeature(false);
      }

      if (drawingAdressRef.current || drawnAdressRef.current) {
        if (
          !turf.booleanPointInPolygon(
            pointOnFeature(snapshot[0].geometry),
            selectedFeatureRef.current.mapObject[0]
          )
        ) {
          drawInstance.clear();
          setTimeout(() => {
            drawInstance.clear();
            drawInstance.setMode("point");
            setDrawnAdress(false);
            setDrawingAdress(true);
          }, 50);
          return;
        }

        if (snapshot.length > 0 && drawInstance.getMode() !== "select") {
          drawInstance.setMode("select");
          if (snapshot[0].id) {
            drawInstance.selectFeature(snapshot[0].id);
          }
          setDrawingAdress(false);
          setDrawnAdress(true);
        }
      }
    };

    drawInstance.on("finish", handleFinish);

    return () => {
      drawInstance.off("finish", handleFinish);
      map.remove();
    };
  }, []);

  //Hanterar att rita fastigheter
  function handleDraw() {
    const instance = drawControlRef.current?.getTerraDrawInstance();
    if (drawingFeature) {
      instance?.setMode("select");
      setDrawingFeature(false);
      previousSelectedFeatureRef.current = null;
    } else {
      setSelectedFeature(null);
      setTimeout(() => instance?.setMode("polygon"), 100);
      setDrawingFeature(true);
    }
  }

  //Hanterar att återställa allt
  function handleDelete() {
    setDrawnAdress(false);
    setDrawnFeature(false);
    previousSelectedFeatureRef.current = null;
    const instance = drawControlRef.current?.getTerraDrawInstance();
    instance?.clear();
  }

  //Ritar adresser på kartan
  function drawPointsOnMap(map: maplibregl.Map, point: any) {
    if (!map.getLayer(point.id)) {
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

      pointLayerIdsRef.current.push(point.id);
    }

    if (!popupListenersRef.current.has(point.id)) {
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: "custom-popup",
      });

      map.on("mouseenter", point.id, (e) => {
        map.getCanvas().style.cursor = "pointer";

        const coordinates = e.features?.[0]?.geometry?.coordinates.slice();
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

      popupListenersRef.current.add(point.id);
    }
  }

  //Ritar fastigheter på kartan
  function drawFeaturesOnMap(map: maplibregl.Map, fastigheter: any[]) {
    fastigheter.forEach((fastighet: any) => {
      const layerId = fastighet.id;
      if (map.getLayer(layerId) && layerId !== selectedFeature?.id) {
        return;
      }

      map.addLayer({
        id: layerId,
        type: "fill",
        source: {
          type: "geojson",
          data: fastighet.mapObject[0],
        },
        paint: {
          "fill-color": "#404040",
          "fill-opacity": 0.5,
        },
      });

      map.addLayer({
        id: `${layerId}-outline`,
        type: "line",
        source: {
          type: "geojson",
          data: fastighet.mapObject[0],
        },
        paint: {
          "line-color": "#000000",
          "line-width": 3,
        },
      });

      map.on("click", layerId, (e) => {
        if (
          drawingFeatureRef.current ||
          drawnFeatureRef.current ||
          drawingAdressRef.current ||
          drawnAdressRef.current
        )
          return;

        const featureId = e.features?.[0]?.layer?.id;
        const fastighetSelected = fastigheter.find(
          (f: { id: string }) => f.id === featureId
        );
        if (!fastighet) return;

        if (fastighetSelected === previousSelectedFeatureRef.current) return;
        previousSelectedFeatureRef.current = fastighetSelected;

        pointLayerIdsRef.current.forEach((layerId) => {
          if (!map.getLayer(layerId)) return;
          map.removeLayer(layerId);
          map.removeSource(layerId);
        });
        pointLayerIdsRef.current.length = 0;

        setSelectedFeature(fastighetSelected);

        const filteredAdresser = addressesRef.current.filter(
          (adress: { property_id: string }) => adress.property_id === featureId
        );

        const adresserGeoJsonData = filteredAdresser.map((address: any) => ({
          id: address.mapObject[0].id,
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: address.mapObject[0].geometry.coordinates,
          },
          properties: {
            description: address.adress,
          },
        }));
        adresserGeoJsonData.forEach((point: any) => {
          drawPointsOnMap(map, point);
        });
      });
    });
  }

  //Rita om kartan
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      drawFeaturesOnMap(map, fastigheter);
    } else {
      map.once("load", () => {
        drawFeaturesOnMap(map, fastigheter);
      });
    }
  }, [fastigheter]);

  // ESC hantering
  useEffect(() => {
    const drawInstance = drawControlRef.current?.getTerraDrawInstance();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (drawingFeatureRef.current === true) {
          setDrawingFeature(false);
          drawInstance?.setMode("select");
          previousSelectedFeatureRef.current = null;
        }
        if (drawingAdressRef.current === true) {
          setDrawingAdress(false);
          drawInstance?.setMode("select");
        }
        if (
          drawingFeatureRef.current === false &&
          drawnFeatureRef.current === false &&
          drawingAdressRef.current === false &&
          drawnAdressRef.current === false
        ) {
          setSelectedFeature(null);
          previousSelectedFeatureRef.current = null;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  //Lägga till adress
  async function handleSaveAdress() {
    const adress = document.getElementById("adress") as HTMLInputElement;
    if (!adress.value) {
      toast("Fyll i adress");
      return;
    }
    const drawInstance = drawControlRef.current!.getTerraDrawInstance();
    const snapshot = drawInstance.getSnapshot();

    const property_id = selectedFeature.id;

    const id = crypto.randomUUID();

    const newEntry = {
      id: id,
      property_id: property_id,
      adress: adress.value,
      mapObject: snapshot,
    };

    try {
      const res = await fetch("http://localhost:3001/insertAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (err) {}

    setDrawnAdress(false);
    drawInstance.setMode("select");
    handleDelete();
    toast("Adress sparad");

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

    const map = mapRef.current;
    if (map) {
      drawPointsOnMap(map, newPoint);
    }
  }

  //Ta bort adress på icke valda fastigheter
  useEffect(() => {
    const map = mapRef.current;
    if (selectedFeature === null && map) {
      pointLayerIdsRef.current.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
          map.removeSource(layerId);
        }
        setDrawingAdress(false);
        setDrawnAdress(false);
        const instance = drawControlRef.current?.getTerraDrawInstance();
        instance?.setMode("select");
        instance?.clear();
      });
      pointLayerIdsRef.current.length = 0;
    }
  }, [selectedFeature]);

  return (
    <>
      <div
        ref={mapContainerRef}
        style={{
          width: "98vw",
          height: "97vh",
          borderRadius: "0.7rem",
        }}
      />

      <Button
        disabled={drawnFeature || drawingAdress || drawnAdress}
        onClick={handleDraw}
        className={`absolute top-9 left-57 ${
          drawingFeature ? "hover:bg-red-600 bg-green-600" : "bg-primary"
        } `}
      >
        <PenLine />
        Rita ny fastighet
      </Button>

      {/*Rita fastighet*/}
      {(drawingFeature || drawnFeature) && (
        <Card className="absolute top-25 left-9 shadow-md drop-shadow-lg">
          <CardHeader>
            <CardTitle>
              {drawingFeature ? "Att rita en fastighet" : "Ritad fastighet"}
            </CardTitle>
            <CardDescription>
              {drawingFeature ? (
                <>
                  Rita fastigheten genom att klicka ut hörnen på kartan.
                  <br />
                  När du är klar, avsluta genom att klicka på en av de blå
                  punkterna.
                </>
              ) : (
                <>
                  Du kan nu redigera fastigheten genom att klicka och dra i
                  punkterna.
                </>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex  w-102 ">
            <div className="flex gap-2">
              {drawingFeature ? (
                <>
                  <Info className="absolute bottom-3 right-3 size-6" />
                </>
              ) : (
                <>
                  <PropertiesForm
                    handleDelete={handleDelete}
                    fastigheter={fastigheter}
                    setFastigheter={setFastigheter}
                    drawControlRef={drawControlRef}
                    fetchProperties={fetchProperties}
                  />
                  <Button variant="destructive" onClick={handleDelete}>
                    Radera
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/*Rita adress*/}
      {(drawingAdress || drawnAdress) && (
        <Card className="absolute top-25 left-9 shadow-md drop-shadow-lg">
          <CardHeader>
            <CardTitle>
              {drawingAdress ? "Att rita en adress" : "Ritad adress"}
            </CardTitle>
            <CardDescription>
              {drawingAdress ? (
                <>
                  Rita ut en punkt där adressen ska ligga. <br />
                  (kom ihåg att lägga den inom fastigheten)
                </>
              ) : (
                <>Du kan flytta på adressen genom att dra den.</>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent
            className="flex  w-102 "
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveAdress();
              }
            }}
          >
            <div className="flex gap-2">
              {drawingAdress ? (
                <>
                  <Info className="absolute bottom-3 right-3 size-6" />
                </>
              ) : (
                <>
                  <Input
                    id="adress"
                    placeholder="Grafikergatan 2a"
                    className=""
                  />
                  <div className="flex justify-start gap-2">
                    <Button onClick={handleSaveAdress}>Spara</Button>

                    <Button variant="destructive" onClick={handleDelete}>
                      Radera
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFeature !== null && !(drawnAdress || drawingAdress) && (
        <FastighetsInfoKartvy
          fastighet={selectedFeature}
          fastigheter={fastigheter}
          setSelectedFeature={setSelectedFeature}
          drawControlRef={drawControlRef}
          setDrawingAdress={setDrawingAdress}
          previousSelectedFeatureRef={previousSelectedFeatureRef}
          setFastigheter={setFastigheter}
          fetchProperties={fetchProperties}
          fetchAddresses={fetchAddresses}
          mapRef={mapRef.current}
        />
      )}
    </>
  );
}
