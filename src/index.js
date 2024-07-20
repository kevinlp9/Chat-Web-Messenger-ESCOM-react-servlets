import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from "./components/home";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/styles.css"
import Login from "./components/login"
import Info from "./components/info"
import Formulario from "./components/formulario"
import Editar from "./components/editar"
import Eliminar from "./components/eliminar"
import NuevoUsuario from "./components/nuevousuario"
import Subir from "./components/subir"
import Multimedia from "./components/multimedia"

const App = () => {
    const backgroundImageStyle = {
        backgroundImage: 'url("https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-purple-beautiful-romantic-cool-fresh-banner-background-image_156587.jpg")', // Asegúrate de que la ruta sea correcta
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1
    };
    const textStyle = {
        color: '#fff', // Color del texto
        fontSize: '4rem', // Tamaño del texto
        textAlign: 'center', // Alineación del texto
        position: 'absolute',
    };

    return (
        <div style={backgroundImageStyle}>
            <Router>
                <div style={{ position: 'relative' }}>
                    <div style={textStyle}>
                        <h1>Moises Garduño Sánchez, Kevin Atilano Gutierrez</h1>             
                    </div>
                    <Switch>
                        <Route exact path="/Proyecto">
                            <Login />
                        </Route>
                        <Route exact path="/Proyecto/home">
                            <Home />
                        </Route>
                        <Route exact path="/Proyecto/info">
                            <Info />
                        </Route>       
                        <Route exact path="/Proyecto/formulario">
                            <Formulario />
                        </Route> 
                        <Route exact path="/Proyecto/editar">
                            <Editar />
                        </Route>   
                        <Route exact path="/Proyecto/eliminar">
                            <Eliminar />
                        </Route>   
                        <Route exact path="/Proyecto/nuevousuario">
                            <NuevoUsuario />
                        </Route>  
                        <Route exact path="/Proyecto/subir">
                            <Subir />
                        </Route>        
                        <Route exact path="/Proyecto/multimedia">
                            <Multimedia />
                        </Route>  
                        <Route path="*" render={() => <h1>Resource not found</h1>} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
