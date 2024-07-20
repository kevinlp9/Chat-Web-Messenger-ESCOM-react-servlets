import React, { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const SendMessage = () => {
    const [users, setUsers] = useState([]);
    const [receiverId, setReceiverId] = useState("");
    const [messageText, setMessageText] = useState("");
    const [message, setMessage] = useState("");
    const senderId = localStorage.getItem('userId'); // Recupera el ID del usuario del localStorage

    useEffect(() => {
        axios.get("ObtenerUsers")
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleSendMessage = async (event) => {
        event.preventDefault();
        const payload = {
            senderId: parseInt(senderId, 10),
            receiverId: parseInt(receiverId, 10),
            messageText
        };

        try {
            const response = await axios.post("EnviarMensaje", payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessage('Error sending message');
        }
    };

    return (
        <Container id="sendMessageContainer">
            <h1>Send Message</h1>
            <Form onSubmit={handleSendMessage}>
                <Form.Group>
                    <Form.Label>Sender</Form.Label>
                    <Form.Control 
                        as="select" 
                        value={senderId} 
                        readOnly
                    >
                        <option value={senderId}>
                            {`User ID: ${senderId}`}
                        </option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Receiver</Form.Label>
                    <Form.Control 
                        as="select" 
                        value={receiverId} 
                        onChange={(e) => setReceiverId(e.target.value)}
                    >
                        <option value="">Select Receiver</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username} (ID: {user.id})
                            </option>
                        ))}
                    </Form.Control>
                    {receiverId && (
                        <Form.Control
                            type="text"
                            value={`Receiver ID: ${receiverId}`}
                            readOnly
                            style={{ marginTop: '10px' }}
                        />
                    )}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Enter message"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    enviar
                </Button>
                <Link to="/Proyecto/home" className="btn btn-secondary" style={{ marginTop: '10px' }}>
                    volver
                </Link>
            </Form>
            {message && <p>{message}</p>}
        </Container>
    );
};

export default SendMessage;
