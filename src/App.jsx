import { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './components/Note';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]); 
  const [newNote, setNewNote] = useState('');  
  const [showAll, setShowAll] = useState(false);

  // Загрузка заметок
  useEffect(() => {
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        setNotes(response.data);
      });
  }, []);

  console.log('render', notes.length, 'notes');

  // Добавление новой заметки
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        setNotes(notes.concat(response.data));
        setNewNote('');
      });
  };

  // Фильтрация заметок: все или только важные
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important);

  // Смена важности заметки
  const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id === id);
    const changedNote = { ...note, important: !note.important };

    axios
      .put(`http://localhost:3001/notes/${id}`, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data));
      })
      .catch(error => {
        console.error(`The note '${note.content}' was already deleted from the server.`);
        setNotes(notes.filter(note => note.id !== id));
      });
  };

  // Обработка изменения текста новой заметки
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      {/* Форма для добавления новой заметки */}
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
