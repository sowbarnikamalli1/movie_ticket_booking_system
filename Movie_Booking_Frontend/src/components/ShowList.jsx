import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import SeatBooking from './SeatBooking';

export default function ShowList() {
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [activeShow, setActiveShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('http://localhost:8081/api/show');
        setShows(response.data);
      } catch {
        try {
          const response = await axios.get('http://localhost:8081/api/shows');
          setShows(response.data);
        } catch {
          setError('There is no data available. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const availableDates = useMemo(() => {
    const dates = [...new Set(shows.map(show => show.date))];
    return dates.sort();
  }, [shows]);

  const visibleShows = useMemo(() => {
    if (!selectedDate) return shows;
    return shows.filter(show => show.date === selectedDate);
  }, [selectedDate, shows]);

  const handleSelectShow = (show) => {
    setActiveShow(show);
  };

  const handleShowCardKeyDown = (event, show) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelectShow(show);
    }
  };

  const handleBack = () => {
    setActiveShow(null);
  };

  return (
    <div>
      {loading && <div className="alert alert-info">Loading show data...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <div className="date-filter mb-4">
            <div className="date-buttons">
              <button
                className={`date-btn ${selectedDate === '' ? 'active' : ''}`}
                onClick={() => setSelectedDate('')}
              >
                All
              </button>

              {availableDates.map(date => (
                <button
                  key={date}
                  className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {activeShow ? (
            <>
              <button className="btn btn-link mb-3 p-0" onClick={handleBack}>
                ← Back to show list
              </button>

              <div className="show-details-card mb-4">
                <h4 className="movie-title mb-3">{activeShow.movie.title}</h4>
                <div className="show-details-grid">
                  <div className="show-detail-chip">
                    <span className="show-detail-label">Actor</span>
                    <span className="show-detail-value">{activeShow.movie.actor}</span>
                  </div>
                  <div className="show-detail-chip">
                    <span className="show-detail-label">Date</span>
                    <span className="show-detail-value">{activeShow.date}</span>
                  </div>
                  <div className="show-detail-chip">
                    <span className="show-detail-label">Time</span>
                    <span className="show-detail-value">{activeShow.time}</span>
                  </div>
                  <div className="show-detail-chip">
                    <span className="show-detail-label">Screen</span>
                    <span className="show-detail-value">{activeShow.screen.name}</span>
                  </div>
                  <div className="show-detail-chip">
                    <span className="show-detail-label">Total Seats</span>
                    <span className="show-detail-value">{activeShow.screen.totalSeats}</span>
                  </div>
                </div>
              </div>

              <SeatBooking show={activeShow} />
            </>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {visibleShows.length === 0 ? (
                <div className="col">
                  <div className="alert alert-secondary">No shows available for this date.</div>
                </div>
              ) : visibleShows.map(show => (
                <div key={show.id} className="col">
                  <div
                    className="movie-card show-card h-100"
                    onClick={() => handleSelectShow(show)}
                    onKeyDown={(event) => handleShowCardKeyDown(event, show)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${show.movie.title} on ${show.date} at ${show.time}`}
                  >
                    <div className="card-body d-flex flex-column">
                      <h5 className="movie-title">{show.movie.title}</h5>
                      <div className="show-card-meta">
                        <div className="show-detail-chip compact">
                          <span className="show-detail-label">Actor</span>
                          <span className="show-detail-value">{show.movie.actor}</span>
                        </div>
                        <div className="show-detail-chip compact">
                          <span className="show-detail-label">Date</span>
                          <span className="show-detail-value">{show.date}</span>
                        </div>
                        <div className="show-detail-chip compact">
                          <span className="show-detail-label">Time</span>
                          <span className="show-detail-value">{show.time}</span>
                        </div>
                        <div className="show-detail-chip compact">
                          <span className="show-detail-label">Screen</span>
                          <span className="show-detail-value">{show.screen.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}