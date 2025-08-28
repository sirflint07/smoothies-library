import { useEffect, useState } from "react"
import supabase from "../config/supababaseClient"
import { useParams } from "react-router-dom"

const Update = () => {
const [title, setTitle] = useState('')
    const [method, setMethod] = useState('')
    const [ratings, setRatings] = useState(0)
    const [error, setError] = useState(null)
    const {id} = useParams()

    const handleSubmit = async (e) => {
      e.preventDefault()

    if (!title || !method || !ratings) {
      setError("All fields are required")
      return
    }

    const {data, error} = await supabase
      .from("smoothies")
      .update({
        title,
        method,
        ratings
      })
      .eq('id', id)

    if (error) {
      setError("Could not fetch smoothie")
    }

    if (data) {
      setError(null)
    }

    window.location.href = '/'
  }
    

  useEffect(() => {
    const fetchSmoothie = async () => {
        
    const { data, error} = await supabase
    .from("smoothies")
    .select()
    .eq('id', id)
    .single()

    setTitle(data.title)
    setMethod(data.method)
    setRatings(data.ratings)

    }

      fetchSmoothie()
    }, [])

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input 
          type="text" 
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="method">Method:</label>
        <textarea 
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />

        <label htmlFor="rating">Rating:</label>
        <input 
          type="number"
          id="rating"
          value={ratings}
          onChange={(e) => setRatings(e.target.value)}
        />

        <button>Update Smoothie Recipe</button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}

export default Update