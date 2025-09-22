import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const groqApiKey = Deno.env.get('GROQ_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, entryId, isTest = false } = await req.json();

    console.log('Analyzing journal entry:', { entryId, isTest, contentLength: content?.length });

    if (!content) {
      throw new Error('Content is required');
    }

    if (!groqApiKey) {
      throw new Error('Groq API key not configured');
    }

    const prompt = `ANALYZE_JOURNAL_ENTRY — RETURN ONLY JSON.

Analyze the journal entry below and return EXACTLY one JSON object (no surrounding text) with these fields and types:

{
  "themes": [ { "name": string, "confidence": number } ],
  "emotion": { "label": string, "confidence": number },
  "reflection": string,
  "crisis_flag": boolean,
  "evidence": [ string ],
  "confidence": number,
  "language": string
}

RULES:
1) Output must be STRICT JSON only. No extra keys, no commentary.
2) Up to TWO themes (broad labels like "work stress", "relationship conflict", "sleep", "self-esteem", "finances", "health").
3) One dominant emotion label (e.g., "anxious", "sad") with confidence.
4) reflection: empathic, non-diagnostic, non-judgemental. 1–2 sentences, <=40 words.
5) If explicit self-harm/suicidal language is present, set crisis_flag = true and return a single safety sentence: "I'm sorry you're feeling this way. If you're in immediate danger please contact local emergency services or a crisis hotline now."
6) evidence: exact substrings copied from the entry (up to 3 snippets).
7) confidences must be decimals 0.00–1.00 with two decimals.
8) Return language code in "language".
9) Do not output internal reasoning.

INPUT JOURNAL ENTRY:
"""${content}"""`;

    console.log('Sending request to Groq...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status} ${errorText}`);
    }

    const groqData = await response.json();
    console.log('Groq response received:', groqData);

    const aiContent = groqData.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error('No content in Groq response');
    }

    // If this is just a test, return the raw response
    if (isTest) {
      return new Response(JSON.stringify({ raw_response: aiContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the AI response
    let analysisData;
    try {
      analysisData = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error('Invalid JSON response from AI');
    }

    // Update the journal entry with analysis results
    if (entryId) {
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({
          themes: analysisData.themes || [],
          emotion: analysisData.emotion || {},
          reflection: analysisData.reflection || '',
          evidence: analysisData.evidence || [],
          crisis_flag: analysisData.crisis_flag || false,
          confidence: analysisData.confidence || 0.00,
          language: analysisData.language || 'en',
          raw_ai_output: aiContent,
          status: 'complete'
        })
        .eq('id', entryId);

      if (updateError) {
        console.error('Failed to update journal entry:', updateError);
        throw new Error('Failed to update journal entry');
      }
    }

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-journal function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});