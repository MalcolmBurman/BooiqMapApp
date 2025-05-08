import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { FileUpload } from "../components/fileUpload";
import { FastighetsInfoVariabler } from "./fastighetsInfoVariabler";
import { FastighetsInfoAdresser } from "./fastighetsInfoAdresser";
import { ScrollArea } from "../components/ui/scroll-area";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
export function FastighetsInfoKartvy(props: any) {
  const [title, setTitle] = useState(props.fastighet.beteckning);

  useEffect(() => {
    setTitle(props.fastighet.beteckning);
  }, [props.fastighet.beteckning]);

  return (
    <Card
      className="m-auto mr-7 h-[96vh] rounded-sm absolute top-5 right-0"
      style={{ maxWidth: "960px", minWidth: "500px" }}
    >
      <CardHeader>
        <CardTitle className="text-xl mb-[-1rem] mt-[-0.5rem]">
          {title}
        </CardTitle>
      </CardHeader>

      <X
        className="absolute top-3 right-3 size-4 text-gray-600 hover:text-black transition-colors "
        onClick={() => {
          const prev = props.previousSelectedFeatureRef.current;
          if (prev?.id && props.mapRef.getLayer(prev.id)) {
            props.mapRef.setPaintProperty(prev.id, "fill-color", "#404040");
          }
          props.setSelectedFeature(null);
          props.previousSelectedFeatureRef.current = null;
        }}
      />

      <Separator />

      <ScrollArea className="flex-1 w-full overflow-auto">
        <div className="grid gap-4 ml-5 mr-5">
          <Label className="font-bold">Specifikation</Label>
          <FastighetsInfoVariabler
            fastighet={props.fastighet}
            setFastigheter={props.setFastigheter}
            fetchProperties={props.fetchProperties}
            setTitle={setTitle}
          />
        </div>

        <Separator />

        <div className="grid gap-4 pt-4 ml-5 mr-5">
          <Label className="font-bold">Adresser</Label>
          <FastighetsInfoAdresser
            fastighet={props.fastighet}
            drawControlRef={props.drawControlRef}
            setDrawingAddress={props.setDrawingAddress}
            fetchAddresses={props.fetchAddresses}
            mapRef={props.mapRef}
          />
        </div>

        <Separator />

        <div className="grid gap-4 pt-4 ml-5 mr-5">
          <Label className="font-bold">Filer</Label>
          <div className="px-5">
            <FileUpload />
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
