import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion"

const faqs = [
    {
        question: "What is Postmate?",
        answer: "Postmate is a content creation and posting tool that helps you create tailored content for different platform's taste and post content on multiple social media platforms all at the same time."
    },
    {
        question: "Why switch from Hootsuite or Buffer",
        answer: `These companies charge like $20-$100 per month for features most people never even use. Postmate focuses only on what matters : posting on all platforms from multiple accounts to grow on all platforms with internal tools to help you create better content. ${''}
        
        Also, for them you are just another user but for Postmate you are a person who matters. I Anirudh (founder) will take full responsibility to help you grow across social media. You are just a DM away for getting your problem solved.`
    },
    {
        question: "How is Postmate better than ChatGPT ?",
        answer: "It's a platform all about your content. You can manage your content, schedule it (which chatGPT can't do and manually will take forever to post the same thing to multiple accounts this hustle never ends), and much more giving a complete package for content ideation, management and scheduling."
    },
    {
        question: "What's included in Postmate's 7-days free trial?",
        answer: `Postmate's 7-day trial gives you full access to all features that plan offers. ${"\n\n"}A credit card is required to start your trial, but you won't be charged during the 7 days. We'll send you a reminder 3 days before your trial ends, and you can cancel anytime.`
    },
    {
        question: "What platforms does Postmate support?",
        answer: `Currently we support X, Instagram, LinkedIn, Threads & YouTube for scheduled posting and instant posting.${'\n\n'}If you have a request please feel free to email us at [app.postmate@gmail.com]`
    },
    {
        question: "Can Postmate help with personal branding as well as business?",
        answer: "Yes. Its built for the this purpose only. Its built to help you and your business to grow on social media."
    },
    {
        question: "Can i use Postmate on my phone?",
        answer: "Yes, but for a better experience it is recommended to use it on a desktop. "
    }
]

export default function FAQ() {
    return (
        <section className="mt-10 min-h-screen">
            <div className="flex flex-col items-center justify-center gap-5 mx-auto max-w-7xl px-6 py-30 lg:px-8 space-y-6">
                <div className="flex flex-col space-y-4 text-center items-center justify-center px-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">faq</p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl max-w-md text-center font-normal tracking-normal leading-relaxed">Frequently Asked Questions</h2>
                    <p className="text-base font-medium sm:text-lg md:text-xl max-w-lg text-foreground/50 mt-2">Everything you need to know about Postmate.</p>
                </div>
                <div className='max-w-3xl w-full'>
                    <Accordion type="single" collapsible className="w-full gap-1">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className='text-base sm:text-lg text-left'>{faq.question}</AccordionTrigger>
                                <AccordionContent className='text-sm sm:text-base whitespace-pre-wrap w-full text-muted-foreground'>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
