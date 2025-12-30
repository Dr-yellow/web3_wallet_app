/**
 * 交易主题色
 */
import { greenScale, redScale } from "./base";

export type MarketDirection = 'up' | 'down';

export interface MarketColorTheme {
  up: string;
  down: string;
}

export const marketThemeCN: MarketColorTheme = {
  up: redScale[100],
  down: greenScale[100],
};

export const marketThemeUS: MarketColorTheme = {
  up: greenScale[100],
  down: redScale[100],
};
