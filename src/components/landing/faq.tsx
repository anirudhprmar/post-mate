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
    question: "Why switch from Hootsuite or Buffer",
    answer: `These companies charge like $20-$100 per month for features most people never even use. Postmate focuses only on what matters : posting on all platforms from multiple accounts to grow on all platforms with internal tools to help you create better content. ${""}
        
        Also, for them you are just another user but for Postmate you are a person who matters. I Anirudh (founder) will take full responsibility to help you grow across social media. You are just a DM away for getting your problem solved.`,
  },
  {
    question: "How is Postmate better than ChatGPT ?",
    answer:
      "It's a platform all about your content. You can manage your content, schedule it (which chatGPT can't do and manually will take forever to post the same thing to multiple accounts this hustle never ends), and much more giving a complete package for content ideation, management and scheduling.",
  },
  {
    question: "What's included in Postmate's 7-days free trial?",
    answer: `Postmate's 7-day trial gives you full access to all features that plan offers. ${"\n\n"}A credit card is required to start your trial, but you won't be charged during the 7 days. We'll send you a reminder 3 days before your trial ends, and you can cancel anytime.`,
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
    <section className="mt-10 min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 space-y-6 px-6 py-30 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <p className="text-primary/70 text-xs font-semibold tracking-widest uppercase">
            faq
          </p>
          <h2 className="max-w-md text-center text-3xl leading-relaxed font-normal tracking-normal sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground/50 mt-2 max-w-lg text-base font-medium sm:text-lg md:text-xl">
            Everything you need to know about Postmate.
          </p>
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
