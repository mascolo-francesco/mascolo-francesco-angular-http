export interface RisorsaConNome {
  name: string;
  url: string;
}

export interface ElencoTipi {
  count: number;
  next: string | null;
  previous: string | null;
  results: RisorsaConNome[];
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
}
