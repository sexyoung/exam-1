import React, { useState, useEffect, useCallback } from 'react';

// 優化 1: 將 UserList 拆成獨立元件並用 React.memo 包裝
// 這樣只有當 users prop 改變時才會重新渲染
const UserListComponent = React.memo(({ users }: { users: { id: number; name: string }[] }) => {
  console.log('UserList rendered'); // 用來驗證是否重新渲染
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
});

function PerformanceCheck() {
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Mock data (原題是 fetch API)
    /**
      fetch("https://api.example.com/users")
        .then((res) => res.json())
        .then((data) => setUsers(data));
     */
    const mockUsers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ];
    setUsers(mockUsers);
  }, []);

  // 優化 2: 使用 useCallback 避免每次渲染都建立新函數
  // 優化 3: 使用 functional update (prev => prev + 1) 避免依賴外部 count
  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <button onClick={handleIncrement}>Increment: {count}</button>
      <UserListComponent users={users} />
    </div>
  );
}

export default PerformanceCheck;
