import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import Home from '../pages/Home';
import ExactInput, { parseExact } from '../components/ExactInput';
import SteepDock, { readyAt } from '../components/SteepDock';
import { graduations, layerHeights } from '../components/Vessel';
import { rulerOffset, TICK } from '../components/Ruler';
import { CALCS, snapDisplay, stepPart, toBase, toDisplay } from '../calc/config';
import { TIMER_STATE_KEY } from '../hooks/useTimer';
import { UnitProvider } from '../state/unit';

const at = (path) => { window.history.pushState({}, '', path); return render(<App />); };
const lead = () => screen.getByTestId('lead-value').textContent.replace(/\s+/g, ' ').trim();

describe('Home', () => {
  it('REGRESSION: has exactly one h1', () => {
    render(<MemoryRouter><UnitProvider><Home /></UnitProvider></MemoryRouter>);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
  it('links all three calculators with their saved batch', () => {
    render(<MemoryRouter><UnitProvider><Home /></UnitProvider></MemoryRouter>);
    const links = screen.getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/concentrate', '/dilution', '/foam']);
    expect(links[0]).toHaveTextContent('3000 g coffee12.00 L water to add');
  });
});

describe('App routing', () => {
  it('REGRESSION: / stays on Home even when a last tab was remembered', () => {
    window.localStorage.setItem('kkb_last_tab', JSON.stringify('/foam'));
    at('/');
    expect(window.location.pathname).toBe('/');
    expect(screen.getByRole('heading', { level: 1, name: "Keita's Kold Brew" })).toBeInTheDocument();
  });
  it('direct load of /concentrate renders the calculator', () => {
    at('/concentrate');
    expect(screen.getByRole('heading', { level: 1, name: 'Concentrate' })).toBeInTheDocument();
  });
  it('marks the current calculator in the bar', () => {
    at('/dilution');
    expect(screen.getByRole('link', { name: 'Dilution' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Concentrate' })).not.toHaveAttribute('aria-current');
  });
  it('the steep dock is on every route', () => {
    for (const p of ['/', '/concentrate', '/dilution', '/foam']) {
      const { unmount } = at(p);
      expect(screen.getByRole('timer')).toBeInTheDocument();
      unmount();
    }
  });
});

describe('Calculators', () => {
  it('concentrate default: 3000 g gives 12.00 L water, 9.60 L yield', () => {
    at('/concentrate');
    expect(lead()).toBe('12.00 L');
    expect(screen.getByRole('table')).toHaveTextContent('9.60 L');
  });
  it('typed exact value updates the batch and clamps on blur', () => {
    at('/concentrate');
    const input = screen.getByRole('spinbutton', { name: 'Coffee' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '500' } });
    expect(lead()).toBe('2.00 L');
    fireEvent.change(input, { target: { value: '9999' } });
    fireEvent.blur(input);
    expect(input).toHaveValue(3500);
    expect(lead()).toBe('14.00 L');
  });
  it('vessel fill line and ruler are keyboard sliders on the same value', () => {
    at('/concentrate');
    const line = screen.getByRole('slider', { name: 'Coffee fill line' });
    const ruler = screen.getByRole('slider', { name: 'Coffee scale' });
    fireEvent.keyDown(line, { key: 'ArrowUp' });
    expect(line).toHaveAttribute('aria-valuenow', '3050');
    expect(ruler).toHaveAttribute('aria-valuenow', '3050');
    fireEvent.keyDown(ruler, { key: 'Home' });
    expect(line).toHaveAttribute('aria-valuenow', '10');
    fireEvent.keyDown(line, { key: 'End' });
    expect(lead()).toBe('14.00 L');
  });
  it('ratio stepper persists in the original storage shape', () => {
    at('/concentrate');
    fireEvent.click(screen.getByRole('button', { name: 'More water parts' }));
    expect(lead()).toBe('13.50 L');
    expect(JSON.parse(window.localStorage.getItem('kkb_concentrate_ratio'))).toBe(4.5);
    fireEvent.click(screen.getByRole('button', { name: "Reset to Keita's 1 : 4" }));
    expect(lead()).toBe('12.00 L');
  });
  it('dilution default 2000 ml gives 2.50 L water, 500 ml syrup, 5.00 L total', () => {
    at('/dilution');
    expect(lead()).toBe('2.50 L');
    const t = screen.getByRole('table');
    expect(t).toHaveTextContent('500 ml');
    expect(t).toHaveTextContent('5.00 L');
  });
  it('foam preset glides to the new batch (reduced motion: instant)', () => {
    window.matchMedia = (q) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} });
    at('/foam');
    expect(lead()).toBe('1.60 L');
    fireEvent.click(screen.getByRole('button', { name: /^Half/ }));
    expect(lead()).toBe('800 ml');
    expect(screen.getByRole('button', { name: /^Half/ })).toHaveAttribute('aria-pressed', 'true');
    delete window.matchMedia;
  });
  it('foam preset glides over about a second with motion on', () => {
    vi.useFakeTimers();
    at('/foam');
    fireEvent.click(screen.getByRole('button', { name: /^Double/ }));
    act(() => { vi.advanceTimersByTime(1200); });
    expect(lead()).toBe('3.20 L');
    vi.useRealTimers();
  });
  it('imperial unit converts and persists across routes', () => {
    at('/concentrate');
    fireEvent.click(screen.getByRole('button', { name: 'Imperial' }));
    expect(lead()).toBe('50.72 cups');
    expect(JSON.parse(window.localStorage.getItem('kkb_unit'))).toBe('imperial');
    fireEvent.click(screen.getByRole('link', { name: 'Dilution' }));
    expect(lead()).toBe('10.57 cups');
  });
  it('amount persists after it settles', () => {
    vi.useFakeTimers();
    at('/dilution');
    fireEvent.click(screen.getByRole('button', { name: /^Litre/ }));
    act(() => { vi.advanceTimersByTime(1100); });
    act(() => { vi.advanceTimersByTime(300); });
    expect(JSON.parse(window.localStorage.getItem('kkb_dilution_amount'))).toBe(1000);
    vi.useRealTimers();
  });
});

describe('ExactInput', () => {
  it('REGRESSION: 4-digit value fits and commits clamped', () => {
    const onCommit = vi.fn();
    render(<ExactInput id="x" label="Coffee" value={3000} min={10} max={3500} step={50} unit="g" onCommit={onCommit} />);
    const input = screen.getByRole('spinbutton', { name: 'Coffee' });
    expect(input).toHaveValue(3000);
    expect(input.className).toMatch(/\bexact__in\b/); // 9ch wide in CSS
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '9999' } });
    fireEvent.blur(input);
    expect(onCommit).toHaveBeenLastCalledWith(3500);
  });
  it('parseExact handles junk and commas', () => {
    expect(parseExact('abc', 1, 10)).toBeNull();
    expect(parseExact('2,5', 1, 10)).toBe(2.5);
    expect(parseExact('0', 1, 10)).toBe(1);
  });
});

