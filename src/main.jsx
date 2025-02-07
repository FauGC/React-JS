import { createRoot } from "react-dom/client";
import App from './App.jsx';
import './components/style.css';

const rootDOMnode = document.getElementById("root");
const reactRoot = createRoot(rootDOMnode);

reactRoot.render (
  <div>
    <App/>
  </div>
);