import { FormEvent, useState } from 'react';
import { isValidEmail } from '../lib/emailValidation';

export function EmailCapture({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError('Введите корректный адрес электронной почты.');
      setSubmitted(false);
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return (
    <form className={compact ? 'email-form compact' : 'email-form'} onSubmit={handleSubmit} noValidate>
      <label className="sr-only" htmlFor={compact ? 'footer-email' : 'cta-email'}>Адрес электронной почты</label>
      <input
        id={compact ? 'footer-email' : 'cta-email'}
        aria-describedby={error ? `${compact ? 'footer' : 'cta'}-email-error` : undefined}
        aria-invalid={Boolean(error)}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Введите ваш email"
        type="email"
        value={email}
      />
      <button type="submit">{compact ? 'Join' : 'Получить 7 дней бесплатно'}</button>
      {error && <p className="form-error" id={`${compact ? 'footer' : 'cta'}-email-error`}>{error}</p>}
      {submitted && (
        <p className="form-success" role="status">
          Заявка сохранена локально. Данные не отправляются на сервер, поскольку API пока не подключён.
        </p>
      )}
    </form>
  );
}
