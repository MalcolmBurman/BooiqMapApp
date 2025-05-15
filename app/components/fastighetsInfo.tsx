import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../components/ui/sheet";
import { useState, useEffect, use } from "react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { FileUpload } from "../components/fileUpload";
import { FastighetsInfoVariabler } from "./fastighetsInfoVariabler";
import { FastighetsInfoAdresser } from "./fastighetsInfoAdresser";
import { FastighetsInfoKarta } from "./fastighetsInfoKarta";
import { ScrollArea } from "../components/ui/scroll-area";
export function FastighetsInfo(props: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [mainMap, setMainMap] = useState(null);
  const [title, setTitle] = useState(props.fastighet.beteckning);
  const [addresses, setAddresses] = useState([]);
  const [mapObjectAddress, setMapObjectAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`/api/getAddresses/${props.fastighet.id}`);
      if (!res.ok) {
        return;
      }
      const json = await res.json();

      setAddresses(json.address.reverse());
      return;
    } catch (err) {
      return;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    fetchAddresses();
  }, [isOpen]);

  return (
    <Sheet
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
      <SheetTrigger asChild>
        <Button variant="link">{props.fastighet.beteckning}</Button>
      </SheetTrigger>
      <SheetContent
        className="h-[97vh]  rounded-sm m-auto mr-7 "
        style={{ maxWidth: "960px", minWidth: "600px" }}
      >
        <SheetHeader>
          <SheetTitle className="text-xl mb-[-1rem]">{title}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <Separator />

        <ScrollArea className="flex-1 w-full overflow-auto">
          <div className="grid gap-4 ml-5 mr-5 ">
            <Label className="font-bold">Specifikation</Label>
            <FastighetsInfoVariabler
              fastighet={props.fastighet}
              setTitle={setTitle}
            />
          </div>

          <Separator />

          <div className="grid gap-4 py-4 ml-5 mr-5 ">
            <div className="relative w-full h-[455px] mx-auto px-5">
              <FastighetsInfoKarta
                fastighet={props.fastighet}
                isOpen={isOpen}
                setMainMap={setMainMap}
                addresses={addresses}
                setMapObjectAddress={setMapObjectAddress}
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 pt-4 ml-5 mr-5 ">
            <Label className="font-bold">Adresser</Label>
            <FastighetsInfoAdresser
              fastighet={props.fastighet}
              mainMap={mainMap}
              forceNullDrawControl={true}
              setAddresses={setAddresses}
              addresses={addresses}
              mapObjectAddress={mapObjectAddress}
            />
          </div>

          <Separator />

          <div className="grid gap-4 pt-4 ml-5 mr-5 ">
            <Label className="font-bold">Filer</Label>
            <div className="px-5">
              <FileUpload />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
