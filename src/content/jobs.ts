import { jobSchema, type Job } from "@/lib/content/schemas";

/**
 * Open roles — PRD section 23.
 *
 * Deliberately empty. The careers page renders section 23's truthful empty state,
 * "There are no open roles listed at the moment", and collects no speculative CVs
 * because no approved process or retention policy exists yet.
 *
 * The job template ships as code and the route registry contributes a path per
 * open role, so adding a verified record publishes it with no routing change.
 * A record with status "closed" publishes no route and no JobPosting markup.
 */
const records: Job[] = [];

export const jobRecords: Job[] = records.map((record) => jobSchema.parse(record));

export const openJobs: Job[] = jobRecords.filter((job) => job.status === "open");
