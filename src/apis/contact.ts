export const postContactMessage = async (name: string, email: string, message: string) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, message })
  })

  return response.json()
}
