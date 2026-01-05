import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, nteeCode, page = 0 } = await req.json();
    
    console.log(`Searching nonprofits: ZIP=${zipCode}, NTEE=${nteeCode}, page=${page}`);

    const url = new URL('https://projects.propublica.org/nonprofits/api/v2/search.json');
    url.searchParams.set('q', zipCode);
    if (nteeCode) {
      url.searchParams.set('ntee[id]', nteeCode);
    }
    url.searchParams.set('page', String(page));

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GiveLocal Donation Platform',
      },
    });

    if (!response.ok) {
      console.error(`ProPublica API error: ${response.status}`);
      throw new Error(`ProPublica API returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`Found ${data.organizations?.length || 0} organizations`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching nonprofits:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch nonprofits';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
