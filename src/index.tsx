import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "./store/store";
import App from "./App";

import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container as Element);

window["APP_VERSION"] = "2.0.1";

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<div className="App">
				<App />
			</div>
		</BrowserRouter>
	</Provider>
);
