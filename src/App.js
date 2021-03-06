import React, { useEffect, useState } from "react";

//Routing
import { BrowserRouter } from "react-router-dom";

//Components
import RoutesList from "./core/RoutesList/RoutesList";
import BoundaryUI from "./hoc/BoundaryUI/BoundaryUI";
import BoundaryRedirect from "./hoc/BoundaryRedirect/BoundaryRedirect";

//Misc
import authStore from "./misc/store/authentication";
import userStore from "./misc/store/users";
import { useStore, combineStore } from "./misc/store/store-core";
import { list } from "./misc/shared/link-list";
import { uniqueRoutes } from "./misc/shared/helper-funcs";
import { useRefreshToken } from "./misc/hooks/auth";
import {
  REFRESH_TOKEN,
  AUTH_STORE,
  USERS_STORE
} from "./misc/shared/constants";

combineStore({
  [AUTH_STORE]: authStore,
  [USERS_STORE]: userStore
});

const App = () => {
  const routes = uniqueRoutes(list.flat());
  const [globalState, dispatch] = useStore(AUTH_STORE);
  const [mounted, setMounted] = useState(false);

  const [
    startRefresh,
    { loadingRefresh, called },
    { successRefresh, data },
    { errorRefresh }
  ] = useRefreshToken();

  useEffect(() => {
    //if we found a refresh token
    if (successRefresh) {
      dispatch("AUTH_SUCCESS", data);
    }
  }, [successRefresh]);
  //ComponentDidMount
  //run only once
  useEffect(() => {
    if (localStorage.getItem(REFRESH_TOKEN)) {
      startRefresh();
    }
    setMounted(true);
  }, []);

  return (
    <BrowserRouter>
      <BoundaryUI loading={loadingRefresh}>
        {mounted ? <RoutesList routes={routes} /> : ""}
        <BoundaryRedirect if={called && successRefresh} ifTrueTo="/dashboard" />
        <BoundaryRedirect if={called && errorRefresh} ifTrueTo="/login" />
        <BoundaryRedirect
          if={!globalState.calledAuth && !globalState.authenticated}
          ifTrueTo="/login"
        />
      </BoundaryUI>
    </BrowserRouter>
  );
};

export default App;
