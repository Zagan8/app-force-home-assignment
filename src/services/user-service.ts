import axios from "axios";
import { userStore } from "../stores/user-store";

interface UsersDataResponse {
  name: {
    first: string;
    last: string;
  };
  email: string;
  location: {
    country: string;
    city: string;
    street: { name: string; number: number };
  };
  picture: { medium: string };

  login: { uuid: string };
}

const userService = {
  getUsers: async () => {
    try {
      const users = await axios.get("https://randomuser.me/api/?results=10.");
      users.data.results.forEach((user: UsersDataResponse) => {
        if (user) {
          userStore.setUser({
            id: user.login.uuid,
            name: {
              first: user.name.first,
              last: user.name.last,
            },
            email: user.email,
            location: {
              country: user.location.country,
              city: user.location.city,
              street: user.location.street,
            },
            picture: { medium: user.picture.medium },
          });
          return users;
        }
      });
    } catch (e) {
      console.error(e);
    }
  },
};

export default userService;
