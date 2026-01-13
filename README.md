## Performance Check - 效能優化

### 題目
**問題：**
1. 這個元件有什麼效能問題？
2. 如何優化？
3. 重寫優化後的程式碼

---

### 解題過程

#### Step 1: 分析問題

首先觀察這個元件的結構：
- 有兩個 state：`users`（使用者列表）和 `count`（計數器）
- 這兩個 state **完全不相關**，但放在同一個元件裡

**問題在於：** 當點擊按鈕改變 `count` 時，整個元件會重新渲染，包括：
- `users.map()` 會重新執行
- 每個 `<li>` 都會重新建立

這是不必要的，因為 `users` 根本沒有改變。

#### Step 2: 找出具體的效能問題

| 問題 | 程式碼 | 影響 |
|------|--------|------|
| 不必要的重新渲染 | `users.map((user) => ...)` | count 變時，user list 也跟著重新渲染 |
| Inline function | `onClick={() => setCount(count + 1)}` | 每次渲染都建立新的函數物件 |
| 閉包依賴 | `setCount(count + 1)` | 依賴外部變數 count |

#### Step 3: 優化策略

1. **React.memo** - 將 UserList 拆成獨立元件，用 memo 包裝，只在 props 改變時才重新渲染
2. **useCallback** - 穩定的函數 reference，避免每次渲染都建立新函數
3. **Functional Update** - 使用 `setCount(prev => prev + 1)` 取代 `setCount(count + 1)`

#### Step 4: 實作優化後的程式碼

```tsx
import React, { useState, useEffect, useCallback } from 'react';

// 優化 1: 拆成獨立元件 + React.memo
const UserListComponent = React.memo(({ users }) => {
  console.log('UserList rendered');
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
});

function PerformanceCheck() {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("https://api.example.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // 優化 2: useCallback + functional update
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
```

---

### 驗證優化效果

#### 方法 1: Console Log

在 `UserListComponent` 加入 `console.log('UserList rendered')`，然後：

- ❌ **優化前**：每次點擊按鈕都會印出 log
- ✅ **優化後**：只有初始載入時印出，之後點擊不會再印

#### 方法 2: 單元測試

```tsx
it('should NOT re-render UserList when count changes', async () => {
  const consoleSpy = vi.spyOn(console, 'log');
  render(<PerformanceCheck />);

  await screen.findByText('Alice');
  consoleSpy.mockClear();

  // 點擊按鈕多次
  fireEvent.click(screen.getByRole('button'));
  fireEvent.click(screen.getByRole('button'));

  // UserList 不應該重新渲染
  expect(consoleSpy).not.toHaveBeenCalledWith('UserList rendered');
});
```

---

### 總結

| 優化技術 | 用途 |
|----------|------|
| `React.memo` | 防止 props 沒變時的不必要重新渲染 |
| `useCallback` | 穩定的函數 reference |
| Functional Update | 避免閉包捕獲舊的 state 值 |

**核心概念：** 將不相關的 state 拆分到不同元件，並用 `React.memo` 包裝，讓每個元件只關心自己需要的資料。

---

## 開發工具：Claude Code

本專案使用 [Claude Code](https://claude.ai/claude-code) 輔助開發。

### 主要用途

- **程式碼審查** - 分析效能問題、找出潛在 bug
- **重構建議** - 拆分元件、優化架構
- **測試撰寫** - 產生單元測試、邊界值測試
- **文件產生** - README、註解
- **CI/CD 設定** - GitHub Actions workflow

### 常用指令

| 指令 | 說明 |
|------|------|
| `@檔案路徑` | 引用特定檔案進行討論 |
| `@資料夾/` | 引用整個資料夾 |
| 選取程式碼 | IDE 中選取後直接詢問 |
