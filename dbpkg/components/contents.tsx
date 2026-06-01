import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { translations } from "@/constants/translations";

interface ContentProps {
  locale: "en" | "id";
}

export const V1_1_0_Content = ({ locale }: ContentProps) => {
  const t = translations[locale].experience;

  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">{t.bcaRole}</h3>
          <p className="text-muted-foreground">{t.bcaCompany}</p>
        </div>
        <p className="text-sm">{t.bcaDesc1}</p>
        <p className="text-sm">{t.bcaDesc2}</p>
        <Accordion type="multiple" className="-mt-4 mb-0 w-full border-none">
          <AccordionItem value="item-1" className="bg-transparent">
            <AccordionTrigger className="px-0 hover:no-underline [&>svg]:size-6!">
              <Badge className="h-6 rounded-sm border-none bg-green-600/10 px-2 text-green-600 dark:bg-green-400/10 dark:text-green-400">
                {t.skills}
              </Badge>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <ul className="text-muted-foreground list-inside list-disc space-y-3 text-sm">
                <li>Python</li>
                <li>AI/ML</li>
                <li>Apache Kafka</li>
                <li>FastAPI</li>
                <li>Microsoft Azure</li>
                <li>REST API</li>
                <li>JMeter</li>
                <li>Docker</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export const V1_2_0_Content = ({ locale }: ContentProps) => {
  const t = translations[locale].experience;

  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">{t.petraRole}</h3>
          <p className="text-muted-foreground">{t.petraCompany}</p>
        </div>
        <p className="text-sm">{t.petraDesc1}</p>
        <p className="text-sm">{t.petraDesc2}</p>
        <Accordion type="multiple" className="-mt-4 mb-0 w-full border-none">
          <AccordionItem value="item-1" className="bg-transparent">
            <AccordionTrigger className="px-0 hover:no-underline [&>svg]:size-6!">
              <Badge className="h-6 rounded-sm border-none bg-green-600/10 px-2 text-green-600 dark:bg-green-400/10 dark:text-green-400">
                {t.skills}
              </Badge>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <ul className="text-muted-foreground list-inside list-disc space-y-3 text-sm">
                <li>Excel</li>
                <li>SQL</li>
                <li>Survey Design & Analysis</li>
                <li>Data Visualization</li>
                <li>Website Maintenance</li>
                <li>Problem Solving</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
