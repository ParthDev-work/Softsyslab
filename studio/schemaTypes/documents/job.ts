import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Mirrors jobSchema in src/lib/content/schemas.ts — PRD section 23. Ships as
 * a template over an empty collection; a closed role publishes no route and
 * no JobPosting markup (enforced in src/lib/content/index.ts, not here).
 */
export const job = defineType({
  name: "job",
  title: "Job",
  type: "document",
  groups: [
    { name: "content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "role", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "jobId", type: "string", group: "content", validation: (rule) => rule.required().min(1) }),
    defineField({ name: "role", type: "string", group: "content", validation: (rule) => rule.required().min(2) }),
    defineField({
      name: "status",
      type: "string",
      group: "content",
      options: { list: ["open", "closed"], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "hiringOwner", type: "string", group: "content", validation: (rule) => rule.required().min(2) }),
    defineField({ name: "location", type: "string", group: "content", validation: (rule) => rule.required().min(2) }),
    defineField({
      name: "employmentType",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({ name: "validThrough", type: "date", group: "content", validation: (rule) => rule.required() }),
    defineField({
      name: "mission",
      type: "text",
      group: "content",
      rows: 4,
      validation: (rule) => rule.required().min(40),
    }),
    defineField({
      name: "responsibilities",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "requiredSkills",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "helpfulExperience",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "hiringStages",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "accessibilityAdjustments",
      type: "text",
      group: "content",
      rows: 3,
      validation: (rule) => rule.required().min(20),
    }),
    defineField({ name: "seo", type: "seo", group: "seo", validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: "role", subtitle: "status" } },
});
