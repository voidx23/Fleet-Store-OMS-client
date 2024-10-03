import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import './index.css'; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<OrderList />} />
                <Route path="/add-order" element={<OrderForm />} />
            </Routes>
        </Router>
    );
}

export default App;
