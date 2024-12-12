import { createRoot } from "react-dom/client";
import NavBar from './components/NavBar.jsx';

const rootDOMnode = document.getElementById("root");
const reactRoot = createRoot(rootDOMnode);

reactRoot.render (
  <div>
    <NavBar />
  </div>
);