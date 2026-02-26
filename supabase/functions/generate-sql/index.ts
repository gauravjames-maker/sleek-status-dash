import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { tables, relationships, naturalLanguageQuery, timeConstraint, resultLimit } = await req.json();

    const systemPrompt = `You are a SQL expert. Convert natural language queries to SQL. The available tables are: ${tables.join(", ")}. 
${relationships?.length > 0 ? `Configured relationships:\n${relationships.map((r: any) => `${r.leftTable}.${r.leftColumn} ${r.joinType} JOIN ${r.rightTable}.${r.rightColumn}`).join('\n')}` : ''}

IMPORTANT CONSTRAINTS:
1. Always include a date filter using the time range: ${timeConstraint}
2. Always add LIMIT ${resultLimit} at the end of the query
3. Use optimized tables when possible (customer_metrics for aggregations)
4. Avoid raw log tables
5. Use the configured relationships for JOINs when available

Only return the SQL query, nothing else.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `${naturalLanguageQuery}\n\nTime range: ${timeConstraint}\nResult limit: ${resultLimit}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const generatedSQL = data.choices[0].message.content.trim();

    // Clean up the SQL (remove markdown code blocks if present)
    const cleanSQL = generatedSQL
      .replace(/```sql\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return new Response(JSON.stringify({ sql: cleanSQL }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-sql error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
