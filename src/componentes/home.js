import React from "react";
import { Button, Container, Table, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

class Home extends React.Component {
    state = {
        data: [],
        showAlert: false,
        alertText: "",
        loading: true,
        userId: localStorage.getItem('userId') // Recupera el ID del usuario desde el localStorage
    }

    componentDidMount() {
        this.fetchChats();
    }

    fetchChats = async () => {
        const { userId } = this.state;
        try {
            const [sentMessages, receivedMessages] = await Promise.all([
                axios.get(`Preguntas?userId=${userId}&type=sent`),
                axios.get(`Preguntas?userId=${userId}&type=received`)
            ]);

            const combinedData = [...sentMessages.data, ...receivedMessages.data];

            // Eliminar duplicados
            const uniqueChats = combinedData.reduce((acc, message) => {
                const chatExists = acc.find(chat => chat.receiverId === message.receiverId);
                if (!chatExists) {
                    acc.push(message);
                }
                return acc;
            }, []);

            this.setState({ data: uniqueChats, loading: false });
        } catch (error) {
            console.info(error);
            this.setState({ showAlert: true, alertText: "ERROR EN LA OBTENCION DE DATOS", loading: false });
        }
    }

    handleLogout = () => {
        localStorage.removeItem('userId'); // Opcional: Limpia el localStorage
        window.location.href = '/Proyecto/'; // Redirige a la página de inicio
    }

    handleIAMessage = async (receiverId) => {
        const senderId = this.state.userId;

        // Generar una frase motivacional
        const motivationalPhrase = await axios.get("https://api.quotable.io/random?tags=motivational")
            .then(response => response.data.content)
            .catch(() => "Keep pushing forward!");

        // Enviar la frase como un mensaje
        const payload = {
            senderId: parseInt(senderId, 10),
            receiverId: parseInt(receiverId, 10),
            messageText: motivationalPhrase
        };

        try {
            await axios.post("EnviarMensaje", payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert("Frase motivacional enviada.");
        } catch (error) {
            console.error('Error sending IA message:', error);
            alert("Error sending IA message");
        }
    }

    handleDeleteChat = async (receiverId) => {
        const { userId } = this.state;

        // Mostrar una alerta de confirmación antes de eliminar el chat
        const confirmDelete = window.confirm("¿Está seguro de que desea eliminar este chat? Esta acción no se puede deshacer.");

        if (confirmDelete) {
            try {
                await axios.delete(`Eliminar?user1Id=${userId}&user2Id=${receiverId}`);
                alert("Chat eliminado exitosamente");
                this.setState(prevState => ({
                    data: prevState.data.filter(chat => chat.receiverId !== receiverId)
                }));
            } catch (error) {
                console.error("Hubo un error al eliminar el chat: ", error);
                alert("Error al eliminar el chat");
            }
        }
    }

    render() {
        const { data, showAlert, alertText, loading, userId } = this.state;
        return (
            <Container className="MarginContainer">
                <h1 className="AlignCenter">Messenger ESCOM</h1>
                <hr style={{ width: "80%" }} />
                {
                    showAlert && (
                        <Alert variant="danger">
                            {alertText}
                        </Alert>
                    )
                }
                <Button variant="info" style={{ margin: "12px" }}>
                    <Link to="/Proyecto/formulario" className="CustomLink">Nuevo Mensaje</Link>
                </Button>
                <Button variant="info" style={{ margin: "12px" }}>
                    <Link to="/Proyecto/subir" className="CustomLink">Nuevo mensaje multimedia</Link>
                </Button>
                <Button onClick={this.handleLogout} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                    Log out
                </Button>
                {
                    loading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>Amigos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.length > 0 ? (
                                        data.map(chat => (
                                            <tr key={`${chat.receiverId}`}>
                                                <td><strong>{chat.receiverName} (ID: {chat.receiverId})</strong></td>
                                                <td className="AlignCenter">
                                                    <Button
                                                        variant="success"
                                                        className="M-6">
                                                        <Link to={`/Proyecto/info?user1Id=${userId}&user2Id=${chat.receiverId}`} className="CustomLink" >
                                                            Ver chat
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="info"
                                                        className="M-6"
                                                        onClick={() => this.handleIAMessage(chat.receiverId)}>
                                                        IA Message
                                                    </Button>
                                                    <Button
                                                        variant="warning"
                                                        className="M-6">
                                                        <Link to={`/Proyecto/editar?user1Id=${userId}&user2Id=${chat.receiverId}`} className="CustomLink" >
                                                            Editar chat
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        className="M-6"
                                                        onClick={() => this.handleDeleteChat(chat.receiverId)}
                                                    >
                                                        Eliminar chat
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                No hay chats disponibles.
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    )
                }
            </Container>
        );
    }
}

export default Home;
