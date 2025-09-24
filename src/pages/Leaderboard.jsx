import { useEffect, useState } from "react";


export default function Leaderboard() {
    const [entries, setEntries] = useState([]);
    
    useEffect(() => {
      //read from localStorage on mount
      const storedScore = JSON.parse(localStorage.getItem('quizResults') || '[]'); 
      //sort from best to worst
      storedScore.sort((a, b) => b.score - a.score);
      //pass storedScore to setEntries
      setEntries(storedScore);
    }, []);

    if (entries.length === 0) {
      return <p>No quiz results yet.</p>;
    }

    //group by region
    //for each entry, we check if accumulator[entry.region] exists.
    //if not, create it: accumulator[entry.region] = []
    //push the entry into the right regions array
    //return accumulator so the next loop can keep building on it
    const grouped = entries.reduce((accumulator, entry) => {
      if (!accumulator[entry.region]) accumulator[entry.region] = [];
      accumulator[entry.region].push(entry);
      return accumulator;
    }, {});
  
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
   
      {Object.entries(grouped).map(([region, regionEntries]) => (
        <div key={region} className="leaderboard-region">
          <h3>{region}</h3>
          <ol>
            {regionEntries.map((entry, idx) => (
              <li key={`${entry.username}-${entry.date}-${idx}`}>
                {entry.username} — Score: {entry.score}/{entry.total}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
  }