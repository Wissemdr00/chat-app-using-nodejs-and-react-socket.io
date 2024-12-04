import React, { useContext } from "react";
import { Form, Button, Col, Row, Stack, Card, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { registerInfo, updateRegisterInfo,registerUser ,registererror,loading} = useContext(AuthContext);
  return (
    <>
      <Form onSubmit={registerUser}>
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
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
                {loading ? "Loading..." : "Register"}
            </Button>
            <Stack direction="horizontal" gap={2}>
              <span>Already have an account?</span>
              <a href="/login">Login</a>
            </Stack>
            {
                registererror?.error && 
                <Alert variant="danger">
                    <p>{registererror?.message}</p>
                </Alert>
            }
          </Card>
        </div>
      </Form>
    </>
  );
};

export default Register;
