import { db } from "@workspace/db";
import { testimonialsTable as testimonials } from "@workspace/db/schema";
import { like } from "drizzle-orm";

async function main() {
  const rows = await db
    .update(testimonials)
    .set({ quote: "Trivinex Partners rebuilt our site in three weeks and conversions doubled." })
    .where(like(testimonials.quote, "%Craftloop%"))
    .returning({ id: testimonials.id });
  console.log("Updated rows:", rows.length);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
