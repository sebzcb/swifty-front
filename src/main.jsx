import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SnackContextProvider } from './context/SnackContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
        <SnackContextProvider>
                <App />
        </SnackContextProvider>
)
