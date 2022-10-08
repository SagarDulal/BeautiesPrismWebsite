
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react'
import Header from "./components/layouts/Header"
import Footer from "./components/layouts/Footer"
import Home from "./components/Home"


function App() {
  return (
 

    <div className="App">
    <Router>  
      <Header />
      {/* <Home /> */}
      <div className="container container-fluid">
      <Routes>   
         
      <Route  path ="/" element = {< Home /> } />
      
      </Routes>
      </div>
      <Footer/>
      </Router> 
    </div>

    
  )
}

export default App;
