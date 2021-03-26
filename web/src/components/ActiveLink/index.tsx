import Link, {LinkProps} from "next/link";
import {useRouter} from 'next/router';
import { ReactElement , cloneElement} from "react";


interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({children, activeClassName , ...rest}: ActiveLinkProps){


    //asPath é a rota atual do site que está ativa
    const {asPath} = useRouter();

    const className = asPath === rest.href? activeClassName: ''

    return (
        <Link {...rest}>
            {
                //clona o children, que neste caso é a ancora(<a></a>)
                //recebida nas props
                //e acrescento a ela uma classe
                cloneElement(children, {
                    className
                })
            }
        </Link>
    )
}