import { ButtonHTMLAttributes } from "react";

import "../styles/button.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
    children,
    isOutlined = false,
    ...rest
}) => {
    return (
        <button className={`button ${isOutlined ? "outlined" : ""}`} {...rest}>
            {children}
        </button>
    );
};
