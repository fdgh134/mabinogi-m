export interface Source {
  type: string;                
  methodOrFrom: string;        
}

export interface Ingredient {
  itemId: string;
  quantity: number;
  source: Source;
}

export interface Production {
  ingredients: Ingredient[];
}

export interface Item {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  producedPerTry: number | null;
  processingTime: number | null;
  price: number | null;
  production: Production;
}
