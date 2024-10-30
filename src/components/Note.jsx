const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important';

  return (
    <li>
      {note.content}
      <p><button onClick={toggleImportance}>{label}</button></p>
    </li>
  );
};

export default Note;
