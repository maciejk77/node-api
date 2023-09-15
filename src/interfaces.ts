export interface IPage {
  title: string;
  templateId: string;
}

export interface ICard {
  id: string;
  title: string;
  sizes: string[];
  basePrice: number;
  pages: IPage[];
}

export interface ITemplate {
  id: string;
  width: number;
  height: number;
  imageUrl: string;
}

export interface ISize {
  id: string;
  title: string;
  priceMultiplier?: number;
}
