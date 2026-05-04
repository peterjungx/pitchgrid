import { json } from '@sveltejs/kit';

// Using process.env for Vercel compatibility (no PRIVATE_ prefix needed)
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

if (!BREVO_API_KEY || !BREVO_LIST_ID) {
	console.error('Brevo env vars not configured');
}

export const POST = async ({ request }) => {
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

    if (response.ok || response.status === 409) { // 409 = already exists
      return json({ success: true, message: 'Thank you for subscribing!' });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return json({ error: errorData.message || 'Subscription failed' }, { status: response.status });
    }
  } catch (err) {
    console.error('Brevo subscription error:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
