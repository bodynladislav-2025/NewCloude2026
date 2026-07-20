import { useState } from 'react';
import { Lock } from 'lucide-react';
import { APP_PIN } from '../config';

export default function LockScreen({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [wrong, setWrong] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pin === APP_PIN) {
      onUnlock(pin);
    } else {
      setWrong(true);
      setPin('');
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
            <Lock size={20} />
          </span>
          <h1 className="text-lg font-semibold text-slate-900">Měsíční platby</h1>
          <p className="text-sm text-slate-500">Zadejte PIN pro vstup</p>
        </div>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setWrong(false);
          }}
          className="mb-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-slate-900"
          placeholder="••••"
        />
        {wrong && (
          <p className="mb-3 text-center text-sm font-medium text-red-600">Nesprávný PIN</p>
        )}
        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white active:bg-slate-700"
        >
          Odemknout
        </button>
      </form>
    </div>
  );
}
