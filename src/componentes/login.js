import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import "../styles/styles.css";

const Login = () => {
    const [condition, setCondition] = useState(false);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const validar = (usuario, password) => {
        fetch(`Login?User=${usuario}&password=${password}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.valid) {
                    setCondition(true);
                    setUserId(data.userId);
                    localStorage.setItem('userId', data.userId); // Guardar el ID del usuario en localStorage
                    alert("USUARIO VALIDO :)");
                } else {
                    setCondition(false);
                    setUsername(""); // Vaciar el campo de usuario
                    setPassword(""); // Vaciar el campo de contraseña
                    alert("USUARIO NO VALIDO");
                }
            });
    };

    if (condition) {
        return <Redirect to='/Proyecto/home' />;
    }

    const containerStyle = {
        backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/027/516/724/non_2x/business-background-colorful-metallic-abstract-background-design-for-digital-background-frame-graphic-design-web-design-papercut-template-wallpaper-free-vector.jpg")', // Reemplaza con la URL de tu imagen de fondo
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    };

    return (
        <Container id="sendMessageContainer" className="MarginContainer" style={containerStyle}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
                <h1 className="AlignCenter">Login</h1>
                <Form>
                    <Form.Group controlId="formUser">
                        <Form.Label>User</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Ingrese el usuario" 
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Ingrese su contraseña" 
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        onClick={() => validar(username, password)}
                    >
                        Login
                    </Button>
                    <Link to="/Proyecto/nuevousuario" className="btn btn-secondary" style={{ marginTop: '10px' }}>
                        Registrar
                    </Link>
                </Form>
            </div>
        </Container>
    );
};

export default Login;
