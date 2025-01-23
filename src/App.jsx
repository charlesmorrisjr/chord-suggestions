import './App.css';
import './Card.css';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import chordData from './data/chords.json';

const API_BASE_URL = 'https://api.hooktheory.com/v1/';
const AUTH_ENDPOINT = 'users/auth';
const TRENDS_ENDPOINT = 'trends/nodes';

const cardList = [];

ShowListCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCards: PropTypes.func.isRequired
};

ShowChordCards.propTypes = {
  addCard: PropTypes.func.isRequired,
  cards: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchNextChords: PropTypes.func.isRequired
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

function ShowChordCards({ addCard, cards, fetchNextChords }) {
  const [chords, setChords] = useState([]);

  const handleShowNextChords = useCallback(async () => {
    // Change the chord list to the next most likely chords in the progression
    // NOTE: useCallback is used to prevent the function from being recreated on every render due to useEffect below
    
    // TODO: Add option to send only the last chord progression or the entire progression
    // Get the last chord from the progression and convert it to a chord ID to send to the API
    const lastChord = cards[cards.length - 1];
    const lastChordID = lastChord ? chordData.find(chord => chord.chord_HTML === lastChord).chord_ID : '';
    console.log(lastChordID);
    
    // Fetch and process the next possible chords
    const nextChords = await fetchNextChords(lastChordID);
    
    if (nextChords) {
      // Take top 5 chords from the list
      const topChords = nextChords.slice(0, 5).map(chord => chord.chord_HTML);
      
      setChords(topChords);
    }
  }, [cards, fetchNextChords]);

  useEffect(() => {
    // If there are cards in the list, show the next likely chords
    // Otherwise, show the default chord list
    handleShowNextChords();
  }, [cards, handleShowNextChords]);

  function handleAdd(cardId) {
    // Add the card to the card list
    addCard(chords[cardId]);
  }
  
  return (
    <div>
      {chords.map((chord, id) => (
        <ChordCard 
          key={id} 
          id={id}
          note={chord}
          onSelect={handleAdd}
        />
      ))}
    </div>
  );
}

function App() {
  const [cards, setCards] = useState(cardList);
  const [authToken, setAuthToken] = useState(null);

  // Log into the Hooktheory API
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
      console.log(err.message);
    }
  };

  // Fetch next possible chords in the progression
  const fetchNextChords = async (childPath) => {
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
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  // Authenticate the user on component mount
  useEffect(() => {
    authenticate(import.meta.env.VITE_HOOKTHEORY_USERNAME, import.meta.env.VITE_HOOKTHEORY_PASSWORD);
  }, []);

  const addCard = (newCard) => {
    setCards([...cards, newCard]);
  }

  return (
    <div className='container'>
      <div className='left'>
        <ShowListCards cards={cards} setCards={setCards} />
      </div>
      <div className='right'>
        <ShowChordCards addCard={addCard} cards={cards} fetchNextChords={fetchNextChords}/>
      </div>  
      <div className='bottom'>
        Bottom content
        <button onClick={() => fetchNextChords()}>Fetch chord progressions</button>
      </div>
    </div>

  );
}

export default App;
