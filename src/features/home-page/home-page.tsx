import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { UserData, userStore } from "../../stores/user-store";
import { v4 as uuidv4 } from "uuid";
import { observer } from "mobx-react-lite";
import { Button, Col, Row } from "antd";
import UserCard from "../../components/user-card/user-card";
import UserModal from "../../components/user-modal/user-modal";
import SearchFilter from "../search-filter/search-filter";

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
}

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData>();
  const [filterQuery, setFilterQuery] = useState<string>();
  const toggleModalAndSetUser = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(!isModalOpen);
  };

  const deleteUser = (userId: string) => {
    userStore.deleteUser(userId);
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setSelectedUser(undefined);
  };

  useEffect(() => {
    const init = async () => {
      const users = await axios.get("https://randomuser.me/api/?results=10.");
      users.data.results.forEach((user: UserData) => {
        if (user) {
          userStore.setUser({
            id: uuidv4(),
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
        }
      });
    };
    init();
  }, []);

  useEffect(() => {
    if (filterQuery) {
      const filteredUsers = userStore.users.filter((user) => {
        return (
          user.name.first.toLowerCase() === filterQuery.toLowerCase() ||
          user.name.last.toLowerCase() === filterQuery.toLowerCase() ||
          user.email.toLowerCase() === filterQuery.toLowerCase() ||
          user.location.city.toLowerCase() === filterQuery.toLowerCase() ||
          user.location.country.toLowerCase() === filterQuery.toLowerCase()
        );
      });
      userStore.clearUsers();
      filteredUsers.forEach((user) => {
        userStore.setUser(user);
      });
    }
  }, [filterQuery]);

  const handleFilter = (query: string) => {
    setFilterQuery(query);
  };
  return (
    <div style={{ padding: "0 20px" }}>
      <Row justify={"center"}>
        <h1>User Library</h1>
      </Row>
      <Row justify={"center"}>
        <SearchFilter handleTyping={handleFilter} />
      </Row>
      <Row justify={"end"} style={{ margin: "20px 0" }}>
        <Button onClick={toggleModal} type={"primary"}>
          Add new user
        </Button>
      </Row>
      <Row gutter={[10, 10]}>
        <UserModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          user={selectedUser}
        />
        {userStore.users?.map((user) => (
          <Col
            key={user.id}
            style={{ justifyContent: "center", display: "flex" }}
            span={6}
          >
            <UserCard
              toggleModalAndSetUser={toggleModalAndSetUser}
              user={user}
              deleteUserCard={deleteUser}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default observer(HomePage);
