import React from 'react';
import Calculator from '../components/Calculator';
import { CALCS } from '../calc/config';

export default function DilutionCalculator() {
  return <Calculator key="dilution" calc={CALCS.dilution} />;
}
