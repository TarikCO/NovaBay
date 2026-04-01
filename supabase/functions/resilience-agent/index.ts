import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS Preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { folio } = await req.json()
    
    // 2. Initialize Supabase Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Fetch property data from the view we created
    const { data: prop, error } = await supabase
      .from('property_ai_context')
      .select('*')
      .eq('folio', folio)
      .single()

    if (error || !prop) {
      return new Response(JSON.stringify({ error: "Property not found" }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // 4. Call Anthropic Claude 3.5 Sonnet
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `You are the NovaBay Resilience Expert. Analyze this property in Tampa:
          Address: ${prop.site_addr}
          Flood Zone: ${prop.zone_name} (${prop.risk_level} Risk)
          Year Built: ${prop.year_built}
          Stories: ${prop.stories}

          Provide:
          1. A "Resilience Score" (1-100).
          2. Three specific material recommendations based on Florida Building Code for this zone.
          3. One architectural change to mitigate flood risk.`
        }],
      }),
    })

    const aiResult = await response.json()

    // 5. Return the AI response to your frontend
    return new Response(JSON.stringify(aiResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})