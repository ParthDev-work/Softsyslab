import { defineField, defineType } from "sanity";

/** Mirrors seoSchema in src/lib/content/schemas.ts — keep both in sync. */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().min(10).max(70),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(70).max(170),
    }),
  ],
});
