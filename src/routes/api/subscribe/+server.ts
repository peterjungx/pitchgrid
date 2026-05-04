import { json } from '@sveltejs/kit';

// Using process.env for Vercel compatibility (no PRIVATE_ prefix needed)
const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
const BREVO_LIST_ID = process.env.BREVO_LIST_ID?.trim();

export const POST = async ({ request }) => {
	if (!BREVO_API_KEY) {
		console.error('BREVO_API_KEY env var missing on Vercel');
		return json({ error: 'Server configuration error (key missing)' }, { status: 500 });
	}
	if (!BREVO_LIST_ID) {
		console.error('BREVO_LIST_ID env var missing on Vercel');
		return json({ error: 'Server configuration error (list ID missing)' }, { status: 500 });
	}
  try {
    const { email, name = '' } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Valid email is required' }, { status: 400 });
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        attributes: name ? { FIRSTNAME: name.trim() } : {},
        listIds: [parseInt(BREVO_LIST_ID)],
        updateEnabled: true
      }),
    });

    console.log('Brevo response status:', response.status);
    if (!response.ok && response.status !== 409) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Brevo error:', errorData);
      return json({ error: errorData.message || `Brevo error (${response.status})` }, { status: response.status });
    }

    return json({ success: true, message: 'Thank you for subscribing!' });
  } catch (err) {
    console.error('Brevo subscription error:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
