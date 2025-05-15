import { useState, useEffect } from "react";
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
  useEffect(() => {
    setFastighet(props.fastighet);
    setEditValues({
      beteckning: props.fastighet.beteckning,
      fastighetsagare: props.fastighet.fastighetsagare,
      area: props.fastighet.area,
      byggar: props.fastighet.byggar,
    });
  }, [props.fastighet]);

  async function handleEdit() {
    const id = fastighet.id;

    try {
      const res = await fetch(`/api/updateProperty/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editValues),
      });

      if (!res.ok) {
        toast("Ett fel uppstod vid uppdatering av fastighet");
        return;
      }

      setFastighet({ ...fastighet, ...editValues });

      toast("Ändringar sparade");
      setIsDialogOpen(false);
      props.setTitle(editValues.beteckning);
      if (props.fetchProperties) {
        props.fetchProperties();
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast("Ett fel uppstod vid uppdatering av fastighet");
    }
  }

  return (
    <>
      <div className="grid gap-4 py-1 ml-5 mr-5 w-full pr-10">
        <div className="grid border rounded-sm p-2">
          <div className="flex gap-2 border-b p-4">
            <Label className="font-light">Beteckning:</Label>
            <Label>{fastighet.beteckning}</Label>
          </div>

          <div className="flex mt-3 gap-2 border-b p-4">
            <Label className="font-light">Fastighetsägare:</Label>
            <Label>{fastighet.fastighetsagare}</Label>
          </div>

          <div className="flex mt-3 gap-2 border-b p-4">
            <Label className="font-light">Area (m²):</Label>
            <Label>{fastighet.area}</Label>
          </div>

          <div className="flex mt-3 gap-2  p-4">
            <Label className="font-light">Byggår:</Label>
            <Label>{fastighet.byggar}</Label>
          </div>
        </div>
      </div>
      <div className="pb-4 ml-5 mr-5">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"}>Redigera</Button>
          </DialogTrigger>
          <DialogContent
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEdit();
              }
            }}
          >
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
                }}
              >
                Spara
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setIsDialogOpen(false);
                }}
              >
                Avbryt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
