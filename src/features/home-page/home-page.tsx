import React, { useEffect, useState } from "react";
import { UserData, userStore } from "../../stores/user-store";
import { observer } from "mobx-react-lite";
import { Button, Col, Row } from "antd";
import UserCard from "../../components/user-card/user-card";
import UserModal from "../../components/user-modal/user-modal";
import SearchFilter from "../search-filter/search-filter";
import userService from "../../services/user-service";
import { debounce } from "lodash";
const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData>();
  const [filterQuery, setFilterQuery] = useState<string>();
  const [users, setUsers] = useState<UserData[]>();
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
      await userService.getUsers();
      setUsers(userStore.users);
    };
    init();
  }, []);

  useEffect(() => {
    const search = debounce(() => {
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
        setUsers(filteredUsers);
      } else {
        setUsers(userStore.users);
      }
    }, 750);
    search();

    // eslint-disable-next-line
  }, [filterQuery, userStore.users]);

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
        {users?.map((user) => (
          <Col
            xs={24}
            sm={12}
            md={12}
            lg={6}
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
