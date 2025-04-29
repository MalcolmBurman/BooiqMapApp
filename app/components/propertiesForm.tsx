import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { use, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { FileUpload } from "./fileUpload";
import { ScrollArea } from "../components/ui/scroll-area";

export function PropertiesForm(props: any) {
  const [isOpen, setIsOpen] = useState(false);

  function takeSnapshot() {
    const instance = props.drawControlRef.current?.getTerraDrawInstance();
    const snapshot = instance?.getSnapshot();
    return [snapshot[0]];
  }

  async function handleSave() {
    const beteckning = document.getElementById(
      "beteckning"
    ) as HTMLInputElement;
    if (!beteckning.value) {
      toast("Fyll i beteckning");
      return;
    }

    const fastighetsagare = document.getElementById(
      "fastighetsagare"
    ) as HTMLInputElement;
    const area = document.getElementById("area") as HTMLInputElement;
    const byggar = document.getElementById("byggar") as HTMLInputElement;

    const mapObject = takeSnapshot();

    const id = crypto.randomUUID();

    const propertyData = {
      id: id,
      mapObject,
      fastighetsagare: fastighetsagare.value,
      beteckning: beteckning.value,
      area: area.value,
      byggar: byggar.value,
    };

    try {
      const response = await fetch("http://localhost:3001/insertProperty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        setTimeout(() => {
          props.handleDelete();
        }, 300);
        props.fetchProperties();
        setIsOpen(false);
        toast("Fastighet sparad");
      } else {
        toast("Ett fel uppstod");
      }
    } catch (error) {
      console.error("Drizzle error:", error);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>Spara</Button>
      </SheetTrigger>
      <SheetContent
        className="h-[96vh] rounded-md m-auto mr-7"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSave();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle>Spara fastighet</SheetTitle>
          <SheetDescription>Fyll i uppgifterna</SheetDescription>
        </SheetHeader>
        <Separator />

        <ScrollArea className="flex-1 w-full overflow-auto">
          <div className="grid gap-4 ml-5 mr-5 pb-4">
            <Label>Beteckning</Label>
            <Input id="beteckning" type="text" placeholder="Stora gården 2:1" />
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
          <div className="  grid gap-4  ml-5 mr-5">
            <ScrollArea className="max-h-80">
              <FileUpload />
            </ScrollArea>
          </div>

          <Button
            className="ml-5 mt-2"
            onClick={() => {
              handleSave();
            }}
          >
            Spara
          </Button>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
