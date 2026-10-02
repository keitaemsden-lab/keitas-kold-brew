import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import SliderInput from '../components/SliderInput';

describe('Home', () => {
  it('REGRESSION: has exactly one h1', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});

describe('App routing', () => {
  it('REGRESSION: / stays on Home even when a last tab was remembered', () => {
    window.localStorage.setItem('kkb_last_tab', JSON.stringify('/foam'));
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(window.location.pathname).toBe('/');
    expect(screen.getByRole('heading', { level: 1, name: "Keita's Kold Brew" })).toBeInTheDocument();
  });
  it('direct load of /concentrate renders the calculator', () => {
    window.history.pushState({}, '', '/concentrate');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Concentrate' })).toBeInTheDocument();
  });
});

describe('SliderInput', () => {
  it('REGRESSION: 4-digit value is wide enough and commits clamped', () => {
    const onChange = vi.fn();
    render(<SliderInput label="Coffee" value={3000} onChange={onChange} min={10} max={3500} step={50} unit=" g" />);
    const input = screen.getByRole('spinbutton', { name: 'Coffee' });
    expect(input).toHaveValue(3000);
    expect(input.className).toMatch(/\bw-24\b/);
    fireEvent.change(input, { target: { value: '9999' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(3500);
  });
});
