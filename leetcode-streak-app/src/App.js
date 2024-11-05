import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [streak, setStreak] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Функция для расчета streak
  const calculateStreak = (submissionCalendar) => {
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const dates = Object.keys(submissionCalendar).map(timestamp => {
      return new Date(parseInt(timestamp) * 1000).setHours(0, 0, 0, 0);
    }).sort((a, b) => b - a);

    let streakCount = 0;
    let yesterday = currentDate;

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const daysDifference = (yesterday - date) / (1000 * 60 * 60 * 24);

      if (daysDifference === 1) {
        streakCount++;
      } else if (daysDifference > 1) {
        break;
      }
      yesterday = date;
    }

    return streakCount;
  };

  // Функция для запроса данных с API
  const fetchLeetcodeData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      const data = await response.json();

      if (data.status === 'success') {
        const streakCount = calculateStreak(data.submissionCalendar);
        setStreak(streakCount);
        setTotalSolved(data.totalSolved);

        // Сохранение streak и totalSolved в localStorage
        localStorage.setItem('streak', streakCount);
        localStorage.setItem('totalSolved', data.totalSolved);
      } else {
        setError('Error fetching data');
      }
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // При изменении имени пользователя сохраняем его в localStorage
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    localStorage.setItem('username', newUsername);  // Сохранение в localStorage
  };

  // Загружаем данные из localStorage при загрузке компонента
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedStreak = localStorage.getItem('streak');
    const savedTotalSolved = localStorage.getItem('totalSolved');

    if (savedUsername) {
      setUsername(savedUsername);
    }

    if (savedStreak) {
      setStreak(Number(savedStreak));
    }

    if (savedTotalSolved) {
      setTotalSolved(Number(savedTotalSolved));
    }
  }, []); // Выполняется один раз при загрузке компонента

  return (
    <div className="App">
      <h1>LeetCode Streak Tracker</h1>
      <input
        type="text"
        placeholder="Enter your LeetCode username"
        value={username}
        onChange={handleUsernameChange}
      />
      <button onClick={fetchLeetcodeData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Streak'}
      </button>

      {error && <p className="error">{error}</p>}

      {!loading && !error && streak !== null && (
        <div>
          <p>Your current streak: {streak} days</p>
          <p>Total solved problems: {totalSolved}</p>
        </div>
      )}
    </div>
  );
}

export default App;
