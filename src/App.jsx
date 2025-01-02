import './App.css';
import './Card.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import chordData from './data/chords.json';

const API_BASE_URL = 'https://api.hooktheory.com/v1/';
const AUTH_ENDPOINT = 'users/auth';
const TRENDS_ENDPOINT = 'trends/nodes';

const chordList = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
const cardList = ['I'];

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
  const [chords, setChords] = useState(chordList);
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
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState(null);

  const authenticate = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setAuthToken(data.activkey);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch chord progressions
  const fetchChordProgressions = async (childPath = '') => {
    if (!authToken) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}${TRENDS_ENDPOINT}${childPath ? `?cp=${childPath}` : ''}`, 
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch chord progressions');
      }

      const data = await response.json();
      // Output chord progression data
      console.log('Chord progressions:', data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Authenticate the user on component mount
  useEffect(() => {
    authenticate(import.meta.env.VITE_HOOKTHEORY_USERNAME, import.meta.env.VITE_HOOKTHEORY_PASSWORD);
  }, []);

  const addCard = (newCard) => {
    setCards([...cards, newCard]);
  }

  // Debug
  console.log(chordData.find(chord => chord.chord_HTML === "IV"));

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
        <button onClick={() => fetchChordProgressions()}>Fetch chord progressions</button>
      </div>
    </div>

  );
}

export default App;
