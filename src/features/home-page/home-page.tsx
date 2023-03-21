import React, { useEffect, useState } from "react";
import { UserData, userStore } from "../../stores/user-store";
import { observer } from "mobx-react-lite";
import { Col, Row, Tooltip, Typography } from "antd";
import UserCard from "../../components/user-card/user-card";
import UserModal from "../../components/user-modal/user-modal";
import SearchFilter from "../../components/search-filter/search-filter";
import userService from "../../services/user-service";
import { debounce } from "lodash";
import "./home-page.scss";
import { Header } from "antd/es/layout/layout";
import { UserAddOutlined } from "@ant-design/icons";
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
    <div className="home-page">
      <Row className="home-page-header-row">
        <Header className="home-page-header">
          <Typography.Text className="home-page-title">
            Users Library
          </Typography.Text>
          <SearchFilter handleTyping={handleFilter} />
          <Tooltip placement="bottom" title="Add user">
            <UserAddOutlined
              className="add-user-button"
              onClick={toggleModal}
              type={"primary"}
            />
          </Tooltip>
        </Header>
      </Row>
      <Row gutter={[15, 15]}>
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
            span={6}
            className="user-card-col"
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
