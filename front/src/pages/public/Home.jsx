import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";

import "./Home.css";



export default function Home() {
  const { t } = useTranslation();

 
  return (
   
     <Suspense fallback={<div>Loading...</div>}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="logo-title">
            MARS<span className="gradient-text">AI</span>
          </h1>

         <h2 className="tagline">
  {t("home.tagline1")}
  <span className="highlight">{t("home.taglineHighlight")}</span>
  {t("home.tagline2")}
</h2>

          <p className="subtitle">
            Le festival de courts-métrages de 60 secondes réalisés par IA.
          </p>

          <div className="cta-buttons">
            <Link to="/gallerie" className="btn-primary">
             {t("home.discover")}

              <svg className="btn-arrow" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link to="/contact" className="btn-secondary">
              EN SAVOIR <span className="plus">+</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Immersion Section */}
      <section className="immersion-section">
        <div className="immersion-container">
          <div className="immersion-label">
            <span className="immersion-label-line"></span>
            <span className="immersion-label-text">IMMERSION TOTALE</span>
            <span className="immersion-label-line"></span>
          </div>

          <h2 className="immersion-title">IMMERSION</h2>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value stat-green">60s</div>
            </div>
            <div className="stat-item">
              <div className="stat-value stat-emerald">+20</div>
            </div>
            <div className="stat-item">
              <div className="stat-value stat-pink">+50</div>
            </div>
            <div className="stat-item">
              <div className="stat-value stat-cyan">5</div>
            </div>
          </div>

          <button className="btn-aventure">COMMENCER L'AVENTURE</button>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="objectives-section">
        <div className="objectives-container">
          <h2 className="objectives-title">
            OBJECTIFS DU<br />
            <span className="objectives-title-gradient">FESTIVAL</span>
          </h2>

          <div className="objectives-grid">
            <div className="objective-card">
              <div className="objective-icon">
                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>
              </div>
              <h3 className="objective-name">L'HUMAIN AU CENTRE</h3>
              <p className="objective-description">Mettre l'humain au cœur de la création pour ne pas perdre l'émotion.</p>
            </div>
            <div className="objective-card">
              <div className="objective-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="objective-name">CHALLENGE CRÉATIF</h3>
              <p className="objective-description">Challenger la créativité grâce à un format ultra-court de 60s.</p>
            </div>
            <div className="objective-card">
              <div className="objective-icon">
                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M2 12H22" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2C14.5 4.74 16 8.29 16 12C16 15.71 14.5 19.26 12 22C9.5 19.26 8 15.71 8 12C8 8.29 9.5 4.74 12 2Z" stroke="currentColor" strokeWidth="1.5"/></svg>
              </div>
              <h3 className="objective-name">FUTURS SOUHAITABLES</h3>
              <p className="objective-description">Explorer les futurs désirables via les technologies émergentes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Films Section */}
      <section className="films-section">
        <div className="films-container">
          <div className="films-header">
            <div className="films-header-left">
              <h2 className="films-title">
                FILMS EN<br />
                <span className="films-title-gradient">COMPÉTITION</span>
              </h2>
              <p className="films-description">
                Découvrez une sélection d'œuvres pionnières explorant les<br />
                nouvelles frontières de l'imaginaire assisté par l'IA.
              </p>
            </div>
            <div className="films-header-right">
              <Link to="/gallerie" className="btn-selection">
                <span>VOIR LA SÉLECTION</span>
                <div className="btn-selection-arrow">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </Link>
            </div>
          </div>

          <div className="films-grid">
            <div className="film-card">
              <div className="film-image">
                <div className="film-placeholder film-placeholder-1"></div>
              </div>
              <div className="film-info">
                <h3 className="film-title">NEURAL ODYSSEY</h3>
                <p className="film-director">RÉALISATEUR IA</p>
              </div>
            </div>
            <div className="film-card">
              <div className="film-image">
                <div className="film-placeholder film-placeholder-2"></div>
              </div>
              <div className="film-info">
                <h3 className="film-title">SYNTHETIC DREAMS</h3>
                <p className="film-director">RÉALISATEUR IA</p>
              </div>
            </div>
            <div className="film-card">
              <div className="film-image">
                <div className="film-placeholder film-placeholder-3"></div>
              </div>
              <div className="film-info">
                <h3 className="film-title">QUANTUM VISIONS</h3>
                <p className="film-director">RÉALISATEUR IA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Night Section */}
      <section className="night-section">
        <div className="night-container">
          <div className="night-content">
            <span className="night-badge">ÉVÉNEMENT SPÉCIAL</span>
            <h2 className="night-title">
              <span className="night-title-outline">LA NUIT</span>
              <span className="night-title-bold">MARS.AI</span>
            </h2>
            <p className="night-description">
              Une soirée unique mêlant projections immersives, performances live
              et rencontres avec les créateurs du futur.
            </p>
          </div>
          <div className="night-card">
            <div className="night-card-icon">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <button className="night-card-btn">RÉSERVER</button>
          </div>
        </div>
      </section>

      {/* Conferences Section */}
      <section className="conferences-section">
        <div className="conferences-container">
          <h2 className="conferences-title">
            CONFÉRENCES &<br />
            <span className="conferences-title-gradient">DÉBATS</span>
          </h2>

          <ol className="conferences-list">
            <li>L'IA et l'avenir du cinéma : menace ou opportunité ?</li>
            <li>Éthique et créativité algorithmique</li>
            <li>Le futur de la narration générative</li>
          </ol>

          <div className="events-grid">
            <div className="event-card event-card-light">
              <div className="event-icon event-icon-purple">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5"/></svg>
              </div>
              <h3 className="event-name">MASTERCLASS</h3>
              <p className="event-description">Apprendre des meilleurs créateurs IA du monde.</p>
            </div>
            <div className="event-card event-card-light">
              <div className="event-icon event-icon-pink">
                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M10 8L16 12L10 16V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="event-name">PROJECTIONS</h3>
              <p className="event-description">Séances exclusives des films finalistes.</p>
            </div>
            <div className="event-card event-card-dark">
              <div className="event-icon event-icon-green">
                <svg viewBox="0 0 24 24" fill="none"><path d="M17 21V19C17 16.79 15.21 15 13 15H5C2.79 15 1 16.79 1 19V21" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M23 21V19C23 17.07 21.63 15.43 19.76 15" stroke="currentColor" strokeWidth="1.5"/></svg>
              </div>
              <h3 className="event-name">NETWORKING</h3>
              <p className="event-description">Rencontrez les acteurs de l'IA créative.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors-section">
        <div className="sponsors-container">
          <div className="sponsors-label">
            <span className="sponsors-line"></span>
            <span>NOS SOUTIENS</span>
            <span className="sponsors-line"></span>
          </div>
          <h2 className="sponsors-title">
            ILS SOUTIENNENT <span className="sponsors-title-gradient">LE FUTUR</span>
          </h2>
          <div className="sponsors-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="sponsor-card">
                <span className="sponsor-placeholder">SPONSOR</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location-section">
        <div className="location-container">
          <div className="location-badge">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 5 13.5 5 9C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9C19 13.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
            LE LIEU
          </div>

          <h2 className="location-title">
            LA <span className="location-title-outline">PLATEFORME</span>
          </h2>

          <div className="location-info">
            <div>
              <span className="location-hub">MARSEILLE, HUB CRÉATIF</span>
            </div>
            <div>
              <span className="location-address">155 Rue Peyssonnel, 13002<br />Marseille</span>
            </div>
            <div>
              <span className="location-access">ACCÈS TRAM T2/T3 ARRÊT ARENC LE SILO</span>
            </div>
          </div>
        </div>
      </section>
  
    
   </Suspense>
  );
}


