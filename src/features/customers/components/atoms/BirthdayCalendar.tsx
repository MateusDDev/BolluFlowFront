'use client'

import * as React from 'react'
import { ChevronDownIcon, DeleteIcon, RemoveFormattingIcon } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Calendar } from '@/shared/components/ui/calendar'
import { Label } from '@/shared/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/components/ui/popover'

type BirthdayCalendarProps = {
    date: Date | undefined
    setDateAction: (date: Date | undefined) => void
}

export function BirthdayCalendar({
    setDateAction,
    date,
}: BirthdayCalendarProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                Aniversário
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="flex w-48 items-center justify-between font-normal"
                    >
                        {date ? (
                            <>
                                <span className="flex-1 text-left">
                                    {date.toLocaleDateString()}
                                </span>

                                <span
                                    className="mr-2 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setDateAction(undefined)
                                    }}
                                    aria-label="Remover data de aniversário"
                                >
                                    <DeleteIcon className="h-4 w-4" />
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="flex-1 text-left">
                                    Selecionar data
                                </span>
                                <ChevronDownIcon />
                            </>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDateAction(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
