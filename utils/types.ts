export type Coordinates = {
  longitude: number;
  latitude: number;
};

export type WorkType = {
  id: string;
  name: string;
  nameGt5: string;
  nameLt5: string;
  nameOne: string;
};

export interface Shift {
  id: string;
  logo: string;
  coordinates: Coordinates;
  address: string;
  companyName: string;
  dateStartByCity: string;
  timeStartByCity: string;
  timeEndByCity: string;
  currentWorkers: number;
  planWorkers: number;
  workTypes: WorkType[];
  priceWorker: number;
  bonusPriceWorker: number;
  customerFeedbacksCount: string;
  customerRating: number;
  isPromotionEnabled: boolean;
}
