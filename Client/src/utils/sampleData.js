export const sampleUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    email: 'user@example.com',
    role: 'user',
    name: 'Regular User'
  }
];

export const sampleMaterials = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the basics of React, a popular JavaScript library for building user interfaces.',
    content: `# Introduction to React

React is a JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer in web and mobile apps. React allows you to design simple views for each state in your application, and it will efficiently update and render just the right components when your data changes.

## Key Concepts

### Components

Components are the building blocks of any React application. A component is a self-contained module that renders some output. Components can be nested within other components to allow complex applications to be built out of simple building blocks.

### JSX

JSX is a syntax extension to JavaScript that looks similar to HTML. It allows you to write HTML-like code in your JavaScript files. React doesn't require JSX, but it makes the code more readable, and writing it feels like writing HTML.

### Props

Props (short for properties) are inputs to React components. They are data passed from a parent component to a child component. Props are read-only and cannot be modified from inside the component.

### State

While props are passed down from parent to child components, state is managed within the component itself. It represents the parts of an application that can change over time.
    `,
    category: 'programming',
    createdAt: '2023-01-15T10:30:00.000Z',
    updatedAt: '2023-01-15T10:30:00.000Z'
  },
  {
    id: '2',
    title: 'Web Design Fundamentals',
    description: 'Master the core principles of effective web design to create beautiful and functional websites.',
    content: `# Web Design Fundamentals

Good web design is about more than just aesthetics; it's about creating interfaces that are functional, accessible, and provide a great user experience.

## Core Principles

### Visual Hierarchy

Visual hierarchy refers to the arrangement of elements in a way that implies importance. Size, color, contrast, and placement all contribute to establishing hierarchy on a page.

### Typography

Typography plays a crucial role in web design. Good typography enhances readability, establishes tone, and creates visual interest.

### Color Theory

Understanding color theory helps designers create visually appealing and harmonious color schemes. Colors evoke emotions and can greatly impact user experience.

### White Space

Also known as negative space, white space is the area between design elements. It's crucial for creating balance and directing user focus.

### Responsive Design

Websites must function well on a variety of devices and screen sizes. Responsive design ensures that layouts adapt appropriately across different viewing contexts.
    `,
    category: 'design',
    createdAt: '2023-02-20T14:45:00.000Z',
    updatedAt: '2023-02-20T14:45:00.000Z'
  },
  {
    id: '3',
    title: 'Understanding the Solar System',
    description: 'Explore the planets, moons, and other celestial bodies that make up our solar system.',
    content: `# The Solar System

Our solar system consists of the Sun and everything that orbits around it, including planets, dwarf planets, moons, asteroids, comets, and meteoroids.

## The Sun

The Sun is a star at the center of our solar system. It's a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field.

## Planets

There are eight planets in our solar system:

1. **Mercury** - The smallest and closest planet to the Sun
2. **Venus** - Known for its thick, toxic atmosphere
3. **Earth** - Our home planet, the only known planet with life
4. **Mars** - Called the "Red Planet" due to iron oxide prevalent on its surface
5. **Jupiter** - The largest planet, a gas giant
6. **Saturn** - Famous for its extensive ring system
7. **Uranus** - An ice giant with a tilted rotation axis
8. **Neptune** - The farthest planet from the Sun

## Dwarf Planets

The International Astronomical Union defines a dwarf planet as a celestial body that orbits the Sun, has sufficient mass for its self-gravity to overcome rigid body forces so that it assumes a nearly round shape, has not cleared the neighborhood around its orbit, and is not a satellite. Pluto, Ceres, Eris, Haumea, and Makemake are currently classified as dwarf planets.
    `,
    category: 'science',
    createdAt: '2023-03-10T09:15:00.000Z',
    updatedAt: '2023-03-10T09:15:00.000Z'
  }
];

