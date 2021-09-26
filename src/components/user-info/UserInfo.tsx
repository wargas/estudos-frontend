import React, { FC, Fragment, useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export const UserInfo: FC<UserInfoProps> = (props) => {
  const auth = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Fragment>
      <div className="user show">
        <div className="user__info" onClick={(ev) => setShowMenu(!showMenu)}>
          <img
            src="https://lh3.googleusercontent.com/ogw/ADea4I53vQkNI0_LjdYh4LCzmIVqcv_nJaEUgCkj19lAsOk=s32-c-mo"
            alt=""
            className="user__img"
          />
          <div>
            <div className="user__name">{auth.user.displayName}</div>
            <div className="user__email">{auth.user.email}</div>
          </div>
        </div>
        <div className={`dropdown-menu ${showMenu ? "show" : ""}`}>
          <button onClick={() => auth.logout()} className="dropdown-item">
            Sair
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export type UserInfoProps = {};
