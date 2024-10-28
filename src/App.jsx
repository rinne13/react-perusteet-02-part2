import { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './components/Note';
import './App.css';  // Оставляем подключение стилей

const App = () => {
  const [notes, setNotes] = useState([]); 
  const [newNote, setNewNote] = useState('');  
  const [showAll, setShowAll] = useState(false);  // Теперь по умолчанию показываются важные заметки

  // Используем useEffect для загрузки заметок
  useEffect(() => {
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        setNotes(response.data);
      })
  }, []);

  // Функция добавления новой заметки
  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }
  
    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
        console.log(response)
      })

      setNewNote('');
  }

  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')
  }

  


  // Обработка изменения текста новой заметки
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  // Фильтрация заметок: все или только важные
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important);

  // Функция изменения важности заметки
  const changeImportanceOf = (id) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, important: !note.important } : note
    );
    setNotes(updatedNotes);
  };

  
  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
        
      </div> 

      

      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)
            }

            
          />
          
          
        )
        
        }
        
        
      </ul>

      

     
  
      {/* Форма для добавления новой заметки */}
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
  
}

export default App;
