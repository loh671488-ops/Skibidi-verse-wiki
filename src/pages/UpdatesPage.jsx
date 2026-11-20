
import SiteHeader from '../components/SiteHeader.jsx';
import Footer from '../components/Footer.jsx';

function UpdatesPage({ updates, onBack, onOpenUpdate }) {
  return (
    <div className="app">
      <SiteHeader />

      <main>
        <button
          className="back-button"
          onClick={onBack}
        >
          ← BACK TO HOME
        </button>

        <div className="hero">
          <div className="tag">GAME CHANGELOG</div>
          <h1>GAME <span>UPDATES</span></h1>
          <p>Follow the latest changes and additions to the game.</p>
        </div>

        <div className="updates-container">
          <div className="updates-heading">
            <h2>UPDATE HISTORY</h2>
            <span>{updates.length} ENTRIES</span>
          </div>

          {updates.length > 0 ? (
            <div className="updates-list">
              {updates.map(update => (
                <article
                  className="update-card"
                  key={update.id}
                  onClick={() => onOpenUpdate(update)}
                >
                  <div className="update-card-top">
                    <span className="update-category">
                      {update.category}
                    </span>
                    <span className="update-date">
                      {update.date}
                    </span>
                  </div>

                  <h3>{update.title}</h3>

                  <p>{update.description}</p>

                  <div className="update-card-bottom">
                    <span>{update.version}</span>
                    <strong>READ MORE ↗</strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="profile-empty">
              No updates have been added yet.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UpdatesPage;
