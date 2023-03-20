import React from "react";
import { Modal } from "antd";
import UserForm from "../user-form/user-form";
import { UserData } from "../../stores/user-store";

interface Props {
  isModalOpen: boolean;

  toggleModal: () => void;

  user?: UserData;
}
const UserModal: React.FC<Props> = ({ isModalOpen, toggleModal, user }) => {
  return (
    <>
      <Modal
        title="Basic Modal"
        footer={false}
        open={isModalOpen}
        onCancel={toggleModal}
      >
        {<UserForm toggleModal={toggleModal} user={user} />}
      </Modal>
    </>
  );
};

export default UserModal;
