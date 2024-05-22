import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Balancer from "react-wrap-balancer";

export function FAQ() {
  return (
    <div className="mt-32 flex w-full max-w-2xl flex-col items-center justify-center px-5 xl:px-0">
      <div className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]">
        <Balancer>FAQ</Balancer>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How do I use it?</AccordionTrigger>
          <AccordionContent>
            {`First, you have to sign in / sign up by clicking on the "Sign in" button on the top right. Then, you can buy credits by clicking on your user icon in the top right. You can now upload
              an image to see how well you age!`}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Is it safe? Can I delete my account?
          </AccordionTrigger>
          <AccordionContent>
            {`Yes, we don't share your data or images with any third parties. Furthermore, you can delete your account by clicking on the user icon in the top right at any time. This will remove all data and images for your account. `}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Do you offer a free trial?</AccordionTrigger>
          <AccordionContent>
            {`We do not currently offer a free trial.`}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
