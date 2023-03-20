import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Popconfirm } from "antd";
import { UserData } from "../../stores/user-store";

const { Meta } = Card;

interface Props {
  user: UserData;

  toggleModalAndSetUser: (user: UserData) => void;

  deleteUserCard: (userId: string) => void;
}

const UserCard: React.FC<Props> = ({
  user,
  toggleModalAndSetUser,
  deleteUserCard,
}) => (
  <Card
    style={{ width: 300 }}
    actions={[
      <EditOutlined key="edit" onClick={() => toggleModalAndSetUser(user)} />,
      <Popconfirm
        onConfirm={() => deleteUserCard(user.id)}
        title={"Are you sure you want to delete this user?"}
      >
        <DeleteOutlined key="delete" />,
      </Popconfirm>,
    ]}
  >
    <Meta
      avatar={<Avatar src={user.picture.medium} />}
      title={user.name.first + " " + user.name.last}
      description={
        <>
          <p>Email:{user.email}</p>
          <p>Country:{user.location.country}</p>
          <p>City:{user.location.city}</p>
          <p>
            Street:
            {user.location.street.name + " " + user.location.street.number}
          </p>
        </>
      }
    />
  </Card>
);

export default UserCard;