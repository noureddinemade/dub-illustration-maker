// src/App.js

import React from 'react';
import IllustrationCreator from './components/IllustrationCreator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center main-align">
      <div className="w-full max-w-[1200px]">
        <main>
          <IllustrationCreator />
        </main>
      </div>
    </div>
  );
}

export default App;