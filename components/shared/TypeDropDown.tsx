import React, { startTransition, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Category, {
  ICategory,
} from "@/lib/mongodb/database/models/category.model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import {
  createCategory,
  getAllCategories,
} from "@/lib/actions/category.actions";

type DropDownProps = {
  value?: string;
  onChangeHandler?: () => void;
};

const TypeDropDown = ({ onChangeHandler, value }: DropDownProps) => {
  const types = [
    {
      id: "1",
      name: "Regular",
    },
    {
      id: "2",
      name: "Pre-Recorded",
    },
  ];
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Event Type" />
      </SelectTrigger>
      <SelectContent>
        {types.length > 0 &&
          types.map((type) => (
            <SelectItem
              key={type.id}
              value={type.id}
              className="select-item p-regular-14"
            >
              {type.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default TypeDropDown;
