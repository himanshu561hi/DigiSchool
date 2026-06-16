import { Toaster } from "sonner";

import AppRouter from "@/app/router/AppRouter";

function App() {
  return (
    <>
      <AppRouter />

      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;
