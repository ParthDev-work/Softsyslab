import { defineArrayMember, defineField, defineType } from "sanity";

/** Mirrors solutionSchema in src/lib/content/schemas.ts — PRD section 15. */
export const solution = defineType({
  name: "solution",
  title: "Solution",
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
    defineField({ name: "h1", type: "string", group: "content", validation: (rule) => rule.required().min(5).max(80) }),
    defineField({
      name: "lead",
      type: "text",
      group: "content",
      rows: 5,
      validation: (rule) => rule.required().min(120).max(900),
    }),
    defineField({ name: "seo", type: "seo", group: "seo", validation: (rule) => rule.required() }),
    defineField({
      name: "currentState",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "sections",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "section" })],
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "roles",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "solutionRole",
          fields: [
            defineField({ name: "role", type: "string", validation: (rule) => rule.required().min(2) }),
            defineField({ name: "scope", type: "string", validation: (rule) => rule.required().min(15) }),
          ],
          preview: { select: { title: "role", subtitle: "scope" } },
        }),
      ],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "modules",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "integrations",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "dataAndSecurity",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "rollout",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "sampleFlow",
      type: "illustration",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "faqs",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "faq" })],
      validation: (rule) => rule.required().min(2).max(6),
    }),
    defineField({
      name: "related",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.required().min(2).max(4),
    }),
    defineField({
      name: "cta",
      type: "object",
      group: "content",
      fields: [defineField({ name: "label", type: "string", validation: (rule) => rule.required().min(4).max(48) })],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "h1" } },
});
