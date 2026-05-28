import { Link, useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const storedUser =
    localStorage.getItem("erp_user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const role =
    user?.role?.toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("erp_user");

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-8">
          <h1 className="text-5xl font-bold text-primary">
            School ERP
          </h1>

          <p className="mt-3 text-lg text-slate-500">
            Enterprise Portal
          </p>
        </div>

        <nav className="space-y-3 p-4">
          <Link
            to="/dashboard"
            className="block rounded-xl bg-primary px-5 py-4 text-lg font-medium text-white"
          >
            Dashboard
          </Link>

          {/* MANAGER ONLY */}
          {role === "MANAGER" && (
            <>
              <Link
                to="/students"
                className="block rounded-xl px-5 py-4 text-lg font-medium text-slate-700 hover:bg-slate-100"
              >
                Students
              </Link>

              <Link
                to="/teachers"
                className="block rounded-xl px-5 py-4 text-lg font-medium text-slate-700 hover:bg-slate-100"
              >
                Teachers
              </Link>

              <Link
                to="/fees"
                className="block rounded-xl px-5 py-4 text-lg font-medium text-slate-700 hover:bg-slate-100"
              >
                Fees
              </Link>
            </>
          )}

          {/* TEACHER ONLY */}
          {role === "TEACHER" && (
            <>
              <Link
                to="/attendance"
                className="block rounded-xl px-5 py-4 text-lg font-medium text-slate-700 hover:bg-slate-100"
              >
                Attendance
              </Link>

              <Link
                to="/assignments"
                className="block rounded-xl px-5 py-4 text-lg font-medium text-slate-700 hover:bg-slate-100"
              >
                Assignments
              </Link>
            </>
          )}

          {/* STUDENT ONLY */}
          {role === "STUDENT" && (
            <>
              <Link
                to="/my-attendance"
                className="block rounded-xl px-5 py-4 text-lg font-medium text-slate-700 hover:bg-slate-100"
              >
                My Attendance
              </Link>

              <Link
                to="/my-fees"
                className="block rounded-xl px-5 py-4 text-lg font-medium text-slate-700 hover:bg-slate-100"
              >
                My Fees
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-10 py-6">
          <div>
            <h2 className="text-5xl font-bold text-slate-800">
              Welcome Back
            </h2>

            <p className="mt-2 text-xl text-slate-500">
              {user?.firstName}{" "}
              {user?.lastName}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                {role}
              </p>

              <p className="mt-1 text-lg text-slate-500">
                School ID:
                {" "}
                {user?.schoolId}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Body */}
        <section className="p-10">
          {/* MANAGER */}
          {role === "MANAGER" && (
            <>
              <h1 className="text-6xl font-bold text-slate-800">
                Manager Dashboard
              </h1>

              <p className="mt-3 text-xl text-slate-500">
                School analytics and
                administration
              </p>

              <div className="mt-10 grid grid-cols-4 gap-6">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Total Students</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    1,248
                  </h2>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Total Teachers</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    86
                  </h2>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Fees Collected</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    ₹18L
                  </h2>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Pending Fees</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    ₹3.2L
                  </h2>
                </div>
              </div>
            </>
          )}

          {/* TEACHER */}
          {role === "TEACHER" && (
            <>
              <h1 className="text-6xl font-bold text-slate-800">
                Teacher Dashboard
              </h1>

              <p className="mt-3 text-xl text-slate-500">
                Attendance and classroom
                management
              </p>

              <div className="mt-10 grid grid-cols-3 gap-6">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Assigned Classes</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    5
                  </h2>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Total Students</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    210
                  </h2>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Pending Assignments</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    12
                  </h2>
                </div>
              </div>
            </>
          )}

          {/* STUDENT */}
          {role === "STUDENT" && (
            <>
              <h1 className="text-6xl font-bold text-slate-800">
                Student Dashboard
              </h1>

              <p className="mt-3 text-xl text-slate-500">
                Academic and attendance
                overview
              </p>

              <div className="mt-10 grid grid-cols-3 gap-6">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Attendance</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    94%
                  </h2>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Assignments</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    8
                  </h2>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p>Pending Fees</p>

                  <h2 className="mt-4 text-5xl font-bold">
                    ₹12K
                  </h2>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;