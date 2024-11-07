import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SnackContextProvider } from './context/SnackContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
        <SnackContextProvider>
                <UserContextProvider>
                        <App />
                </UserContextProvider>
        </SnackContextProvider>
)
