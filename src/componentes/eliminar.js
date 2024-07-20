import React from "react";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

class EliminarChat extends React.Component {
    state = {
        user1Id: new URLSearchParams(window.location.search).get("user1Id"),
        user2Id: new URLSearchParams(window.location.search).get("user2Id")
    }

    handleDelete = (e) => {
        e.preventDefault();
        const { user1Id, user2Id } = this.state;
        axios.delete(`Eliminar?user1Id=${user1Id}&user2Id=${user2Id}`)
            .then(response => {
                alert("Chat eliminado exitosamente");
                useHistory().push("/Proyecto/home");
            })
            .catch(error => {
                console.error("Hubo un error al eliminar el chat: ", error);
            });
    }

    render() {
        return (
            <Container>
                <Button variant="danger" onClick={this.handleDelete}>Eliminar Chat</Button>
                <Button
                    variant="success"
                    className="M-6">
                    <Link to={`/Proyecto/home`} className="CustomLink">
                        Go back
                    </Link>
                </Button>
            </Container>
        );
    }
}

export default EliminarChat;
