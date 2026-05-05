import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("config").collect();
    return rows[0] ?? null;
  },
});
