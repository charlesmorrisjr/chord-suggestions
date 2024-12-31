import './App.css';
import './Card.css';

const cards = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function Card({ note }) {
  return (
    <div class="card">
      {note}
      <div class="container">
        {note} Major
      </div>
    </div>
  );
}

function ShowCards() {
  return (
    <div>
      {cards.map((card, index) => (
        <Card key={index} note={card} />
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
