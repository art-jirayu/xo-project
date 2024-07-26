import React from "react";
import styled from "styled-components";
import { border } from "./styles";

type BoardProps = {
    board: Array<Array<string | null>>;
    handleClick: (row: number, col: number) => void;
    column: number;
};

const SQUARE_DIMS = 50;
export const Board = ({ board, handleClick, column }: BoardProps) => {
    return (
        <Container dims={column}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <Square
                            key={cellIndex}
                            className={`cell ${cell ? `cell_${cell.toLowerCase()}` : ""}`}
                            onClick={() => handleClick(rowIndex, cellIndex)}
                        >
                            {cell}
                        </Square>
                    ))}
                </div>
            ))}
        </Container>
    );
};

const Container = styled.div<{ dims: number }>`
  display: flex;
  justify-content: center;
  width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
  flex-flow: wrap;
  position: relative;
`;

const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${SQUARE_DIMS}px;
  height: ${SQUARE_DIMS}px;
  ${border};

  &:hover {
    cursor: pointer;
  }
`;