import './App.css';
import './Card.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

const chordList = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const cardList = ['C', 'Am'];

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
  onSelect: PropTypes.func.isRequired
};

function ListCard({ id, note, onDelete }) {
  return (
    <div className="card">
      {note}
      <button className='delete-btn' onClick={() => onDelete(id)}>x</button>
    </div>
  );
}

function ChordCard({ id, note, onSelect }) {
  return (
    <div className="card" onClick={() => onSelect(id)}>
      {note}
    </div>
  );
}

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
  const [chords, setChords] = useState(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  const [selectedChord, setSelectedChord] = useState('');
  const chordExt = ['', 'min', '7', 'M7', 'min7', 'sus4', 'dim', 'dim7', 'aug', '6', '9', '11', '13'];

  function handleChordClick(chordId) {
    // Get the selected chord
    const chord = chords[chordId];
    setSelectedChord(chord);

    // Create combination of the selected chord with extensions
    const combinations = chordExt.map(ext => chord + ext);
    setChords(combinations);
  }

  function handleAdd(cardId) {
    // Add the card to the card list
    addCard(chords[cardId]);
    
    // Reset the chord list and selected chord
    setChords(chordList);
    setSelectedChord('');
  }
  
  return (
    <div>
      {chords.map((chord, id) => (
        <ChordCard 
          key={id} 
          id={id}
          note={chord}
          onSelect={selectedChord === '' ? handleChordClick : handleAdd}
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
