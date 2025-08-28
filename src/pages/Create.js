import { useState } from "react"
import supabase from "../config/supababaseClient"
import { useNavigate } from "react-router-dom"
import "../styles/Create.css"

const Create = () => {
  const [title, setTitle] = useState('')
  const [method, setMethod] = useState('')
  const [ratings, setRatings] = useState(0)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!title || !method || !ratings || ratings < 0) {
      setError("Please fill in all fields correctly.")
      return
    }

    if (!error) {
      
      const formData = { title, method, ratings }
      console.log("Form submitted:", formData)

      const { data, error } = await supabase.from("smoothies").insert([formData])

      if (error) {
        setError("Error submitting form.")
      }
      if (data) {
        console.log("Form submitted successfully:", data)
        setError(null)
        
      }
      
      setTitle('')
      setMethod('')
      setRatings(0)
      navigate('/')
    }

  }
  return (
    <div className="page create">
      <h2>Create</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Method:
          <input
            type="text"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          />
        </label>
        <label>
          Ratings:
          <input
            type="number"
            value={ratings}
            onChange={(e) => setRatings(Number(e.target.value))}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default Create