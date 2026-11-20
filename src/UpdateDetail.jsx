import SiteHeader from '../components/SiteHeader.jsx';
import Footer from '../components/Footer.jsx';

function UpdateDetail({ update, onBack }) {
  return (
    <div className="app">
      <SiteHeader />

      <main>
        <button
          className="back-button"
          onClick={onBack}
        >
          ← BACK TO UPDATES
        </button>

        <div className="hero">
          <div className="tag">{update.version}</div>
          <h1>{update.title}</h1>
          <p>{update.date}</p>
        </div>

        <div className="update-detail">
          <div className="update-detail-top">
            <span className="update-category">
              {update.category}
            </span>
            <span className="update-date">
              {update.date}
            </span>
          </div>

          <p className="update-description">
            {update.description}
          </p>

          <h3>CHANGELOG</h3>

          <ul className="update-changes">
            {update.changes.map((change, index) => (
              <li key={index}>{change}</li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UpdateDetail;
