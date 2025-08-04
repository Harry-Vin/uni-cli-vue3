import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import { setupStore } from './store'
import 'virtual:uno.css'

export function createApp() {
	const app = createSSRApp(App);
	
	// 安装Pinia状态管理
	setupStore(app)
	
	return {
		app,
	};
}
