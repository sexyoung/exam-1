import { useState } from 'react';
import { isCycle } from '../utils/isCycle';

function IsCycleCheck() {
  const [inputA, setInputA] = useState('3,1,2');
  const [inputB, setInputB] = useState('2,3,1');
  const [result, setResult] = useState<boolean | null>(null);

  const parseArray = (input: string): number[] => {
    return input
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number);
  };

  const handleCheck = () => {
    const A = parseArray(inputA);
    const B = parseArray(inputB);
    setResult(isCycle(A, B));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>IsCycle Check</h2>
      <p>檢查有向圖是否形成單一環（cycle）</p>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Array A (comma separated):
          <br />
          <input
            type="text"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Array B (comma separated):
          <br />
          <input
            type="text"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
          />
        </label>
      </div>

      <button onClick={handleCheck} style={{ padding: '10px 20px' }}>
        Check Cycle
      </button>

      {result !== null && (
        <div style={{ marginTop: '20px', fontSize: '18px' }}>
          Result: <strong style={{ color: result ? 'green' : 'red' }}>
            {result ? 'TRUE - It is a cycle!' : 'FALSE - Not a cycle'}
          </strong>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h4>Test Examples:</h4>
        <ul>
          <li>A=[3,1,2], B=[2,3,1] → true</li>
          <li>A=[1,2,1], B=[2,3,3] → false</li>
          <li>A=[1,2,3,4], B=[2,1,4,4] → false</li>
          <li>A=[1,2,3,4], B=[2,1,4,3] → false (two disjoint cycles)</li>
        </ul>
      </div>
    </div>
  );
}

export default IsCycleCheck;
