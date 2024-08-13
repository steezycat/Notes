
export const createNote = async (title, content, status) => {
  try {
    const response = await fetch('http://localhost:3000/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, status }),
    });
    return response.json();
  } catch (error) {
    console.error('Error creating note:', error);
  }
};

export const getNotes = async () => {
  try {
    const response = await fetch('http://localhost:3000/notes');
    return response.json();
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
};

export const deleteNote = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/notes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json(); // if you expect a response
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error; // Propagate the error to the caller
  }
};

export const updateNote = async (id, updatedNote) => {
  try {
    const response = await fetch(`http://localhost:3000/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNote),
    });
    
    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(errorMessage.error || 'Failed to update note');
    }
    
    const updatedNoteResponse = await response.json();
    console.log('Updated note:', updatedNoteResponse);
    return updatedNoteResponse;
  } catch (error) {
    console.error('Error updating note:', error.message);
    // Handle error appropriately
  }
};