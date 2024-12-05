import React, { useContext } from "react";
import { Form, Button, Col, Row, Stack, Card, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { loginInfo, updateLoginInfo, loginUser, loginError, loading } =
    useContext(AuthContext);
  return (
    <>
      <Form onSubmit={loginUser}>
        <div
          style={{
            display: "flex",
            height: "90vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              gap: "20px",
              width: "400px",
              padding: "20px",
              boxShadow: "0 0 10px 0 rgba(100,100,100,0.2)",
              backgroundColor: "cyan",
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {loading ? "Loading..." : "Login"}
            </Button>
            {
                loginError? 
                <Alert variant="danger">
                    <p>{loginError}</p>
                </Alert> : null
            }
            <Stack direction="horizontal" gap={2}>
              <span>Don't have an account?</span>
              <a href="/register">Register</a>*
            </Stack>
          </Card>
        </div>
      </Form>
    </>
  );
};

export default Login;
