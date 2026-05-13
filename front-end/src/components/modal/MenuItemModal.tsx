"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectDropDown } from "../Select";
import { Textarea } from "../ui/textarea";

export function MenuItemModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="xllite"
          className="px-5 font-semibold cursor-pointer rounded-lg text-white bg-orange-500 hover:bg-orange-600"
        >
          + Add item
        </Button>
      </DialogTrigger>

      <DialogContent className="p-6">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-3xl font-semibold text-[#1A3C6B]">
            Add menu item
          </DialogTitle>
          <DialogDescription>
            Add a new dish to your kitchen menu
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="dish" className="mb-2">
              Dish name
            </Label>
            <Input id="dish" placeholder="e.g. Palak paneer + roti" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="mb-2">
                Price (₹)
              </Label>
              <Input type="number" id="price" placeholder="90" />
            </div>
            <div>
              <Label className="mb-2">Meal type</Label>
              <SelectDropDown
                options={[
                  { label: "Vegetarian", value: "veg" },
                  { label: "Non-Vegetarian", value: "nonveg" },
                ]}
                placeholder="Meal type"
                emptyText="No meal type"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Description
            </Label>
            <Textarea className="resize-none max-h-20 ring-0!" id="description" placeholder="Short description of the dish..." />
          </div>

          <Button
            size="xllite"
            className="w-full text-base px-6 cursor-pointer rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 hover:-translate-y-0.5 transition"
          >
            Add to menu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
