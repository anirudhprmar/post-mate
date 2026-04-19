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
            <div className="flex flex-col items-center justify-center gap-5 mx-auto max-w-7xl px-6 py-30 lg:px-8">
                <div className="flex flex-col gap-4 text-center items-center justify-center">
                    <h1 className="text-5xl max-w-md text-center">Frequently Asked Questions</h1>
                    <p className="text-xl max-w-lg text-foreground/70">Everything you need to know about post mate.</p>
                </div>
                <div className='max-w-2xl w-full'>
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full gap-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className='text-lg'>Is it accessible?</AccordionTrigger>
                            <AccordionContent className='text-lg '>
                                Yes. It adheres to the WAI-ARIA design pattern.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className='text-lg'>Is it styled?</AccordionTrigger>
                            <AccordionContent className='text-lg'>
                                Yes. It comes with default styling that can be overridden.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className='text-lg'>Is it animated?</AccordionTrigger>
                            <AccordionContent className='text-lg'>
                                Yes. It uses a slide-down animation for the content.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
