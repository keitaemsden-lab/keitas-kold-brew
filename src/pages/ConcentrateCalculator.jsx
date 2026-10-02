import React from 'react';
import Calculator from '../components/Calculator';
import { CALCS } from '../calc/config';

export default function ConcentrateCalculator() {
  return <Calculator key="concentrate" calc={CALCS.concentrate} />;
}
