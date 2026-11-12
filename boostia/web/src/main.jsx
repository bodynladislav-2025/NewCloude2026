import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'

// Hlavní stránka je v základním balíčku, ostatní se načítají až při návštěvě.
const Agenti = lazy(() => import('./pages/Agenti'))
const JakToFunguje = lazy(() => import('./pages/JakToFunguje'))
const Dotace = lazy(() => import('./pages/Dotace'))
const Studie = lazy(() => import('./pages/Studie'))
const ONas = lazy(() => import('./pages/ONas'))
const Audit = lazy(() => import('./pages/Audit'))
const Dekujeme = lazy(() => import('./pages/Dekujeme'))
const DekujemePrompty = lazy(() => import('./pages/DekujemePrompty'))
const Kontakt = lazy(() => import('./pages/Kontakt'))
const Gdpr = lazy(() => import('./pages/Gdpr'))
const Podminky = lazy(() => import('./pages/Podminky'))
const NotFound = lazy(() => import('./pages/NotFound'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/ai-agenti" element={<Agenti />} />
            <Route path="/jak-to-funguje" element={<JakToFunguje />} />
            <Route path="/dotace" element={<Dotace />} />
            <Route path="/pripadove-studie" element={<Studie />} />
            <Route path="/o-nas" element={<ONas />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/dekujeme" element={<Dekujeme />} />
            <Route path="/dekujeme-prompty" element={<DekujemePrompty />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/ochrana-osobnich-udaju" element={<Gdpr />} />
            <Route path="/obchodni-podminky" element={<Podminky />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>
)