describe('Vessel and ruler maths', () => {
  it('layers are drawn to scale', () => {
    const c = CALCS.concentrate;
    const jar = c.jar(3500, { ratio: 4 }, 3500);
    const { fill, layers } = layerHeights(jar, 500);
    expect(fill).toBeCloseTo(500);
    expect(layers.map((l) => l.kind)).toEqual(['held', 'brew']);
    expect(layers[0].h).toBeCloseTo(100);
    expect(layers[1].h).toBeCloseTo(400);
  });
  it('graduations stay at seven or fewer marks', () => {
    const g = graduations(14000, 'metric', 560);
    expect(g.marks.length).toBeLessThanOrEqual(7);
    expect(g.marks[0].label).toBe('2 L');
  });
  it('ruler centres the value under the needle', () => {
    expect(rulerOffset(400, 3000, 50)).toBe(200 - 60 * TICK);
  });
  it('snap, convert and step', () => {
    expect(snapDisplay(CALCS.concentrate.metric, 3024)).toBe(3000);
    expect(snapDisplay(CALCS.concentrate.metric, 1)).toBe(10);
    expect(toDisplay(CALCS.foam, 'imperial', toBase(CALCS.foam, 'imperial', 12))).toBeCloseTo(12);
    expect(stepPart(CALCS.concentrate.parts[0], 8, 1)).toBe(8);
    expect(stepPart(CALCS.concentrate.parts[0], 4, -1)).toBe(3.5);
  });
});

describe('SteepDock', () => {
  it('starts, pauses and resets; hours locked while running', () => {
    render(<SteepDock />);
    expect(screen.getByRole('timer')).toHaveTextContent('18:00:00');
    fireEvent.click(screen.getByRole('button', { name: 'One hour more' }));
    expect(screen.getByRole('timer')).toHaveTextContent('19:00:00');
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByRole('button', { name: 'One hour more' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(screen.getByRole('button', { name: /Resume|Start/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('timer')).toHaveTextContent('19:00:00');
    expect(JSON.parse(window.localStorage.getItem(TIMER_STATE_KEY)).targetHours).toBe(19);
  });
  it('clamps hours to 12 to 24', () => {
    render(<SteepDock />);
    const less = screen.getByRole('button', { name: 'One hour less' });
    for (let i = 0; i < 10; i += 1) fireEvent.click(less);
    expect(screen.getByRole('timer')).toHaveTextContent('12:00:00');
    expect(less).toBeDisabled();
  });
  it('shows done and announces completion', () => {
    window.localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({ targetHours: 12, totalSeconds: 43200, remaining: 0, endsAt: 1, finished: true }));
    render(<SteepDock />);
    expect(screen.getByRole('status')).toHaveTextContent('Brew complete. Time to strain.');
    expect(within(screen.getByRole('region', { name: 'Steep' })).getByText('Done. Strain it now')).toBeInTheDocument();
  });
  it('readyAt formats an Australian weekday and time', () => {
    expect(readyAt(new Date(2026, 9, 3, 6, 0).getTime(), 3600)).toMatch(/^Sat 7:00\s?am$/i);
  });
});
