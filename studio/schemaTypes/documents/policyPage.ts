import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Mirrors policyPageSchema in src/lib/content/schemas.ts — PRD section 25.
 *
 * `counselReviewOutstanding` is deliberately not an editable field here. The
 * PRD requires this build to publish a content specification, never legal
 * prose standing in for one, and that guarantee must not be something an
 * editor can toggle off from the Studio. The app's CMS source always reports
 * it as `true`; removing that guarantee is a code change, not a content edit.
 */
export const policyPage = defineType({
  name: "policyPage",
  title: "Policy page",
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
      description: "Full route, lowercase/hyphenated, leading and trailing slash, e.g. /privacy/.",
      validation: (rule) =>
        rule.required().regex(/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/, { name: "internal path" }),
    }),
    defineField({ name: "h1", type: "string", group: "content", validation: (rule) => rule.required().min(5).max(90) }),
    defineField({
      name: "lead",
      type: "text",
      group: "content",
      rows: 4,
      validation: (rule) => rule.required().min(60).max(600),
    }),
    defineField({ name: "seo", type: "seo", group: "seo", validation: (rule) => rule.required() }),
    defineField({
      name: "requiredSections",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "requiredSection",
          fields: [
            defineField({ name: "heading", type: "string", validation: (rule) => rule.required().min(3) }),
            defineField({
              name: "id",
              title: "Anchor ID",
              type: "string",
              validation: (rule) =>
                rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: "anchor id" }),
            }),
            defineField({
              name: "inputs",
              title: "Inputs needed",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
      validation: (rule) => rule.required().min(4),
    }),
    defineField({
      name: "related",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: { select: { title: "h1", subtitle: "path" } },
});
