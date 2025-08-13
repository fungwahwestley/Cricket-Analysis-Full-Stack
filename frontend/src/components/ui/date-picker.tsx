"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-UK");
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

interface DatePickerProps {
  id: string;
}

export function DatePicker({ id }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 0, 1),
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={value}
          placeholder="1/1/2025"
          className="bg-background pr-10 text-gray-500 shadow-none focus-visible:ring-1"
          onChange={(e) => {
            const inputValue = e.target.value;
            let date: Date;

            // Handle UK-based date format
            const ukDatePattern = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})\s*$/;
            const match = inputValue.match(ukDatePattern) as
              | [string, string, string, string]
              | null;

            if (match) {
              const [_, day, month, year] = match;
              date = new Date(
                parseInt(year.length === 2 ? `20${year}` : year),
                parseInt(month) - 1,
                parseInt(day),
              );
            } else {
              date = new Date(inputValue);
            }
            setValue(e.target.value);
            if (isValidDate(date)) {
              setDate(date);
              setMonth(date);
            }
          }}
          onClick={() => {
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              <CalendarIcon className="size-3.5 text-gray-400" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
            }}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
            }}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                setValue(formatDate(date));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
