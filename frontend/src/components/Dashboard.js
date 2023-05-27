import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, Button, Table } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/token");

      setToken(response.data.accessToken);

      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      console.log(error);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();

      if (1000 * expire < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");

        config.headers.Authorization = `Bearer ${response.data.accessToken}`;

        const decoded = jwt_decode(response.data.accessToken);
        setToken(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUser = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.data);
      if (response) {
        console.log("ini user");
        console.log(users);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.delete("http://localhost:5000/logout");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto"></Nav>
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </Container>
      </Navbar>
      <Container>
        <h2>Welcome: {name}</h2>
        <Button variant="success" onClick={getUser}>
          User
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((value, index) => {
                return (
                  <tr key={value.id}>
                    <td>{value.id}</td>
                    <td>{value.name}</td>
                    <td>{value.email}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Dashboard;
