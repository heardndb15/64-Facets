import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-aura-bg text-white">
      <div className="max-w-md w-full glass p-8 rounded-2xl border border-red-500/30 text-center">
        <h1 className="text-3xl font-display font-bold text-red-500 mb-4">Authentication Error</h1>
        <p className="text-gray-400 mb-8">
          Something went wrong during the sign-in process. This could be due to an expired link or a configuration issue.
        </p>
        <div className="flex flex-col gap-4">
          <Link 
            href="/"
            className="w-full py-3 bg-garden-500 hover:bg-garden-400 rounded-xl font-bold transition-all shadow-glow-green"
          >
            Return Home
          </Link>
          <p className="text-xs text-gray-600">
            Check your browser console or network tab for more details if the problem persists.
          </p>
        </div>
      </div>
    </div>
  );
}
