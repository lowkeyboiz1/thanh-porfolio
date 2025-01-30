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

export const getContactMessages = async () => {
  const response = await fetch('/api/contact')
  return response.json()
}

export const deleteContactMessage = async (id: string) => {
  const response = await fetch(`/api/contact/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}
