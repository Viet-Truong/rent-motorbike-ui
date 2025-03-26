export interface City {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  city_id: number;
}

export interface Ward {
  id: number;
  name: string;
  district_id: number;
}
