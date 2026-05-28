import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-8xl font-bold text-primary">
        404
      </h1>

      <h2 className="mt-4 text-4xl font-bold text-slate-800">
        Page Not Found
      </h2>

      <p className="mt-3 text-lg text-slate-500">
        The page you are trying to
        access does not exist.
      </p>

      <Link
        to="/dashboard"
        className="mt-8 rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90"
      >
        Go Back Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;