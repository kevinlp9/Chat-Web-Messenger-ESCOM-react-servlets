import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const ChatMultimedia = () => {
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde el localStorage
    const [chatItems, setChatItems] = useState([]);

    useEffect(() => {
        const user1Id = new URLSearchParams(window.location.search).get("user1Id");
        const user2Id = new URLSearchParams(window.location.search).get("user2Id");
        if (user1Id && user2Id) {
            const fetchData = async () => {
                try {
                    const messagesResponse = await axios.get(`Pregunta?user1Id=${user1Id}&user2Id=${user2Id}`);
                    const filesResponse = await axios.get(`ObtenerFiles?user1Id=${user1Id}&user2Id=${user2Id}`);

                    const combinedItems = [
                        ...messagesResponse.data.map(message => ({ ...message, type: "text" })),
                        ...filesResponse.data.map(file => ({ ...file, type: 'file' }))
                    ];

                    combinedItems.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                    setChatItems(combinedItems);
                } catch (error) {
                    console.info(error);
                    alert("Ha ocurrido un error");
                }
            };

            fetchData();
        }
    }, []);

    return (
        <Container id="sendMessageContainer" className="MarginContainer">
            <h1>Chat</h1>
            <div className="chat-container">
                {chatItems.map((item, index) => (
                    <Row key={index} className={`message-row ${userId === item.senderId ? "sent" : "received"}`}>
                        <Col>
                            <div className="message">
                                {item.type === "text" ? (
                                    <p>{item.messageText}</p>
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
                                <p className="timestamp">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                        </Col>
                    </Row>
                ))}
            </div>
            <Button variant="success" className="M-6">
                <Link to={`/Proyecto/home`} className="CustomLink">
                    Go back
                </Link>
            </Button>
        </Container>
    );
};

export default ChatMultimedia;
