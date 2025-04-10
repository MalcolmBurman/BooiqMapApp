import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { use, useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { FileUpload } from "../components/fileUpload";
import { FastighetsInfoVariabler } from "./fastighetsInfoVariabler";
import { FastighetsInfoAdresser } from "./fastighetsInfoAdresser";
import { FastighetsInfoKarta } from "./fastighetsInfoKarta";
export function FastighetsInfo(props: any) {
  const [isOpen, setIsOpen] = useState(false);
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
        className="h-[95vh]  rounded-xl m-auto mr-7"
        style={{ maxWidth: "50vw" }}
      >
        <SheetHeader>
          <SheetTitle>Sparad fastighet</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex">
          <div className="w-1/2 border-r">
            <div className="grid gap-4 pt-4 ml-5 mr-5 ">
              <Label className="font-bold">Specifikation</Label>
              <FastighetsInfoVariabler fastighet={props.fastighet} />
            </div>
          </div>
          <div className="relative w-45/100 h-[400px] mx-auto">
            <FastighetsInfoKarta fastighet={props.fastighet} isOpen={isOpen} />
          </div>
        </div>
        <Separator />
        <div className="flex">
          <div className="w-1/2 border-r">
            <div className="grid gap-4 pt-4 ml-5 mr-5 ">
              <Label className="font-bold">Adresser</Label>
              <FastighetsInfoAdresser fastighet={props.fastighet} />
            </div>
          </div>
          <div className="w-1/2 ">
            <div className="grid gap-4 pt-4 ml-5 mr-5 ">
              <Label className="font-bold">Filer</Label>
              <div className="max-h-80 overflow-y-auto min-h-80">
                <FileUpload />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
