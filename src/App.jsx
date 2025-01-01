import './App.css';
import './Card.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

function Card({ id, note, onDelete }) {
  return (
    <div className="card">
      {note}
      {onDelete && <button className='delete-btn' onClick={() => onDelete(id)}>x</button>}
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

function ShowChordChoices() {
  const [chords, setChords] = useState([
    { id: 1, note: 'C' },
    { id: 2, note: 'D' },
    { id: 3, note: 'E' },
    { id: 4, note: 'F' },
    { id: 5, note: 'G' },
    { id: 6, note: 'A' },
    { id: 7, note: 'B' }
  ]);

  return (
    <div>
      {chords.map((chord) => (
        <Card 
          key={chord.id} 
          id={chord.id}
          note={chord.note}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <div className='container'>
      <div className='left'>
        <ShowCards />
      </div>
      <div className='right'>
        <ShowChordChoices />
      </div>  
      <div className='bottom'>
        Bottom content
      </div>
    </div>

  );
}

export default App;
