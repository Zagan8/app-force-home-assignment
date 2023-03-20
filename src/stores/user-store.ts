import { computed, makeObservable, observable } from "mobx";
export interface UserData {
  id: string;
  name: { first: string; last: string };
  email: string;
  picture: { medium: string };
  location: {
    country: string;
    city: string;
    street: { number: number; name: string };
  };
}
class UserStore {
  @observable
  usersMap: Map<string, UserData> = new Map();
  constructor() {
    makeObservable(this);
  }

  setUser(user: UserData) {
    this.usersMap.set(user.id, user);
  }

  clearUsers() {
    this.usersMap.clear();
  }

  deleteUser(userId: string) {
    this.usersMap.delete(userId);
  }

  @computed
  get users() {
    return Array.from(this.usersMap.values());
  }
}

export const userStore = new UserStore();
