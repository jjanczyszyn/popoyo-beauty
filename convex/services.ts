import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("services").collect();
    return rows
      .filter((s) => s.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});
