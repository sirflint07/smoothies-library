import { useState, useEffect } from "react"
import supabase from "../config/supababaseClient"
import "../styles/Home.css"

const Home = () => {
  const [error, setError] = useState(null)
  const [smoothies, setSmoothies] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderBy, setOrderBy] = useState("created_at")

  useEffect(() => {
    const fetchSmoothies = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("smoothies")
          .select("*")
          .order(orderBy, { ascending: orderBy === "title" })

        if (error) {
          console.error("Error fetching smoothies:", error)
          setError(error.message)
          setSmoothies(null)
        } else {
          setError(null)
          setSmoothies(data)
        }
      } catch (err) {
        setError("Failed to fetch smoothies")
      } finally {
        setLoading(false)
      }
    }

    fetchSmoothies()
  }, [orderBy])

  const handleDelete = async (id) => {
    const { data, error } = await supabase
      .from("smoothies")
      .delete()
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error deleting smoothie:", error)
    }

    if (data) {
      setSmoothies(smoothies.filter((smoothie) => smoothie.id !== id))
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="star">
        {index < rating ? "★" : "☆"}
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="page home">
        <div className="loading-state">
          <div className="emoji">🥤</div>
          <p>Loading smoothies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page home">
        <div className="error-state">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="page home">
        <div className="header">
          <h1>Smoothie Paradise</h1>
          <p>Discover and share refreshing smoothie recipes</p>
        </div>

        <div className="order-by">
          <p>Sort by:</p>
          <div className="order-buttons">
            <button
              className={orderBy === "created_at" ? "active" : ""}
              onClick={() => setOrderBy("created_at")}
            >
              Newest
            </button>
            <button
              className={orderBy === "title" ? "active" : ""}
              onClick={() => setOrderBy("title")}
            >
              Title
            </button>
            <button
              className={orderBy === "ratings" ? "active" : ""}
              onClick={() => setOrderBy("ratings")}
            >
              Rating
            </button>
          </div>
        </div>

        {smoothies && smoothies.length > 0 ? (
          <div className="smoothies-grid">
            {smoothies.map((smoothie) => (
              <div key={smoothie.id} className="smoothie-card">
                <h3>{smoothie.title}</h3>

                {smoothie.method && (
                  <p className="method">
                    {smoothie.method.length > 120
                      ? `${smoothie.method.substring(0, 120)}...`
                      : smoothie.method}
                  </p>
                )}

                <div className="rating">
                  <div className="stars">
                    {renderStars(smoothie.ratings || 0)}
                  </div>
                  <span className="rating-value">
                    {smoothie.ratings || 0}/10
                  </span>
                </div>

                <div className="card-footer">
                  <span className="id">#{smoothie.id}</span>
                  <div className="actions">
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(smoothie.id)}
                    >
                      Delete
                    </button>
                    <a href={`/${smoothie.id}`} className="btn btn-edit">
                      Edit
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="emoji">🥤</div>
            <h3>No smoothies yet!</h3>
            <p>Be the first to create a delicious smoothie recipe.</p>
          </div>
        )}
      </div>
      <footer>
      <p>&copy; 2023 Supa Smoothies. All rights reserved.</p>
      <p>Created with ❤️ by Michael Oluwaseun</p>
    </footer>
    </div>
    
  )
}

export default Home
