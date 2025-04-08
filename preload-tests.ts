import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { setupMocks } from "./src/tests/setupMocks";

GlobalRegistrator.register();

setupMocks();
