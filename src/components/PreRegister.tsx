import { useState, type FormEvent } from 'react';

// Public access key from web3forms.com (safe to commit: it can only send to Hanna's inbox).
// While this is still the placeholder, the sign-up block stays hidden.
const WEB3FORMS_ACCESS_KEY = '419241bc-3bb9-4082-8a2e-f50842225a45';

// 254 is the maximum length of a valid email address, so no real address is cut off.
const MAX_EMAIL_LENGTH = 254;
// Minimum gap between submissions from the same browser.
const COOLDOWN_MS = 60_000;
const COOLDOWN_KEY = 'preregister-last-submit';

type Status = 'idle' | 'sending' | 'done' | 'error' | 'cooldown';

function lastSubmitTime(): number {
  try {
    return Number(localStorage.getItem(COOLDOWN_KEY)) || 0;
  } catch {
    return 0;
  }
}

const PreRegister = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // Honeypot: real visitors never tick this hidden box.
    if ((form.elements.namedItem('botcheck') as HTMLInputElement | null)?.checked) return;
    if (email.length > MAX_EMAIL_LENGTH) return;
    if (Date.now() - lastSubmitTime() < COOLDOWN_MS) {
      setStatus('cooldown');
      return;
    }

    setStatus('sending');
    try {
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {
        // Storage can be blocked; the cooldown is a convenience, so carry on.
      }
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'CPH Food Files: new review pre-registration',
          from_name: 'cphfoodfiles.dk',
          email,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'done' : 'error');
      if (data.success) setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mb-7 max-w-[460px]">
      {status === 'done' ? (
        <p className="m-0 font-bold" role="status">
          Thanks, you're on the list.
        </p>
      ) : (
        <>
          <p className="m-0 mb-2.5">
            Should I start writing reviews? Pre-register if you'd like to receive those.
          </p>
          <form onSubmit={handleSubmit} className="flex">
            <label htmlFor="preregister-email" className="sr-only">
              Email address
            </label>
            <input
              id="preregister-email"
              type="email"
              required
              maxLength={MAX_EMAIL_LENGTH}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'sending'}
              className="min-w-0 flex-1 h-9 border border-r-0 border-black bg-white px-2.5 text-sm placeholder:text-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
            />
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="border border-black bg-[#00B3E1] h-9 px-3 text-sm font-normal tracking-wide text-black transition-colors hover:bg-accent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
            >
              {status === 'sending' ? 'SENDING...' : 'SEND'}
            </button>
          </form>
          <p className="text-label m-0 mt-2" role="status">
            {status === 'cooldown'
              ? 'Please wait a minute before trying again.'
              : status === 'error'
                ? 'Something went wrong. Please try again.'
                : 'Only used to send you reviews.'}
          </p>
        </>
      )}
    </div>
  );
};

export default PreRegister;
