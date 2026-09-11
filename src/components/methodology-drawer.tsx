"use client";

import { CLUSTER } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BookOpen } from "lucide-react";

export function MethodologyDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full bg-white">
          <BookOpen className="h-4 w-4" />
          Sources & Methodology
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Sources & Methodology</SheetTitle>
          <SheetDescription>
            How this peer cluster is formed and how scores should be read in the PoC.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-5 overflow-y-auto px-4 pb-8">
          <section>
            <h3 className="text-sm font-semibold text-ssb-navy">Peer clustering</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{CLUSTER.methodology.note}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ssb-navy">
              {CLUSTER.methodology.inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-ssb-navy">Score construction</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Overall Store Effectiveness is an unweighted 0–100 composite of five attributes. Attribute scores
              combine operational metrics, mystery shopping, assortment coverage and fulfillment measures. In this
              PoC, values are illustrative and designed to be replaced by live APIs without changing the screens.
            </p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-ssb-navy">Benchmark colors</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><span className="font-medium text-ssb-blue">Blue</span> — Your store</li>
              <li><span className="font-medium text-ssb-grey">Grey</span> — Cluster average</li>
              <li><span className="font-medium text-ssb-green">Green</span> — Top stores (top 3 in cluster)</li>
              <li><span className="font-medium text-ssb-amber">Amber</span> — Opportunity</li>
              <li><span className="font-medium text-ssb-red">Red</span> — Needs attention</li>
            </ul>
          </section>
          <section className="rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
            <p>Data period: {CLUSTER.methodology.period}</p>
            <p>Last refresh: {CLUSTER.methodology.refreshed}</p>
            <p>Confidence: {CLUSTER.methodology.confidence}</p>
            <p className="mt-2">Market dollars and some competitor practices are labelled illustrative until calibrated with live Serta / retailer data.</p>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
