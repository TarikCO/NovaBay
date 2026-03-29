import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-client@2'

serve(async (req) => {
  const { folio } = await req.json()
  
  // 1. Initialize Supabase inside the function
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 2. Get the property context from the View we created
  const { data: prop, error } = await supabase
    .from('property_ai_context')
    .select('*')
    .eq('folio', folio)
    .single()

  if (error || !prop) return new Response("Property not found", { status: 404 })

  // 3. Call Anthropic Claude
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
        content: `You are the NovaBay Resilience Expert. Analyze this property:
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
  return new Response(JSON.stringify(aiResult), {
    headers: { 'Content-Type': 'application/json' },
  })
})
