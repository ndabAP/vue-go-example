package ops

// Unique values of an slice
func Uniq(s []float64) []float64 {
	m := map[float64]bool{}
	var r []float64

	for _, v := range s {
		if _, seen := m[v]; !seen {
			r = append(r, v)
			m[v] = true
		}
	}

	return r
}