import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./shared/styles/globals.css";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

const renderApp = () => {
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
};

// TODO(api-integration): 필요 시 네트워크 레벨 모킹(MSW worker)을 다시 활성화할 수 있습니다.
renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
