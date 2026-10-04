import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const faqs = [
  {
    question: "What is Postmate?",
    answer:
      "Postmate is a content creation and posting tool that helps you create tailored content for different platform's taste and post content on multiple social media platforms all at the same time.",
  },
  {
    question: "How is Postmate better than ChatGPT ?",
    answer:
      "It's a platform all about your content. You can manage your content, schedule it (which chatGPT can't do and manually will take forever to post the same thing to multiple accounts this hustle never ends), and much more giving a complete package for content ideation, management and scheduling.",
  },
  {
    question: "What platforms does Postmate support?",
    answer: `Currently we support X, Instagram, LinkedIn, Threads & YouTube for scheduled posting and instant posting.${"\n\n"}If you have a request please feel free to email us at [app.postmate@gmail.com]`,
  },
  {
    question: "Can Postmate help with personal branding as well as business?",
    answer:
      "Yes. Its built for the this purpose only. Its built to help you and your business to grow on social media.",
  },
  {
    question: "Can i use Postmate on my phone?",
    answer:
      "Yes, but for a better experience it is recommended to use it on a desktop. ",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="mt-10 min-h-screen scroll-mt-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 space-y-6 px-6 py-30 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="max-w-md text-center text-3xl leading-relaxed font-normal tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="w-full max-w-3xl">
          <Accordion type="single" collapsible className="w-full gap-1">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left text-base sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground w-full text-sm whitespace-pre-wrap sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
