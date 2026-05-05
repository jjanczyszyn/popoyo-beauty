import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("packages").collect();
    return rows
      .filter((p) => p.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});
