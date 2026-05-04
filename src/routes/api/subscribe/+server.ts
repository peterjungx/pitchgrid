import { json } from '@sveltejs/kit';
import { BREVO_API_KEY, BREVO_LIST_ID } from '$env/dynamic/private';

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
