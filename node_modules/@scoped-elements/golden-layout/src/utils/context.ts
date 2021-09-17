import { GoldenLayout } from 'golden-layout';
import { Context, createContext } from '@lit-labs/context';

export const goldenLayoutContext: Context<GoldenLayout> =
  createContext('golden-layout/root');
