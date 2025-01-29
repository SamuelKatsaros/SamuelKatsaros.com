import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  // Mock data since Goodreads API is no longer available
  const books = [
    {
      title: "This Side of Paradise",
      author: "F. Scott Fitzgerald",
      coverUrl: "/src/assets/This-Side-of-Paradise.jpeg",
      bookUrl: "https://www.goodreads.com/book/show/46165.This_Side_of_Paradise?ref=nav_sb_ss_1_16"
    },
    {
      title: "Elon Musk",
      author: "Walter Isaacson", 
      coverUrl: "/src/assets/Elon-Musk.jpg",
      bookUrl: "https://www.goodreads.com/book/show/122765395-elon-musk"
    },
    {
      title: "The Accidental Billionaires",
      author: "Ben Mezrich",
      coverUrl: "/src/assets/Accidental-Billionaires.jpg",
      bookUrl: "https://www.goodreads.com/book/show/6326920-the-accidental-billionaires"
    },
    {
      title: "The Man Who Solved the Market",
      author: "Gregory Zuckerman",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1567623099i/43889703.jpg",
      bookUrl: "https://www.goodreads.com/book/show/43889703-the-man-who-solved-the-market"
    }
  ]

  return new Response(JSON.stringify({ books }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}