import { render, screen, fireEvent } from '@testing-library/react';
import PerformanceCheck from './PerformanceCheck';

describe('PerformanceCheck', () => {
  it('should render user list and increment button', async () => {
    render(<PerformanceCheck />);

    expect(screen.getByText('User List')).toBeInTheDocument();
    expect(screen.getByText('Increment: 0')).toBeInTheDocument();

    // Wait for users to load
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('should increment count when button is clicked', () => {
    render(<PerformanceCheck />);

    const button = screen.getByRole('button', { name: /increment/i });

    fireEvent.click(button);
    expect(screen.getByText('Increment: 1')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText('Increment: 2')).toBeInTheDocument();
  });

  it('should NOT re-render UserList when count changes', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<PerformanceCheck />);

    // Wait for initial render
    await screen.findByText('Alice');

    // Clear the spy to ignore initial render logs
    consoleSpy.mockClear();

    // Click the increment button multiple times
    const button = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // UserList should NOT have re-rendered (console.log should not be called)
    expect(consoleSpy).not.toHaveBeenCalledWith('UserList rendered');

    consoleSpy.mockRestore();
  });
});
