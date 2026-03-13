import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import Anime from "./Anime.tsx";
import Search from "./Search.tsx";
import Favorites from "./Favorites.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/">
                  <Route index element={<App />} />
              </Route>
              <Route path="/anime/:id" element={<Anime />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
