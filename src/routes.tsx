import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

export function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/rooms/new" component={NewRoom} />
            </Switch>
        </BrowserRouter>
    );
}
