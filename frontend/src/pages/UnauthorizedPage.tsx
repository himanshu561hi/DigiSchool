
import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="mb-6 text-gray-600">
          You do not have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link
          to="/dashboard"
          className="rounded bg-primary px-4 py-2 font-medium text-white hover:opacity-90"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;