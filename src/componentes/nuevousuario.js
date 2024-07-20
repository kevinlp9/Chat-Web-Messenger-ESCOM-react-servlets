import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Link } from 'react-router-dom';
import "../styles/styles.css"; // Asegúrate de importar el archivo de estilos

class RegisterUser extends React.Component {
    state = {
        username: "",
        password: "",
        message: ""
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        const payload = {
            username,
            password
        };

        console.log("Payload:", payload);

        axios.post("NuevoUsuario", payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log("Response:", response.data);
            this.setState({ message: response.data.message });
            alert("User registered successfully.");
        })
        .catch(error => {
            console.error("Error:", error);
            this.setState({ message: "Error registering user" });
            alert("Error registering user.");
        });
    }

    render() {
        const { username, password, message } = this.state;
        return (
            <Container id="sendMessageContainer" className="MarginContainer">
                <h1>Register User</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" value={username} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" value={password} onChange={this.handleChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Register</Button>
                    <Link to={`/Proyecto/`} className="btn btn-secondary" style={{ marginTop: '10px' }}>
                        Go back
                    </Link>
                </Form>
                {message && <p>{message}</p>}
            </Container>
        );
    }
}

export default RegisterUser;
