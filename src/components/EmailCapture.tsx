import { type FormEvent, useState } from 'react';
import { Button, Input } from 'antd';
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
      <label className="sr-only" htmlFor={compact ? 'footer-email' : 'cta-email'}>{compact ? 'Адрес электронной почты' : 'Email address'}</label>
      <Input
        id={compact ? 'footer-email' : 'cta-email'}
        aria-describedby={error ? `${compact ? 'footer' : 'cta'}-email-error` : undefined}
        aria-invalid={Boolean(error)}
        onChange={(event) => {
          setEmail(event.target.value);
          setError('');
          setSubmitted(false);
        }}
        placeholder={compact ? 'Введите ваш email' : 'Enter your email address'}
        type="email"
        value={email}
      />
      <Button type="primary" htmlType="submit">{compact ? 'Join' : 'Claim 7 Days Free'}</Button>
      {error && <p className="form-error" id={`${compact ? 'footer' : 'cta'}-email-error`}>{error}</p>}
      {submitted && (
        <p className="form-success" role="status">
          Адрес проверен локально. Данные не отправляются на сервер; пробный период не активирован.
        </p>
      )}
    </form>
  );
}
