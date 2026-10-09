import { defineField, defineType } from "sanity";

/**
 * Mirrors linkSchema in src/lib/content/schemas.ts. `href` is an internal
 * path only — lowercase, hyphenated, trailing slash (see internalPathSchema)
 * — never an external URL, matching the validator's cross-reference check
 * against the published-route registry.
 */
export const link = defineType({
  name: "link",
  title: "Related link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required().min(1).max(60),
    }),
    defineField({
      name: "href",
      type: "string",
      description: "Internal path, lowercase and hyphenated, e.g. /services/custom-software-development/",
      validation: (rule) =>
        rule
          .required()
          .regex(/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/, {
            name: "internal path",
          }),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});
