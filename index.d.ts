type Params<T extends Record<string, any> = Record<string, string>> =
  Promise<T>;

type TUser = {
  id: string;
  email: string;
};
