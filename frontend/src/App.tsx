import { useEffect } from "react";
import { db } from "./api/firebase";
import { collection, getDocs } from "firebase/firestore";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/routes";

function App() {
  useEffect(() => {
    const test = async () => {
      const snapshot = await getDocs(collection(db, "test"));
      console.log("Firestore connected ✅", snapshot.size);
    };
    test();
  }, []);

  function RoutesWrapper() {
    const routes = useRoutes(appRoutes);
    return routes;
  }

  return (
    <>
      <BrowserRouter>
        <RoutesWrapper />
      </BrowserRouter>
    </>
  )
}

export default App
