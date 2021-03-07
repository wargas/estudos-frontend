import React, { FC, Fragment, useRef, useCallback } from 'react'

export const Search: FC = props => {
    const inputRef = useRef<HTMLFormElement>(null);

    const handlerFocus = useCallback((e:boolean) => {
        if(e) {
            inputRef.current?.classList.add('search--focus')
        } else {
            inputRef.current?.classList.remove('search--focus')
        }
    }, [])


    return (
        <Fragment>
            <form className="search" ref={inputRef}>
                <div className="search__inner">
                    <input
                        onFocus={ev => handlerFocus(true)}
                        onBlur={ev => handlerFocus(false)}
                        type="text"
                        className="search__text"
                        placeholder="Pesquisar" />
                    <i className="zmdi zmdi-search search__helper" data-ma-action="search-close"></i>
                    {/* <div className="search__results">
                        Results aqui
                    </div> */}
                </div>
            </form>
        </Fragment>
    )
}