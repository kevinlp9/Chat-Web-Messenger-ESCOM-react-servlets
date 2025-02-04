import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Pregunta = ({ id, pregunta }) => {
    return (
        <tr>
            <td>{pregunta}</td>
            <td className="AlignCenter">
                <Button
                    variant="success"
                    className="M-6">
                    <Link to={`/Proyecto/info?id=${id}`} className="CustomLink" >
                        Ver mensajes
                    </Link>
                </Button>
                <Button
                    variant="warning"
                    className="M-6">
                    <Link to={`/Proyecto/editar?id=${id}`} className="CustomLink" >
                        Editar mensajes
                    </Link>
                </Button>
                <Button
                    variant="danger"
                    className="M-6">
                    <Link to={`/Proyecto/eliminar?id=${id}`} className="CustomLink" >
                        Eliminar chat
                    </Link>                    
                </Button>
            </td>
        </tr>
    )
}
export default Pregunta;