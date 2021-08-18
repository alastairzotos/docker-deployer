import * as React from 'react';
import { Modal, Typography, Input } from 'antd';
import { useAuthState } from '../state';

const { Text } = Typography;

export const Login: React.FC = () => {
  const [pwd, setPwd] = React.useState('');

  const loginStatus = useAuthState(state => state.loginStatus);
  const login = useAuthState(state => state.login);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleOk();
    }
  }

  const handleOk = () => login(pwd);

  return (
    <Modal
      title="Login"
      visible={true}
      onOk={handleOk}
      okText="Login"
      okButtonProps={{
        disabled: pwd.length === 0
      }}
      cancelButtonProps={{
        style: {
          display: 'none'
        }
      }}
    >
      <Text>Enter password</Text>
      <Input.Password
        placeholder="Password"
        disabled={loginStatus === 'fetching'}
        value={pwd}
        onChange={e => setPwd(e.target.value)}
        onKeyUp={handleKeyUp}
      />

      {loginStatus === 'error' && (
        <Text type="danger">Invalid password</Text>
      )}

    </Modal>
  );
};
