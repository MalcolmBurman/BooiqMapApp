import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function FastighetsInfoVariabler(props: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fastighet, setFastighet] = useState(props.fastighet);
  const [editValues, setEditValues] = useState({
    beteckning: fastighet.beteckning,
    fastighetsagare: fastighet.fastighetsagare,
    area: fastighet.area,
    byggar: fastighet.byggar,
  });

  function handleEdit() {
    const fastigheter = JSON.parse(localStorage.getItem("properties") || "[]");
    const id = fastighet.id;

    const index = fastigheter.findIndex((f: { id: string }) => f.id === id);

    if (index !== -1) {
      fastigheter[index] = {
        ...fastigheter[index],
        ...editValues,
      };

      localStorage.setItem("properties", JSON.stringify(fastigheter));
      setFastighet(fastigheter[index]);
      toast("Ändringar sparade");
    }
  }

  return (
    <div className="grid gap-4 py-4 ml-5 mr-5">
      <div>
        <Label className="font-bold">Beteckning</Label>
        <Label className="font-normal mt-3">{fastighet.beteckning}</Label>
      </div>

      <div className="mt-3">
        <Label className="font-bold">Fastighetsägare</Label>
        <Label className="font-normal mt-3">{fastighet.fastighetsagare}</Label>
      </div>

      <div className="mt-3">
        <Label className="font-bold">Area (m²)</Label>
        <Label className="font-normal mt-3">{fastighet.area}</Label>
      </div>

      <div className="mt-3">
        <Label className="font-bold">Byggår</Label>
        <Label className="font-normal mt-3">{fastighet.byggar}</Label>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-5 w-1/4">Redigera</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redigera fastighet</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label className="font-bold">Beteckning</Label>
              <Input
                className="mt-2"
                value={editValues.beteckning}
                onChange={(e) =>
                  setEditValues({ ...editValues, beteckning: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="font-bold">Fastighetsägare</Label>
              <Input
                className="mt-2"
                value={editValues.fastighetsagare}
                onChange={(e) =>
                  setEditValues({
                    ...editValues,
                    fastighetsagare: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="font-bold">Area (m²)</Label>
              <Input
                className="mt-2"
                value={editValues.area}
                onChange={(e) =>
                  setEditValues({ ...editValues, area: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="font-bold">Byggår</Label>
              <Input
                className="mt-2"
                value={editValues.byggar}
                onChange={(e) =>
                  setEditValues({ ...editValues, byggar: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                handleEdit();
                setIsDialogOpen(false);
              }}
            >
              Spara
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => setIsDialogOpen(false)}
            >
              Avbryt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
