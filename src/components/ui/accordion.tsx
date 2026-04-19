"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "~/lib/utils"
import { ChevronDownIcon } from "lucide-react"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col group/faq ", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("bg-card rounded-md p-2", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "text-foreground transition-colors group-hover/faq:text-muted-foreground hover:text-foreground data-[state=open]:text-foreground group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-normal outline-none active:scale-100 disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 transition-transform duration-250 ease-out group-data-[state=open]/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="group/accordion-content grid text-sm transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
      {...props}
    >
      <div
        className={cn(
          "overflow-hidden pt-0 pb-2.5 opacity-0 translate-y-1.5 transition-[opacity,transform] duration-350 ease-out group-data-[state=open]/accordion-content:opacity-100 group-data-[state=open]/accordion-content:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
