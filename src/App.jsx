import React, { useState } from 'react';

import NavBar from './components/NavBar';
import ItemListContainer from './components/ItemListContainer';

const App = () => {
  const [category, setCategory] = useState(null);

  return (
    <div className="App">
      <NavBar setCategory={setCategory} />
      <div className="main-content">
        {category && <ItemListContainer category={category} />}
        
      </div>
    </div>
  );
};

export default App;
