# recallio

**recallio** is a modern spaced-repetition study app. It helps you **learn faster and remember longer** by scheduling reviews at the right time using an **SM-2 inspired algorithm**. recallio combines a **sleek shadcn-style UI**, **JWT authentication**, and **offline-friendly queues** to deliver a startup-grade flashcard experience.

**Live App:** [recall.app](https://recallio-five.vercel.app/)  
**Demo Video:** [Watch here](https://youtu.be/_sat2sNb-JE)

## Key Features

- **Spaced Repetition**  
  Uses an **SM-2 scheduling variant** to optimize card intervals for long-term memory.
- **Daily Queue**  
  Each deck surfaces only the cards that are **due today**, keeping reviews short and effective.
- **Review Flow**  
  Intuitive interface with **Again / Hard / Good / Easy** grading, keyboard shortcuts, and a progress bar.
- **Deck Management**  
  Create decks, add cards manually, or bulk **import/export via CSV**.
- **Progress Dashboard**  
  Track your streak and visualize activity with a **heatmap of daily reviews**.
- **Offline & Optimistic**  
  Queues are cached locally; reviews apply instantly and sync when back online.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT
- **Frontend:** React + Vite, TypeScript, Zustand, TailwindCSS (shadcn-style components)

## Demo

**[Watch the demo](https://youtu.be/_sat2sNb-JE)** to see recallio in action.

## Roadmap

- **Enhanced Card Editor**  
  Rich text, images, and Markdown support.
- **Mobile-Friendly UX**  
  Optimized responsive layout for quick studying on the go.
- **Deck Sharing**  
  Export/import entire decks with shareable links.
- **Streaks & Achievements**  
  Gamified tracking for long-term engagement.
