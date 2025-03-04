export default async function getGoodreadsData() {
  const books = [
    {
      title: "This Side of Paradise",
      author: "F. Scott Fitzgerald",
      coverUrl: "/images/books/This-Side-of-Paradise.jpeg",
      bookUrl: "https://www.goodreads.com/book/show/46165.This_Side_of_Paradise?ref=nav_sb_ss_1_16"
    },
    {
      title: "Elon Musk",
      author: "Walter Isaacson", 
      coverUrl: "/images/books/Elon-Musk.jpg",
      bookUrl: "https://www.goodreads.com/book/show/122765395-elon-musk"
    },
    {
      title: "Space to Grow",
      author: "Matthew Weinzierl and Brendan Rosseau",
      coverUrl: "/images/books/spacetogrow.jpg",
      bookUrl: "https://www.goodreads.com/book/show/205959835-space-to-grow"
    },
    {
      title: "The Man Who Solved the Market",
      author: "Gregory Zuckerman",
      coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1567623099i/43889703.jpg",
      bookUrl: "https://www.goodreads.com/book/show/43889703-the-man-who-solved-the-market"
    }
  ]

  return { books }
} 