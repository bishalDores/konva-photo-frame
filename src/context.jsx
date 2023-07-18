import * as React from "react";
import { Store } from "./store";

export const context = React.createContext(new Store());

export const useStore = () => React.useContext(context);
