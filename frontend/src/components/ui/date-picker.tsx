"use client";

import { CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useState } from "react";

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
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DatePicker({ id, date, setDate: setDate }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={value}
          placeholder="1/1/2025"
          className="bg-background w-[177px] pr-10 text-gray-500 shadow-none focus-visible:ring-1"
          onChange={(e) => {
            const inputValue = e.target.value;
            let date: Date;

            // Handle UK-based date format
            const ukDatePattern = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})\s*$/;
            const match = ukDatePattern.exec(inputValue) as
              | [string, string, string, string]
              | null;

            if (match) {
              const [, dayRaw, monthRaw, yearRaw] = match;
              date = new Date(
                `${yearRaw.padStart(4, "20")}-${monthRaw.padStart(2, "0")}-${dayRaw.padStart(2, "0")}`,
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
              timeZone="Europe/London"
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
