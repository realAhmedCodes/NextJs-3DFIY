import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function ModelDetails({ model }) {
  return (
    <div className="mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="description">
          <AccordionTrigger>Description</AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-600">{model.description}</p>
          </AccordionContent>
        </AccordionItem>
        {model.specifications && (
          <AccordionItem value="specifications">
            <AccordionTrigger>Specifications</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">{model.specifications}</p>
            </AccordionContent>
          </AccordionItem>
        )}
        {model.formats && (
          <AccordionItem value="formats">
            <AccordionTrigger>Formats</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">{model.formats}</p>
            </AccordionContent>
          </AccordionItem>
        )}
        {model.tags && model.tags.length > 0 && (
          <AccordionItem value="tags">
            <AccordionTrigger>Tags</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="font-medium text-gray-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}

