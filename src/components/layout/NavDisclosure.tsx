"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { NavItem, NavSection } from "@/components/layout/nav-model";

/**
 * PRD section 12: click and keyboard activation are the contract and hover is
 * an enhancement; Escape closes and restores focus; Tab follows normal document
 * order; ordinary site navigation does not take application-menu ARIA roles.
 *
 * So this is a disclosure — a button with aria-expanded controlling a list of
 * ordinary links — not a menu widget with roving focus. Screen-reader users get
 * a list of links, which is what the thing actually is.
 */
function useDisclosure(closeOnRouteChange = true) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  /* Close on navigation by adjusting state during render rather than in an
     effect: the menu must already be closed in the frame that shows the new
     page, and an effect would render it open first. */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (closeOnRouteChange && pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Escape restores focus to the control that opened the disclosure.
      triggerRef.current?.focus();
    }

    function onPointerDown(event: PointerEvent) {
      const node = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(node)) {
        setOpen(false);
      }
    }

    function onFocusIn(event: FocusEvent) {
      const node = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  return { open, setOpen, containerRef, triggerRef };
}

const chevron = (
  <svg
    viewBox="0 0 16 16"
    aria-hidden="true"
    className="size-4 shrink-0 transition-transform duration-150 group-aria-expanded:rotate-180 motion-reduce:transition-none"
    fill="currentColor"
  >
    <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

/** The Company group in the desktop utility row. */
export function NavGroup({ section }: { section: NavSection }) {
  const { open, setOpen, containerRef, triggerRef } = useDisclosure();
  const panelId = useId();
  const pathname = usePathname();
  const active =
    pathname === section.href ||
    (section.children?.some((child) => pathname === child.href) ?? false);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "group relative flex min-h-11 items-center gap-1.5 px-2 text-body hover:text-brand",
          active ? "font-semibold text-brand" : "text-muted",
        )}
      >
        {section.label}
        {chevron}
        <NavUnderline active={active} />
      </button>
      <ul
        id={panelId}
        hidden={!open}
        className="absolute right-0 top-full z-30 mt-1 w-64 rounded-card border border-line bg-canvas p-2 shadow-raised"
      >
        <li>
          <NavLink href={section.href} label={`${section.label} overview`} inPanel />
        </li>
        {section.children?.map((child) => (
          <li key={child.href}>
            <NavLink href={child.href} label={child.label} inPanel />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NavLink({
  href,
  label,
  inPanel = false,
}: NavItem & { inPanel?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-h-11 items-center rounded-control px-2 text-body hover:text-brand",
        inPanel && "hover:bg-surface",
        active ? "font-semibold text-brand" : "text-muted",
      )}
    >
      {label}
      {/* The panel's own links (mobile list, dropdown list) read state by
          position and hover background already; the underline is the
          top-row treatment only. */}
      {!inPanel ? <NavUnderline active={active} /> : null}
    </Link>
  );
}

/**
 * Animated active/hover indicator for the top-row nav controls. A scaled
 * span rather than a border so it never shifts layout, and `scaleX` is a
 * transform so the existing global reduced-motion block (which zeroes every
 * transition duration) neutralises it for free.
 */
function NavUnderline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-2 bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-brand transition-transform duration-150 motion-reduce:transition-none",
        "group-hover:scale-x-100",
        active && "scale-x-100",
      )}
    />
  );
}

/**
 * Mobile navigation. Section 12 requires every published destination to remain
 * reachable here, and section 13 requires the button to announce expanded state.
 */
export function MobileMenu({
  sections,
  cta,
}: {
  sections: NavSection[];
  cta: NavItem;
}) {
  const { open, setOpen, containerRef, triggerRef } = useDisclosure();
  const panelId = useId();

  return (
    <div ref={containerRef} className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 min-w-11 items-center gap-2 rounded-control border border-line px-3 text-body font-semibold text-anchor"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-5" fill="currentColor">
          {open ? (
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
          ) : (
            <path d="M2 4.25A.75.75 0 0 1 2.75 3.5h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.25Zm0 3.75a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm.75 3a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H2.75Z" />
          )}
        </svg>
        Menu
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-canvas px-4 pb-6 pt-2 shadow-raised"
      >
        <ul className="divide-y divide-line">
          {sections.map((section) => (
            <li key={section.href} className="py-1">
              <NavLink href={section.href} label={section.label} />
              {section.children && section.children.length > 0 ? (
                <ul className="ml-4 border-l border-line pl-3">
                  {section.children.map((child) => (
                    <li key={child.href}>
                      <NavLink href={child.href} label={child.label} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        <Link
          href={cta.href}
          className="mt-4 flex min-h-12 w-full items-center justify-center rounded-control bg-brand px-5 font-semibold text-white hover:bg-brand-hover"
        >
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
