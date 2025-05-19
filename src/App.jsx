import './App.css';
import './Card.css';
import './Button.css';
import './MenuControls.css';


import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faFileExport } from '@fortawesome/free-solid-svg-icons';
import * as Tone from 'tone';
import PropTypes from 'prop-types';

import chordData from './data/chords.json';
import chordNotesData from './data/chord_notes.json';

const API_BASE_URL = 'https://api.hooktheory.com/v1/';
const AUTH_ENDPOINT = 'users/auth';
const TRENDS_ENDPOINT = 'trends/nodes';

const cardList = [];

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

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

MenuControls.propTypes = {
  chords: PropTypes.arrayOf(PropTypes.string).isRequired
};

// Create a single sampler instance at the module level
const sampler = new Tone.Sampler({
  urls: {
    C4: "C4.mp3",
    "D#4": "Ds4.mp3",
    "F#4": "Fs4.mp3",
    A4: "A4.mp3",
  },
  release: 1,
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

// Set the volume of the sampler
sampler.volume.value = -5;


function playSample(notes) {
  notes = notes.map(note => note + '4');
  
  Tone.loaded().then(() => {
    sampler.triggerAttackRelease(notes, 1.5);
  });
}

function romanToChords(romanNumerals, key = 'C') {
  // Return null if input is not an array
  if (!Array.isArray(romanNumerals)) {
    return null;
  }

  return romanNumerals.map(numeral => {
    // Convert key to number (0-11)
    const keyIndex = NOTE_NAMES.indexOf(key);
    if (keyIndex === -1) return null;

    // Parse roman numeral
    const numeralMap = {
      'I': 0,
      'II': 1,
      'III': 2,
      'IV': 3,
      'V': 4,
      'VI': 5,
      'VII': 6,
      'i': 0,
      'ii': 1,
      'iii': 2,
      'iv': 3,
      'v': 4,
      'vi': 5,
      'vii': 6
    };

    // Get the base numeral without any modifiers
    const baseNumeral = numeral.replace(/[^IViv]+/g, '');
    const scalePosition = numeralMap[baseNumeral];
    
    if (scalePosition === undefined) return null;

    // Calculate the root note index
    const rootIndex = (keyIndex + MAJOR_SCALE[scalePosition]) % 12;
    
    // Determine if the chord is major or minor based on case
    const isMinor = baseNumeral === baseNumeral.toLowerCase();
    
    // Handle special cases like diminished (o) or augmented (+)
    const isDiminished = numeral.includes('o');
    const isAugmented = numeral.includes('+');

    // Calculate triad intervals based on chord quality
    let intervals;
    if (isDiminished) {
      intervals = [0, 3, 6]; // Root, minor third, diminished fifth
    } else if (isAugmented) {
      intervals = [0, 4, 8]; // Root, major third, augmented fifth
    } else if (isMinor) {
      intervals = [0, 3, 7]; // Root, minor third, perfect fifth
    } else {
      intervals = [0, 4, 7]; // Root, major third, perfect fifth
    }

    // Create array of notes for the chord
    return intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return NOTE_NAMES[noteIndex] + '4';
    });
  });
}

function MenuControls({ chords }) {
  console.log(chords);
  console.log(romanToChords(chords));

  function playChords() {
    Tone.loaded().then(() => {
      // Clear all scheduled events
      Tone.Transport.cancel();
      // Reset transport time and state
      Tone.Transport.stop();
      Tone.Transport.position = 0;
      
      let currentTime = 0;
      romanToChords(chords).forEach((chord) => {
        Tone.Transport.schedule((time) => {
          sampler.triggerAttackRelease(chord, 1, time);
        }, currentTime);
        currentTime += 1;
      });

      // Start playback
      Tone.Transport.start();
    });
  }

  function stopPlayChords() {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
  }

  function exportFile() {
  }
    
  return (
    <div className="menu-controls">
      <button className="play-button">
        <FontAwesomeIcon icon={faPlay} onClick={playChords} />
      </button>
      <button className="stop-button">
        <FontAwesomeIcon icon={faStop} onClick={stopPlayChords} />
      </button>
      <button className="export-button">
        <FontAwesomeIcon icon={faFileExport} onClick={exportFile} />
      </button>
    </div>
  )
}

function ListCard({ id, note, onDelete }) {
  return (
    <button 
      className="button" 
      onClick={() => onDelete(id)}
      dangerouslySetInnerHTML={{ __html: note}}
    />
  );
}

function ChordCard({ id, note, onSelect }) {
  return (
    <button 
      className="button" 
      onClick={() => onSelect(id)}
      dangerouslySetInnerHTML={{ __html: note}}
    />
  );
}

function ShowListCards({ cards, setCards }) {    
  function handleDelete(cardId) {
    // Remove the card from the list
    setCards(cards.filter((card, id) => id !== cardId));
  }

  return (
    <div className='chord-grid'>
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
      // Take top 20 chords from the list
      const topChords = nextChords.slice(0, 20).map(chord => chord.chord_HTML);
      
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
   
    const chordId = chordData.find(chord => chord.chord_HTML === chords[cardId]).chord_ID;
    const chordNotes = chordNotesData[chordId];
    
    try {
      playSample(chordNotes);
    } catch {
      console.log("Cannot find chord notes");
      console.log(chordNotes);
    }
  }
  
  return (
    <div className='chord-grid'>
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
      <div className='top'>
        <MenuControls chords={cards} />
        <ShowListCards cards={cards} setCards={setCards} />
      </div>
      <div className='bottom'>
        <ShowChordCards addCard={addCard} cards={cards} fetchNextChords={fetchNextChords}/>
      </div>
    </div>

  );
}

export default App;
