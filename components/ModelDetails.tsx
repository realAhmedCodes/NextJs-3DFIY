import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

export default function ModelDetails({ model }) {
  return (
    <div className="mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="description">
          <AccordionTrigger className="text-lg">Description</AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-600">{model.description}</p>
          </AccordionContent>
        </AccordionItem>
        {model.specifications && (
          <AccordionItem value="specifications">
            <AccordionTrigger className="text-lg">
              Specifications
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">{model.specifications}</p>
            </AccordionContent>
          </AccordionItem>
        )}
        {model.formats && (
          <AccordionItem value="formats">
            <AccordionTrigger className="text-lg">Formats</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">{model.formats}</p>
            </AccordionContent>
          </AccordionItem>
        )}
        {model.tags && model.tags.length > 0 && (
          <AccordionItem value="tags">
            <AccordionTrigger className="text-lg">Tags</AccordionTrigger>
            <AccordionContent>
              {model.tags.slice(0, 7).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="font-medium text-gray-800"
                >
                  {tag}
                </Badge>
              ))}

              {model.tags.length > 7 && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Badge
                      key="extra-badge"
                      className="font-medium cursor-pointer"
                    >
                      +{model.tags.length - 7}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-white p-4 rounded-md shadow-lg z-50">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Additional Tags
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {model.tags.slice(7).map((extraTag, index) => (
                          <Badge
                            key="extra-badge"
                            variant="secondary"
                            className="font-medium text-gray-800"
                          >
                            {extraTag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
