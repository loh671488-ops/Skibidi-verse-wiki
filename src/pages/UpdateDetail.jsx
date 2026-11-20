
import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import Footer from '../components/Footer.jsx';

function UpdateDetail({ update, onBack }) {
  if (!update) return null;

  return (
    <div className="app">
      <SiteHeader />

      <main className="container">
        <button className="back-button" onClick={onBack}>
          ← BACK TO UPDATES
        </button>

        <div className="update-detail">
          <div className="update-meta">
            <span>{update.version}</span>
            <span>{update.date}</span>
          </div>

          <h1>{update.title}</h1>

          <div className="update-category">
            {update.category}
          </div>

          <p>{update.description}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UpdateDetail;
