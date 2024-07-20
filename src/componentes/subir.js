import React, { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const FileUpload = () => {
    const [users, setUsers] = useState([]);
    const [receiverId, setReceiverId] = useState("");
    const [file, setFile] = useState(null);
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            setMessage('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('senderId', senderId);
        formData.append('receiverId', receiverId);

        try {
            const response = await axios.post('Upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Error uploading file');
        }
    };

    return (
        <Container id="sendMessageContainer" className="MarginContainer">
            <h1>Upload File</h1>
            <Form onSubmit={handleFileUpload}>
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
                    <Form.Label>Choose File</Form.Label>
                    <Form.File 
                        id="fileInput" 
                        label="Select file" 
                        custom 
                        onChange={handleFileChange} 
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Upload
                </Button>
                <Link to="/Proyecto/home" className="btn btn-secondary" style={{ marginTop: '10px' }}>
                    Go back
                </Link>
            </Form>
            {message && <p>{message}</p>}
        </Container>
    );
};

export default FileUpload;
