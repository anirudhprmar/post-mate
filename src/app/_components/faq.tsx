import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion"

export default function FAQ() {
    return (
        <section className="mt-10 min-h-screen">
            <div className="flex items-start justify-between mx-auto max-w-7xl px-6 py-30 lg:px-8">
                <div className="flex flex-col gap-4">
                    <h1 className="text-6xl max-w-xl">Frequently Asked Questions</h1>
                    <p className="text-xl max-w-lg">Everything you need to know about post mate.</p>
                </div>
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                            Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is it styled?</AccordionTrigger>
                        <AccordionContent>
                            Yes. It comes with default styling that can be overridden.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is it animated?</AccordionTrigger>
                        <AccordionContent>
                            Yes. It uses a slide-down animation for the content.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    )
}
