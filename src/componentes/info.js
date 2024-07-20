import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Form, FormControl, InputGroup } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const ChatMultimedia = () => {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde el localStorage
    const [chatItems, setChatItems] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [editText, setEditText] = useState("");
    const [messageText, setMessageText] = useState("");
    const [file, setFile] = useState(null);
    const [username, setUserName] = useState("");

    const user2Id = new URLSearchParams(window.location.search).get("user2Id");

    useEffect(() => {
        const user1Id = new URLSearchParams(window.location.search).get("user1Id");
        if (user1Id && user2Id) {
            const fetchData = async () => {
                try {
                    const messagesResponse = await axios.get(`Pregunta?user1Id=${user1Id}&user2Id=${user2Id}`);
                    const filesResponse = await axios.get(`ObtenerFiles?user1Id=${user1Id}&user2Id=${user2Id}`);
                    const userResponse = await axios.get(`getUser?userId=${user2Id}`); // Obtener usuario por ID

                    const combinedItems = [
                        ...messagesResponse.data.map(message => ({ ...message, type: "text" })),
                        ...filesResponse.data.map(file => ({ ...file, type: 'file' }))
                    ];

                    combinedItems.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                    setChatItems(combinedItems);
                    setUserName(userResponse.data.username); // Asignar el nombre de usuario
                } catch (error) {
                    console.info(error);
                    alert("Ha ocurrido un error al obtener datos.");
                }
            };

            fetchData();
        }
    }, [user2Id]);

    const handleEditClick = (item) => {
        setEditMode(item.id);
        setEditText(item.messageText);
    };

    const handleSaveClick = async (item) => {
        try {
            const response = await axios.post('Editar', {
                id: item.id,
                messageText: editText
            });

            if (response.data.status === 'success') {
                setChatItems(chatItems.map(chatItem => 
                    chatItem.id === item.id ? { ...chatItem, messageText: editText } : chatItem
                ));
                setEditMode(null);
            } else {
                alert("Error al actualizar el mensaje.");
            }
        } catch (error) {
            console.info(error);
            alert("Ha ocurrido un error al guardar el mensaje.");
        }
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();

        const payload = {
            senderId: parseInt(userId, 10),
            receiverId: parseInt(user2Id, 10),
            messageText
        };

        try {
            const response = await axios.post("EnviarMensaje", payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.message) {
                const newMessage = {
                    id: Date.now(), // Temporal ID
                    senderId: userId,
                    receiverId: user2Id,
                    messageText,
                    timestamp: new Date().toISOString(),
                    type: 'text'
                };
                setChatItems([...chatItems, newMessage]);
                setMessageText("");
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert("Error sending message");
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('senderId', userId);
        formData.append('receiverId', user2Id);

        try {
            const response = await axios.post('Upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message) {
                const newFile = {
                    id: Date.now(), // Temporal ID
                    senderId: userId,
                    receiverId: user2Id,
                    fileName: file.name,
                    filePath: URL.createObjectURL(file),
                    timestamp: new Date().toISOString(),
                    type: 'file'
                };
                setChatItems([...chatItems, newFile]);
                setFile(null);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert("Error uploading file");
        }
    };

    return (
        <Container id="sendMessageContainer" className="MarginContainer">
            <div className="user-info">
                <Form.Group>
                    <Form.Label></Form.Label>
                    <Form.Control
                        type="text"
                        value={`ID: ${user2Id}, Username: ${username}`}
                        readOnly
                    />
                </Form.Group>
            </div>
            <div className="chat-container">
                {chatItems.map((item, index) => (
                    <Row key={index} className={`message-row ${userId === String(item.senderId) ? "sent" : "received"}`}>
                        <Col xs={12} className={`d-flex ${userId === String(item.senderId) ? "justify-content-end" : "justify-content-start"}`}>
                            <div className={`message ${userId === String(item.senderId) ? "sent-message" : "received-message"}`}>
                                {editMode === item.id ? (
                                    <InputGroup>
                                        <FormControl 
                                            as="textarea"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                        />
                                        <Button variant="primary" onClick={() => handleSaveClick(item)}>Save</Button>
                                    </InputGroup>
                                ) : (
                                    <>
                                        {item.type === "text" ? (
                                            <p onClick={() => userId === String(item.senderId) && handleEditClick(item)}>{item.messageText}</p>
                                        ) : item.filePath.endsWith(".mp4") ? (
                                            <video controls className="file-preview">
                                                <source src={item.filePath} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : item.filePath.endsWith(".mp3") ? (
                                            <video controls className="file-preview">
                                                <source src={item.filePath} type="audio/mp3" />
                                                Your browser does not support the audio element.
                                            </video>
                                        ) : (
                                            <img src={item.filePath} alt={item.fileName} className="file-preview" />
                                        )}
                                    </>
                                )}
                                <p className="timestamp">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                        </Col>
                    </Row>
                ))}
            </div>
            <Form onSubmit={handleSendMessage} className="mt-4">
                <Form.Group>
                    <Form.Control
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Enter message"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>
            <Form onSubmit={handleFileUpload} className="mt-4">
                <Form.Group>
                    <Form.File 
                        id="fileInput" 
                        label="Select file" 
                        custom 
                        onChange={handleFileChange} 
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Cargar  
                </Button>
            </Form>
            <Button variant="success" className="M-6 mt-4">
                <Link to={`/Proyecto/home`} className="CustomLink">
                    volver
                </Link>
            </Button>
        </Container>
    );
};

export default ChatMultimedia;
