import { Book, Highlight } from '../types';

export const mockHighlights: Highlight[] = [
  {
    id: '1',
    content: "The difference between the artist and the craftsman is that the craftsman knows what they're going to create before they create it, whereas the artist finds out what they're creating in the process of creating it.",
    book: "Creativity: Flow and the Psychology of Discovery and Invention",
    author: "Mihaly Csikszentmihalyi",
    tags: ["creativity", "psychology"],
    date: new Date('2023-09-15'),
    lastReviewed: new Date('2023-09-30'),
    nextReview: new Date('2023-10-07'),
    easeFactor: 2.5,
    interval: 7
  },
  {
    id: '2',
    content: "Reading is to the mind what exercise is to the body. As by the one, health is preserved, strengthened, and invigorated: by the other, virtue (which is the health of the mind) is kept alive, cherished, and confirmed.",
    book: "Essays on the Pleasures of Reading",
    author: "Joseph Addison",
    tags: ["reading", "learning"],
    date: new Date('2023-10-01'),
    lastReviewed: new Date('2023-10-10'),
    nextReview: new Date('2023-10-17'),
    easeFactor: 2.2,
    interval: 7
  },
  {
    id: '3',
    content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    book: "Nicomachean Ethics",
    author: "Aristotle",
    tags: ["philosophy", "habits"],
    date: new Date('2023-08-20'),
    lastReviewed: new Date('2023-10-05'),
    nextReview: new Date('2023-10-12'),
    easeFactor: 2.7,
    interval: 7
  },
  {
    id: '4',
    content: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.",
    book: "In Search of Lost Time",
    author: "Marcel Proust",
    tags: ["perspective", "discovery"],
    date: new Date('2023-09-05'),
    lastReviewed: new Date('2023-10-02'),
    nextReview: new Date('2023-10-09'),
    easeFactor: 2.4,
    interval: 7
  },
  {
    id: '5',
    content: "An idea that is not dangerous is unworthy of being called an idea at all.",
    book: "The Soul of Man Under Socialism",
    author: "Oscar Wilde",
    tags: ["ideas", "creativity"],
    date: new Date('2023-09-22'),
    lastReviewed: new Date('2023-10-08'),
    nextReview: new Date('2023-10-15'),
    easeFactor: 2.3,
    interval: 7
  },
  {
    id: '6',
    content: "The ability to simplify means to eliminate the unnecessary so that the necessary may speak.",
    book: "Atomic Habits",
    author: "James Clear",
    tags: ["simplicity", "focus"],
    date: new Date('2023-10-03'),
    lastReviewed: null,
    nextReview: new Date('2023-10-10'),
    easeFactor: 2.5,
    interval: 7
  },
  {
    id: '7',
    content: "The best way to predict the future is to create it.",
    book: "The Essential Drucker",
    author: "Peter Drucker",
    tags: ["future", "creation"],
    date: new Date('2023-09-29'),
    lastReviewed: null,
    nextReview: new Date('2023-10-06'),
    easeFactor: 2.5,
    interval: 7
  }
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: "Atomic Habits",
    author: "James Clear",
    category: "Productivity",
    highlights: 24,
    coverUrl: "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    dateAdded: new Date('2023-09-15')
  },
  {
    id: '2',
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    highlights: 18,
    coverUrl: "https://images.pexels.com/photos/3747510/pexels-photo-3747510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    dateAdded: new Date('2023-09-20')
  },
  {
    id: '3',
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Psychology",
    highlights: 32,
    coverUrl: "https://images.pexels.com/photos/3747446/pexels-photo-3747446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    dateAdded: new Date('2023-09-25')
  },
  {
    id: '4',
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Business",
    highlights: 15,
    coverUrl: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    dateAdded: new Date('2023-09-28')
  },
  {
    id: '5',
    title: "Meditations",
    author: "Marcus Aurelius",
    category: "Philosophy",
    highlights: 27,
    coverUrl: null,
    dateAdded: new Date('2023-10-01')
  },
  {
    id: '6',
    title: "The Art of War",
    author: "Sun Tzu",
    category: "Philosophy",
    highlights: 19,
    coverUrl: null,
    dateAdded: new Date('2023-10-03')
  },
  {
    id: '7',
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    highlights: 22,
    coverUrl: "https://images.pexels.com/photos/2693212/pexels-photo-2693212.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    dateAdded: new Date('2023-10-05')
  },
  {
    id: '8',
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Science",
    highlights: 29,
    coverUrl: "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    dateAdded: new Date('2023-10-07')
  }
];