import { defineField, defineType } from "sanity";

/**
 * Mirrors sectionSchema in src/lib/content/schemas.ts. `body` is plain
 * paragraphs, not rich text — the site renders them as plain text, never as
 * HTML, so there is deliberately no block-content field here.
 */
export const section = defineType({
  name: "section",
  title: "Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "id",
      title: "Anchor ID",
      type: "string",
      description: "Lowercase and hyphenated, e.g. workflow-discovery.",
      validation: (rule) =>
        rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: "anchor id" }),
    }),
    defineField({
      name: "body",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "points",
      title: "Bulleted points",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: { select: { title: "heading" } },
});
