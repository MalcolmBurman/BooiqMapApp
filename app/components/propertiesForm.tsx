import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { FileUpload } from "./fileUpload";

export function PropertiesForm(props: any) {
  function handleSave() {
    const fastighetsagare = document.getElementById(
      "fastighetsagare"
    ) as HTMLInputElement;
    const beteckning = document.getElementById(
      "beteckning"
    ) as HTMLInputElement;
    const area = document.getElementById("area") as HTMLInputElement;
    const byggar = document.getElementById("byggar") as HTMLInputElement;

    const mapObject = props.feature;
    console.log(mapObject);

    if (!mapObject) {
      toast("Rita ut en fastighet på kartan");
      return;
    }

    const id = crypto.randomUUID();

    const propertyData = JSON.stringify({
      id: id,
      mapObject,
      fastighetsagare: fastighetsagare.value,
      beteckning: beteckning.value,
      area: area.value,
      byggar: byggar.value,
    });

    console.log(`Size in localStorage: ${new Blob([propertyData]).size} bytes`);
    console.log(propertyData);
    const existingProperties = localStorage.getItem("properties");
    const properties = existingProperties ? JSON.parse(existingProperties) : [];
    properties.push(JSON.parse(propertyData));
    localStorage.setItem("properties", JSON.stringify(properties));

    toast("Fastighet sparad");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={"outline"}
          className="absolute top-9 right-20"
          onClick={() => {}}
        >
          Spara
        </Button>
      </SheetTrigger>
      <SheetContent className="h-[95vh] rounded-xl m-auto mr-7">
        <SheetHeader>
          <SheetTitle>Spara fastighet</SheetTitle>
          <SheetDescription>Fyll i uppgifterna</SheetDescription>
        </SheetHeader>
        <Separator />

        <div className="grid gap-4 py-4 ml-5 mr-5 ">
          <Label>Beteckning</Label>
          <Input
            id="beteckning"
            type="text"
            placeholder="Stora gården 2:1"
            required
          />
        </div>
        <div className="grid gap-4 py-4 ml-5 mr-5 mt-[-1rem]">
          <Label>Fastighetsägare</Label>
          <Input
            id="fastighetsagare"
            type="text"
            placeholder="Fastighetsbolaget AB"
          />
        </div>

        <div className="grid gap-4 py-4 ml-5 mr-5 mt-[-1rem]">
          <Label>Area (m²)</Label>
          <Input id="area" type="text" placeholder="2000" />
        </div>

        <div className="grid gap-4 py-4 ml-5 mr-5 mt-[-1rem]">
          <Label>Byggår</Label>
          <Input id="byggar" type="text" placeholder="1997" />
        </div>
        <div className="min-h-40 max-h-80 overflow-y-auto grid gap-4  ml-5 mr-5">
          <FileUpload />
        </div>
        <Separator />
        <Button
          className="ml-5 mr-5 mt-2"
          onClick={() => {
            handleSave();
          }}
        >
          Spara
        </Button>
      </SheetContent>
    </Sheet>
  );
}
