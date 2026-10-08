import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Mirrors corporatePageSchema in src/lib/content/schemas.ts — company,
 * how-we-work, engagement-models, support, security and similar pages.
 */
export const corporatePage = defineType({
  name: "corporatePage",
  title: "Corporate page",
  type: "document",
  groups: [
    { name: "content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "h1", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "path",
      type: "string",
      description: "Full route, lowercase/hyphenated, leading and trailing slash, e.g. /how-we-work/.",
      validation: (rule) =>
        rule.required().regex(/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/, { name: "internal path" }),
    }),
    defineField({ name: "h1", type: "string", group: "content", validation: (rule) => rule.required().min(5).max(90) }),
    defineField({
      name: "lead",
      type: "text",
      group: "content",
      rows: 5,
      validation: (rule) => rule.required().min(80).max(900),
    }),
    defineField({ name: "seo", type: "seo", group: "seo", validation: (rule) => rule.required() }),
    defineField({
      name: "sections",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "section" })],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "faqs",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "faq" })],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "related",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "cta",
      type: "object",
      group: "content",
      fields: [defineField({ name: "label", type: "string", validation: (rule) => rule.required().min(4).max(48) })],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "h1", subtitle: "path" } },
});
