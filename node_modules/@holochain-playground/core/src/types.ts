export type GetOptions = {
  strategy: GetStrategy;
};

export enum GetStrategy {
  Latest,
  Contents,
}
