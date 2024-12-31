import './App.css';
import './Card.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

function Card({ note, onDelete, id }) {
  return (
    <div className="card">
      {note}
      <button className='delete-btn' onClick={() => onDelete(id)}>x</button>
    </div>
  );
}

Card.propTypes = {
  note: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
};

function ShowCards() {
  const [cards, setCards] = useState([
    { id: 1, note: 'C' },
    { id: 2, note: 'Dm' },
    { id: 3, note: 'E' },
    { id: 4, note: 'Fmaj7' },
    { id: 5, note: 'G7' },
    { id: 6, note: 'A/F' },
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
