import React, { FC, Fragment, useRef, useCallback } from "react";
import { CenterLoading } from "../center-loading/CenterLoading";
import "./Search.scss";

export const Search: FC = (props) => {
  const inputRef = useRef<HTMLFormElement>(null);

  const handlerFocus = useCallback((e: boolean) => {
    if (e) {
      inputRef.current?.classList.add("search--focus");
    } else {
      inputRef.current?.classList.remove('search--focus')
    }
  }, []);

  return (
    <Fragment>
      <form className="ml-auto search" ref={inputRef}>
        <div className="search__inner">
          <input
            onFocus={(ev) => handlerFocus(true)}
            onBlur={(ev) => handlerFocus(false)}
            type="text"
            className="search__text"
            placeholder="Pesquisar por questão"
          />
          <i
            className="zmdi zmdi-search search__helper"
            data-ma-action="search-close"
          ></i>
          <div className="search__results text-dark shadow-sm">
            {/* <CenterLoading show={true} /> */}
            <div className="listview listview--bordered listview--hover">
              {Array(10)
                .fill("")
                .map((ite, index) => (
                  <div key={index} className="listview__item px-3 py-2 cursor-pointer">
                    <div className="listview__content">
                      <div className="listview__heading">
                        Principios constitucionais
                      </div>
                      <p className="mt-0">Isso é uma questao...</p>
                    </div>
                    <div className="actions">
                        <i className="zmdi zmdi-arrow-right actions__item"></i>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};
