import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Mirrors caseStudySchema in src/lib/content/schemas.ts — PRD section 18.
 * Ships as a template over an empty collection: this type existing with zero
 * published documents is the expected state until real client work is
 * approved for publication.
 */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
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
    defineField({ name: "h1", type: "string", group: "content", validation: (rule) => rule.required().min(5) }),
    defineField({ name: "seo", type: "seo", group: "seo", validation: (rule) => rule.required() }),
    defineField({
      name: "client",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "attribution", type: "string", validation: (rule) => rule.required().min(2) }),
        defineField({
          name: "permission",
          type: "string",
          options: { list: ["named", "anonymized"] },
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "industry", type: "string", group: "content", validation: (rule) => rule.required().min(2) }),
    defineField({
      name: "problem",
      type: "text",
      group: "content",
      rows: 4,
      validation: (rule) => rule.required().min(40),
    }),
    defineField({
      name: "approach",
      type: "text",
      group: "content",
      rows: 4,
      validation: (rule) => rule.required().min(40),
    }),
    defineField({
      name: "stack",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "duration", type: "string", group: "content", validation: (rule) => rule.required().min(2) }),
    defineField({
      name: "outcome",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "evidence" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "related",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { select: { title: "h1", subtitle: "industry" } },
});
