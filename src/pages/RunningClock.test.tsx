import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import RunningClock from './RunningClock';

describe('RunningClock', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with initial time 00:00', () => {
    render(<RunningClock />);
    const clock = screen.getByTestId('running-clock');
    expect(clock).toHaveTextContent('00:00');
  });

  it('displays all control buttons', () => {
    render(<RunningClock />);
    expect(screen.getByText('START')).toBeInTheDocument();
    expect(screen.getByText('PAUSE / RESUME')).toBeInTheDocument();
    expect(screen.getByText('RESET')).toBeInTheDocument();
  });

  it('displays minutes and seconds input fields', () => {
    render(<RunningClock />);
    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Seconds')).toBeInTheDocument();
  });

  it('updates minutes input value', async () => {
    const user = userEvent.setup();
    render(<RunningClock />);

    const minutesInput = screen.getByLabelText('Minutes');
    await user.clear(minutesInput);
    await user.type(minutesInput, '5');

    expect(minutesInput).toHaveValue(5);
  });

  it('updates seconds input value', async () => {
    const user = userEvent.setup();
    render(<RunningClock />);

    const secondsInput = screen.getByLabelText('Seconds');
    await user.clear(secondsInput);
    await user.type(secondsInput, '30');

    expect(secondsInput).toHaveValue(30);
  });

  it('starts timer and displays correct time', async () => {
    const user = userEvent.setup();
    render(<RunningClock />);

    const minutesInput = screen.getByLabelText('Minutes');
    const secondsInput = screen.getByLabelText('Seconds');

    await user.clear(minutesInput);
    await user.type(minutesInput, '1');
    await user.clear(secondsInput);
    await user.type(secondsInput, '30');

    await user.click(screen.getByText('START'));

    const clock = screen.getByTestId('running-clock');
    expect(clock).toHaveTextContent('01:30');
  });

  describe('timer behavior (with fake timers)', () => {
    it('counts down after starting', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<RunningClock />);

      const secondsInput = screen.getByLabelText('Seconds');
      await user.clear(secondsInput);
      await user.type(secondsInput, '5');

      await user.click(screen.getByText('START'));

      const clock = screen.getByTestId('running-clock');
      expect(clock).toHaveTextContent('00:05');

      vi.advanceTimersByTime(1000);
      expect(clock).toHaveTextContent('00:04');

      vi.advanceTimersByTime(1000);
      expect(clock).toHaveTextContent('00:03');
    });

    it('pauses and resumes timer', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<RunningClock />);

      const secondsInput = screen.getByLabelText('Seconds');
      await user.clear(secondsInput);
      await user.type(secondsInput, '10');

      await user.click(screen.getByText('START'));

      vi.advanceTimersByTime(2000);
      const clock = screen.getByTestId('running-clock');
      expect(clock).toHaveTextContent('00:08');

      // Pause
      await user.click(screen.getByText('PAUSE / RESUME'));
      vi.advanceTimersByTime(3000);
      expect(clock).toHaveTextContent('00:08'); // Should stay paused

      // Resume
      await user.click(screen.getByText('PAUSE / RESUME'));
      vi.advanceTimersByTime(2000);
      expect(clock).toHaveTextContent('00:06');
    });

    it('resets timer to initial state', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<RunningClock />);

      const minutesInput = screen.getByLabelText('Minutes');
      const secondsInput = screen.getByLabelText('Seconds');

      await user.clear(minutesInput);
      await user.type(minutesInput, '2');
      await user.clear(secondsInput);
      await user.type(secondsInput, '30');

      await user.click(screen.getByText('START'));
      vi.advanceTimersByTime(5000);

      await user.click(screen.getByText('RESET'));

      const clock = screen.getByTestId('running-clock');
      expect(clock).toHaveTextContent('00:00');
      expect(minutesInput).toHaveValue(0);
      expect(secondsInput).toHaveValue(0);
    });

    it('stops at zero and does not go negative', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<RunningClock />);

      const secondsInput = screen.getByLabelText('Seconds');
      await user.clear(secondsInput);
      await user.type(secondsInput, '3');

      await user.click(screen.getByText('START'));

      const clock = screen.getByTestId('running-clock');

      vi.advanceTimersByTime(5000);
      expect(clock).toHaveTextContent('00:00');
    });
  });
});
