import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store";
import App from "./App";

import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container as Element);

window["APP_VERSION"] = "1.5.0";

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
);
