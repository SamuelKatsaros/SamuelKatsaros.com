export interface Tweet {
  id: string
  text: string
  author: {
    name: string
    username: string
    image: string
  }
} 