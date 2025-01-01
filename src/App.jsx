import './App.css';
import './Card.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

const cardList = ['C', 'Dm', 'E', 'Fmaj7', 'G7', 'A/F', 'B'];

function ListCard({ id, note, onDelete }) {
  return (
    <div className="card">
      {note}
      <button className='delete-btn' onClick={() => onDelete(id)}>x</button>
    </div>
  );
}

function ChordCard({ id, note, onAdd }) {
  return (
    <div className="card" onClick={() => onAdd(id)}>
      {note}
    </div>
  );
}

ShowListCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCards: PropTypes.func.isRequired
};

ShowChordCards.propTypes = {
  addCard: PropTypes.func.isRequired
};

ListCard.propTypes = {
  id: PropTypes.number.isRequired,
  note: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

ChordCard.propTypes = {
  id: PropTypes.number.isRequired,
  note: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired
};

function ShowListCards({ cards, setCards }) {    
  function handleDelete(cardId) {
    // Remove the card from the list
    setCards(cards.filter((card, id) => id !== cardId));
  }

  return (
    <div>
      {cards.map((note, id) => (
        <ListCard 
          key={id} 
          id={id}
          note={note}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

function ShowChordCards({ addCard }) {
  const [chords, setChords] = useState([
    { id: 1, note: 'C' },
    { id: 2, note: 'D' },
    { id: 3, note: 'E' },
    { id: 4, note: 'F' },
    { id: 5, note: 'G' },
    { id: 6, note: 'A' },
    { id: 7, note: 'B' }
  ]);

  function handleAdd(cardId) {
    // Add the card to the card list
    addCard(chords.find(chord => chord.id === cardId).note);
  }

  return (
    <div>
      {chords.map((chord) => (
        <ChordCard 
          key={chord.id} 
          id={chord.id}
          note={chord.note}
          onAdd={handleAdd}
        />
      ))}
    </div>
  );
}

function App() {
  const [cards, setCards] = useState(cardList);

  const addCard = (newCard) => {
    setCards([...cards, newCard]);
  }

  return (
    <div className='container'>
      <div className='left'>
        <ShowListCards cards={cards} setCards={setCards} />
      </div>
      <div className='right'>
        <ShowChordCards addCard={addCard} />
      </div>  
      <div className='bottom'>
        Bottom content
      </div>
    </div>

  );
}

export default App;
