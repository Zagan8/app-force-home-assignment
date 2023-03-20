import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { UserData, userStore } from "../../stores/user-store";
import { v4 as uuidv4 } from "uuid";

interface Props {
  user?: Partial<UserData>;

  toggleModal: () => void;
}
interface FormData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  street: string;
  streetNumber: number;
  picture?: string;
}
const UserForm: React.FC<Props> = ({ user, toggleModal }) => {
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [user, form]);
  const handleFormSubmit = (values: FormData) => {
    userStore.setUser({
      id: user?.id ? user.id : uuidv4(),
      name: { first: values.firstName, last: values.lastName },
      email: values.email,
      picture: user
        ? { medium: user.picture?.medium! }
        : { medium: values.picture ? values.picture : "" },
      location: {
        country: values.country,
        city: values.city,
        street: { name: values.street, number: values.streetNumber },
      },
    });
    form.resetFields();
    toggleModal();
  };

  const checkIfEmailAlreadyExist = (emailString: string) => {
    const isUserExist = userStore.users.find(
      (user) => user.email === emailString
    );
    return Boolean(isUserExist);
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={handleFormSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="First Name"
        name="firstName"
        initialValue={user?.name?.first}
        rules={[
          { required: true, message: "Please enter your name!" },
          { min: 3, message: "Name must be more then 3 letters" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="lastName"
        initialValue={user?.name?.last}
        rules={[
          { required: true, message: "Please enter your last name!" },
          { min: 3, message: "Last name must be more then 3 letters" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        initialValue={user?.email}
        rules={[
          { required: true, message: "Please enter your email!" },
          { type: "email", message: "Please enter valid email" },
          {
            validator: (_, value) => {
              if (checkIfEmailAlreadyExist(value) && user?.email !== value) {
                return Promise.reject(new Error("This email already taken"));
              }
              return Promise.resolve();
            },
            message: "This email already taken",
          },
        ]}
      >
        <Input />
      </Form.Item>
      {!user && (
        <Form.Item
          label="Picture"
          name="picture"
          rules={[{ required: true, message: "Please enter your picture url" }]}
        >
          <Input />
        </Form.Item>
      )}
      <Form.Item
        label="Country"
        name="country"
        initialValue={user?.location?.country}
        rules={[{ required: true, message: "Please enter your country!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="City"
        name="city"
        initialValue={user?.location?.city}
        rules={[{ required: true, message: "Please enter your city!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Street"
        name="street"
        initialValue={user?.location?.street.name}
        rules={[
          { required: true, message: "Please enter enter your street name!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Street Number"
        name="streetNumber"
        initialValue={user?.location?.street.number}
        rules={[
          { required: true, message: "Please enter your street number!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Button onClick={toggleModal}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
