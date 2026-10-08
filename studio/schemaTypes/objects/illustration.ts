import { defineField, defineType } from "sanity";

/**
 * Mirrors illustrationSchema in src/lib/content/schemas.ts — PRD section 13:
 * illustrative visuals carry a visible label and are never case studies.
 * `label` is fixed; the app always renders the literal caption, so it is not
 * exposed as an editable field here.
 */
export const illustration = defineType({
  name: "illustration",
  title: "Illustration",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      type: "string",
      options: { list: ["workflow", "boundary", "layers"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      type: "string",
      validation: (rule) => rule.required().min(10),
    }),
    defineField({
      name: "steps",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(2),
    }),
  ],
  preview: { select: { title: "caption" } },
});
