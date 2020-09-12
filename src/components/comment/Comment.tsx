import React, { FC, Fragment, useEffect } from 'react';
import { Aula } from '../../interfaces/Aula';
import { Questao } from '../../interfaces/Questao';

export const Comment: FC<CommentProps> = ({questao}) => {

    useEffect(() => {
        console.log(questao)
    }, [questao])

    const loadComents = () => {
        
    }

    return (
        <Fragment>
            <div className="comment-content" contentEditable={true}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt est excepturi nihil, accusamus facilis doloremque doloribus itaque dolorum, temporibus, debitis aliquam? Neque perspiciatis cupiditate accusamus asperiores, repellendus minus iste quam!
            </div>
        </Fragment>
    )
}

export type CommentProps = {
    questao: Questao; 
    aula: Aula;
}