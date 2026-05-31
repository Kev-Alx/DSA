import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const V1_1_0_Content = () => {
  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Data Engineer Intern</h3>
          <p className="text-muted-foreground">PT Bank Central Asia Tbk.</p>
        </div>

        <p className=" text-sm">
          Built real-time data pipelines using Apache Kafka and Python to handle
          high-throughput data streams.
        </p>
        <p className=" text-sm">
          Developed, Integrated, Tested and Deployed AI driven data processing
          pipeline service using FastAPI and Azure that converts unstructured
          data to structured data for legality requirements and better storage
          efficiency.
        </p>
        <Accordion
          type="multiple"
          className="-mt-4 mb-0 w-full border-none"
          defaultValue={["item-1"]}
        >
          <AccordionItem value="item-1" className="bg-transparent">
            <AccordionTrigger className="px-0 hover:no-underline [&>svg]:size-6!">
              <Badge className="h-6 rounded-sm border-none bg-green-600/10 px-2 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5">
                Skills
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

export const V1_2_0_Content = () => {
  return (
    <div>
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Data Team Member</h3>
          <p className="text-muted-foreground ">
            Tim Petra Sinergi, Petra Christian University
          </p>
        </div>

        <p className="text-sm">
          Designed and analyzed survey data for university events and programs,
          translating participant feedback into actionable insights to support
          evaluation and future planning.
        </p>

        <p className="text-sm">
          Managed and queried organizational data using Excel and SQL while
          contributing to the maintenance and development of new features for
          the Tim Petra Sinergi website.
        </p>
        <Accordion
          type="multiple"
          className="-mt-4 mb-0 w-full border-none"
          defaultValue={["item-1"]}
        >
          <AccordionItem value="item-1" className="bg-transparent">
            <AccordionTrigger className="px-0 hover:no-underline [&>svg]:size-6!">
              <Badge className="h-6 rounded-sm border-none bg-green-600/10 px-2 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5">
                Skills
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
