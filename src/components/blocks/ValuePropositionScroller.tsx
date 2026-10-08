"use client";

import { ScrollSpyList, ScrollSpyItem } from "@/components/motion/ScrollSpy";

/**
 * Module 5 only: same pinned-heading + scroll-spied-rows pattern as module
 * 12's `DeliveryPrinciplesScroller` (see that file, and `ScrollSpy.tsx`,
 * for why the gating exists) — reused here rather than duplicated, with
 * each panel keeping its own bordered-card look instead of module 12's
 * flat ruled rows.
 */
export function ValuePropositionScroller({
  panels,
}: {
  panels: ReadonlyArray<{ title: string; body: string }>;
}) {
  return (
    <ScrollSpyList as="ul" className="grid min-w-0 list-none gap-3 p-0">
      {({ progress, active }) =>
        panels.map((panel, index) => (
          <ScrollSpyItem
            key={panel.title}
            as="li"
            index={index}
            total={panels.length}
            progress={progress}
            active={active}
            className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-card border border-hairline bg-canvas px-7 py-6 transition-[border-color,box-shadow] duration-200 hover:border-faint hover:shadow-raised sm:grid-cols-[minmax(0,8.75rem)_minmax(0,1fr)] motion-reduce:transition-none"
          >
            <h3 className="text-h4 font-semibold">{panel.title}</h3>
            <p className="text-body text-muted">{panel.body}</p>
          </ScrollSpyItem>
        ))
      }
    </ScrollSpyList>
  );
}