export const sampleQuizzes = [
  {
    id: '1',
    title: 'React Fundamentals Quiz',
    description: 'Test your knowledge about React basics and core concepts.',
    category: 'programming',
    timeLimit: 10,
    questions: [
      {
        id: '1',
        text: 'What is React?',
        options: [
          { id: '1', text: 'A JavaScript framework for building user interfaces', isCorrect: false },
          { id: '2', text: 'A JavaScript library for building user interfaces', isCorrect: true },
          { id: '3', text: 'A programming language', isCorrect: false },
          { id: '4', text: 'A database management system', isCorrect: false }
        ]
      },
      {
        id: '2',
        text: 'What is JSX?',
        options: [
          { id: '1', text: 'A JavaScript extension that allows HTML-like code in JavaScript', isCorrect: true },
          { id: '2', text: 'A React component', isCorrect: false },
          { id: '3', text: 'A database query language', isCorrect: false },
          { id: '4', text: 'JavaScript XML parser', isCorrect: false }
        ]
      },
      {
        id: '3',
        text: 'What function is used to update state in a React function component?',
        options: [
          { id: '1', text: 'this.state()', isCorrect: false },
          { id: '2', text: 'setState()', isCorrect: false },
          { id: '3', text: 'useState()', isCorrect: true },
          { id: '4', text: 'updateState()', isCorrect: false }
        ]
      },
      {
        id: '4',
        text: 'Which hook performs side effects in function components?',
        options: [
          { id: '1', text: 'useEffect()', isCorrect: true },
          { id: '2', text: 'useState()', isCorrect: false },
          { id: '3', text: 'useContext()', isCorrect: false },
          { id: '4', text: 'useReducer()', isCorrect: false }
        ]
      }
    ],
    createdAt: '2023-01-25T11:30:00.000Z',
    updatedAt: '2023-01-25T11:30:00.000Z'
  },
  {
    id: '2',
    title: 'Web Design Principles Quiz',
    description: 'Test your knowledge of web design fundamentals and best practices.',
    category: 'design',
    timeLimit: 15,
    questions: [
      {
        id: '1',
        text: 'What is the purpose of white space in web design?',
        options: [
          { id: '1', text: 'To make websites load faster', isCorrect: false },
          { id: '2', text: 'To improve readability and user focus', isCorrect: true },
          { id: '3', text: 'To use less server storage', isCorrect: false },
          { id: '4', text: 'To make pages printer-friendly', isCorrect: false }
        ]
      },
      {
        id: '2',
        text: 'What does "responsive design" mean?',
        options: [
          { id: '1', text: 'A website that responds quickly to user clicks', isCorrect: false },
          { id: '2', text: 'A website that adapts to different screen sizes and devices', isCorrect: true },
          { id: '3', text: 'A website that gives users feedback forms', isCorrect: false },
          { id: '4', text: 'A website that responds to voice commands', isCorrect: false }
        ]
      },
      {
        id: '3',
        text: 'What is the purpose of a color scheme in web design?',
        options: [
          { id: '1', text: 'To make websites more colorful', isCorrect: false },
          { id: '2', text: 'To follow current design trends', isCorrect: false },
          { id: '3', text: 'To create visual harmony and evoke specific emotions', isCorrect: true },
          { id: '4', text: 'To reduce eye strain', isCorrect: false }
        ]
      }
    ],
    createdAt: '2023-02-25T15:45:00.000Z',
    updatedAt: '2023-02-25T15:45:00.000Z'
  }
];

export const sampleInterviews = [
  {
    id: '1',
    userId: '2',
    title: 'My React Developer Interview Experience',
    company: 'Tech Solutions Inc.',
    position: 'Senior React Developer',
    experience: `I recently interviewed for a Senior React Developer position at Tech Solutions Inc. The process consisted of three rounds:

1. Technical Screening
- Basic JavaScript concepts
- React fundamentals
- Code review discussion

2. Technical Interview
- Live coding session
- System design discussion
- Component architecture

3. Culture Fit
- Team collaboration scenarios
- Past project discussions
- Problem-solving approach

Key takeaways:
- Focus on React performance optimization
- Strong emphasis on state management
- Clean code practices are highly valued`,
    tips: 'Practice live coding, review React hooks in depth, and be prepared to discuss real-world applications of React concepts.',
    difficulty: 'Medium',
    result: 'Accepted',
    createdAt: '2023-04-15T08:30:00.000Z'
  }
];