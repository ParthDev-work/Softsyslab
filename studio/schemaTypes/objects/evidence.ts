import { defineField, defineType } from "sanity";

/**
 * Mirrors evidenceSchema in src/lib/content/schemas.ts — PRD section 17: a
 * claim about company capability needs an accountable record, not just a
 * marketing line.
 */
export const evidence = defineType({
  name: "evidence",
  title: "Evidence",
  type: "object",
  fields: [
    defineField({
      name: "claim",
      type: "string",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "sourceReference",
      type: "string",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "owner",
      type: "string",
      description: "Person or role accountable for this claim.",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "verificationDate",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "permissionStatus",
      type: "string",
      options: {
        list: ["granted", "internal-only", "pending"],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "expiresAt",
      type: "date",
      description: "Leave empty if this evidence does not expire.",
    }),
  ],
  preview: { select: { title: "claim", subtitle: "owner" } },
});
