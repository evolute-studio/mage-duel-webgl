import { NextResponse } from 'next/server';

const AXIOM_TOKEN = process.env.AXIOM_TOKEN;
const AXIOM_ORG_ID = process.env.AXIOM_ORG_ID;

// Debug logging
console.log('Axiom Configuration:', {
  hasToken: !!AXIOM_TOKEN,
  hasOrgId: !!AXIOM_ORG_ID,
  tokenLength: AXIOM_TOKEN?.length,
  orgIdLength: AXIOM_ORG_ID?.length,
});

if (!AXIOM_TOKEN || !AXIOM_ORG_ID) {
  console.error('Axiom credentials are not properly configured', {
    AXIOM_TOKEN,
    AXIOM_ORG_ID,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, data, type = 'event' } = body;

    if (!event) {
      return NextResponse.json({ error: 'Event is required' }, { status: 400 });
    }

    if (!AXIOM_TOKEN || !AXIOM_ORG_ID) {
      console.warn('Axiom is not configured, skipping log', {
        AXIOM_TOKEN,
        AXIOM_ORG_ID,
      });
      return NextResponse.json({ success: true });
    }

    const logData = {
      event,
      timestamp: new Date().toISOString(),
      type,
      ...data,
    };

    // Use the correct method for sending events
    const response = await fetch('https://api.axiom.co/v1/datasets/mageduel/ingest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AXIOM_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Axiom-Org-ID': AXIOM_ORG_ID,
      },
      body: JSON.stringify([logData]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Axiom API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Axiom API Error: ${response.status} ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging to Axiom:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 