/** React **/
import PropTypes from 'prop-types';
import React from 'react';
import Styled from 'styled-components';
/** Styling **/
const StyledButton = Styled.button`
    cursor: pointer;
    color: #fff;
    background-color: #2882E4;
    border-color: #2882E4;
    box-shadow: 0 2px 6px 0 rgba(114,124,245,.5);
    display: inline-block;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    padding: .45rem .9rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: .15rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;

    &:focus {
        box-shadow: 0 0 0 4x rgba(114,124,245,.5);
    }

    &:hover {
        color: #fff;
        background-color: #225da0;
        border-color: #225da0;
    }

    &:disabled,
    &[disabled] {
        cursor: not-allowed;
        color: #fff;
        background-color: #cecece;
        border-color: #cecece;
        box-shadow: none;
    }
`;
/** Component Definition **/
const Button = ({
    onClick,
    title,

    ...props,
}) => {
    return (
        <StyledButton
            onClick={onClick}
            {...props}
        >
            {title}
        </StyledButton>
    );
};

Button.propTypes = {
    title: PropTypes.string.isRequired,

    onClick: PropTypes.func,
};

export default Button;
