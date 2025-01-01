import './App.css';
import './Card.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

function ListCard({ id, note, onDelete }) {
  return (
    <div className="card">
      {note}
      <button className='delete-btn' onClick={() => onDelete(id)}>x</button>
    </div>
  );
}

function ChordCard({ id, note, onChoose }) {
  return (
    <div className="card" onClick={() => onChoose(id)}>
      {note}
    </div>
  );
}

ListCard.propTypes = {
  id: PropTypes.number.isRequired,
  note: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

ChordCard.propTypes = {
  id: PropTypes.number.isRequired,
  note: PropTypes.string.isRequired,
  onChoose: PropTypes.func.isRequired
};

function ShowListCards() {
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
        <ListCard 
          key={card.id} 
          id={card.id}
          note={card.note}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

function ShowChordCards() {
  const [chords, setChords] = useState([
    { id: 1, note: 'C' },
    { id: 2, note: 'D' },
    { id: 3, note: 'E' },
    { id: 4, note: 'F' },
    { id: 5, note: 'G' },
    { id: 6, note: 'A' },
    { id: 7, note: 'B' }
  ]);

  function handleChoose(cardId) {
    alert(`You have chosen ${chords.find(chord => chord.id === cardId).note} chord`);
  }

  return (
    <div>
      {chords.map((chord) => (
        <ChordCard 
          key={chord.id} 
          id={chord.id}
          note={chord.note}
          onChoose={handleChoose}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <div className='container'>
      <div className='left'>
        <ShowListCards />
      </div>
      <div className='right'>
        <ShowChordCards />
      </div>  
      <div className='bottom'>
        Bottom content
      </div>
    </div>

  );
}

export default App;
