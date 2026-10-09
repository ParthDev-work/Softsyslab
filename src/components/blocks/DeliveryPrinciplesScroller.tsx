"use client";

import { ScrollSpyList, ScrollSpyItem } from "@/components/motion/ScrollSpy";

/**
 * Module 12 only: the sticky heading (`lg:sticky lg:top-36` on
 * `SectionHeading`, set in the page itself) already holds in place while
 * this column scrolls past it — that's plain CSS, no JS needed for the
 * "hold" itself. `ScrollSpyList`/`ScrollSpyItem` (shared with module 5's
 * value proposition) add the rest: whichever row is level with the
 * viewport's centre brightens as the column travels past the pinned
 * heading, and a brand-colored rail fills in beside the list to show how
 * far through you are. Once the last row clears, the column runs out of
 * extra height and the whole section scrolls away normally — no separate
 * "release" logic required, that's just where the sticky element's
 * containing block ends.
 */
export function DeliveryPrinciplesScroller({
  rows,
}: {
  rows: ReadonlyArray<{ title: string; body: string }>;
}) {
  return (
    <ScrollSpyList as="ul" className="list-none p-0">
      {({ progress, active }) =>
        rows.map((row, index) => (
          <ScrollSpyItem
            key={row.title}
            as="li"
            index={index}
            total={rows.length}
            progress={progress}
            active={active}
            className="grid gap-x-8 gap-y-2 border-t border-line py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"
          >
            <h3 className="text-h3 font-semibold">{row.title}</h3>
            <p className="text-[1.0625rem]/7 text-muted">{row.body}</p>
          </ScrollSpyItem>
        ))
      }
    </ScrollSpyList>
  );
}
