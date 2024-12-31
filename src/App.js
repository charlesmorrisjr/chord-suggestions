import './App.css';
import './Card.css';
import { useState } from 'react';

function Card({ note, onDelete, id }) {
  return (
    <div class="card">
      {note}
      <div class="container">
        {note} Major
      </div>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}

function ShowCards() {
  const [cards, setCards] = useState([
    { id: 1, note: 'C' },
    { id: 2, note: 'D' },
    { id: 3, note: 'E' },
    { id: 4, note: 'F' },
    { id: 5, note: 'G' },
    { id: 6, note: 'A' },
    { id: 7, note: 'B' }
  ]);
  
  function handleDelete(cardId) {
    setCards(cards.filter(card => card.id !== cardId));
  }

  return (
    <div>
      {cards.map((card) => (
        <Card 
          key={card.id} 
          id={card.id}
          note={card.note}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <ShowCards />
  );
}

export default App;
