import React from 'react';
import Calculator from '../components/Calculator';
import { CALCS } from '../calc/config';

export default function ColdFoamCalculator() {
  return <Calculator key="foam" calc={CALCS.foam} />;
}
