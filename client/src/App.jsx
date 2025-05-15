import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>ZenChat</h1>
            </header>
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    )
}

export default App