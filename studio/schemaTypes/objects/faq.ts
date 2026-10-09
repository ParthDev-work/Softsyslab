import { defineField, defineType } from "sanity";

/** Mirrors faqSchema in src/lib/content/schemas.ts. */
export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "question",
      type: "string",
      validation: (rule) => rule.required().min(8).max(200),
    }),
    defineField({
      name: "answer",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(20).max(1200),
    }),
  ],
  preview: { select: { title: "question" } },
});
