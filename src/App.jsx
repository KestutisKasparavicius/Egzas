import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [cities, setCities] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [error, setError] = useState(null)

  const API_URL = 'http://localhost:3010/api'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [usersRes, citiesRes, eventsRes] = await Promise.all([
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/cities`),
        fetch(`${API_URL}/events`)
      ])

      if (!usersRes.ok || !citiesRes.ok || !eventsRes.ok) {
        throw new Error('Failed to fetch data from server')
      }

      const usersData = await usersRes.json()
      const citiesData = await citiesRes.json()
      const eventsData = await eventsRes.json()

      setUsers(usersData)
      setCities(citiesData)
      setEvents(eventsData)
    } catch (err) {
      setError(err.message)
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📱 Event Management System</h1>
        <p>Lithuanian Events Database</p>
      </header>

      {error && <div className="error-message">⚠️ Error: {error}</div>}

      <nav className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cities' ? 'active' : ''}`}
          onClick={() => setActiveTab('cities')}
        >
          🏙️ Cities ({cities.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          🎉 Events ({events.length})
        </button>
      </nav>

      <div className="content">
        {loading ? (
          <div className="loading">Loading data...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <section className="section">
                <h2>Users</h2>
                {users.length === 0 ? (
                  <p className="no-data">No users found</p>
                ) : (
                  <div className="card-grid">
                    {users.map(user => (
                      <div key={user.id} className="card">
                        <h3>{user.name}</h3>
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Privilege:</strong> <span className="badge">{user.privilege}</span></p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'cities' && (
              <section className="section">
                <h2>Cities</h2>
                {cities.length === 0 ? (
                  <p className="no-data">No cities found</p>
                ) : (
                  <div className="card-grid">
                    {cities.map(city => (
                      <div key={city.id} className="card">
                        <h3>🏢 {city.city}</h3>
                        <p><strong>ID:</strong> {city.id}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'events' && (
              <section className="section">
                <h2>Events</h2>
                {events.length === 0 ? (
                  <p className="no-data">No events found</p>
                ) : (
                  <div className="events-list">
                    {events.map(event => {
                      const city = cities.find(c => c.id === event.city_id)
                      return (
                        <div key={event.id} className="event-card">
                          <h3>{event.event_name}</h3>
                          <p className="description">{event.description}</p>
                          <div className="event-details">
                            <div className="detail">
                              <strong>📅 Date:</strong> {event.date}
                            </div>
                            <div className="detail">
                              <strong>📍 City:</strong> {city ? city.city : 'Unknown'}
                            </div>
                            <div className="detail">
                              <strong>⭐ Rating ID:</strong> {event.rating_id}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      <footer className="app-footer">
        <button onClick={fetchData} className="refresh-btn">🔄 Refresh Data</button>
      </footer>
    </div>
  )
}

export default App
