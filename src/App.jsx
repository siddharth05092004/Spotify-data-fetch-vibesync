import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search.jsx";
import Result from "./pages/Result.jsx";

function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>

          <Route path = "/search" index element={<Result />} />
          <Route path="*" element={<Search/>} />
        
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
