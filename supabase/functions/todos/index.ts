import { withSupabase } from "@supabase/server"

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    // ctx.supabase is the client scoped to the user's RLS rules
    const { data, error } = await ctx.supabase.from("todos").select()
    
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    
    return Response.json(data)
  }),
}
