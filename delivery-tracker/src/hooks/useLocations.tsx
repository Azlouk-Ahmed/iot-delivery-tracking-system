import { useEffect, useState } from "react"

function useReverseGeocode(lat: number, lon: number) {
  const [place, setPlace] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        )
        const data = await res.json()
        setPlace(data.display_name || "Unknown place")
      } catch (err) {
        setPlace("Unknown place")
      } finally {
        setLoading(false)
      }
    }
    fetchPlace()
  }, [lat, lon])

  return { place, loading }
}

export default useReverseGeocode
