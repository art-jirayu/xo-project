import React, { useState } from "react";
import { Board } from "./board";
import styled from "styled-components";

type BoardArray = Array<Array<string | null>>;

const makeComputerMove = (board: BoardArray): [number, number] => {
    const emptyCells: [number, number][] = [];
    board.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (!cell) {
                emptyCells.push([rowIndex, cellIndex]);
            }
        });
    });

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
};

const checkWinner = (board: BoardArray): string | null => {
    const lines = [
        //Rows
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        //columns
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],

        //Diagonals
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]],
    ];
    for (const line of lines) {
        if (line[0] && line[0] === line[1] && line[1] === line[2]) {
            return line[0];
        }
    }
    return null;
};

export const TicTacToe = () => {
    const [rows, setRow] = useState(3);
    const [columns, setColumn] = useState(3);
    const initialBoard = Array.from({ length: columns }, () =>
        Array.from({ length: rows }, () => null)
    );
    const [board, setBoard] = useState<BoardArray>(initialBoard);
    const [player, setPlayer] = useState<string>("X");
    const [winner, setWinner] = useState<string | null>(null);
    const [isNoWinner, setIsNoWinner] = useState<boolean>(false);

    const GAME_STATES = {
        notStarted: "not_started",
        inGame: "in_game",
    };
    const [gameState, setGameState] = useState(GAME_STATES.notStarted);

    const handleOnClick = (row: number, col: number) => {
        if (board[row][col] || winner) {
            return;
        }

        const updatedPlayerBoard = board.map((newRow, rowIndex) =>
            newRow.map((cell, cellIndex) =>
                rowIndex === row && cellIndex === col ? player : cell
            )
        );
        setBoard(updatedPlayerBoard);
        const newWinner = checkWinner(updatedPlayerBoard);
        setWinner(newWinner);
        setPlayer("X");

        if (newWinner != null) {
            console.log(updatedPlayerBoard);
        }
        // No Winner
        const hasNullValue = updatedPlayerBoard.some((row) =>
            row.some((cell) => cell === null)
        );

        if (!winner && !hasNullValue) {
            setIsNoWinner(true);
            return;
        }

        // Computer's move
        if (!newWinner) {
            //
            const [computerRow, computerCol] = makeComputerMove(updatedPlayerBoard);
            const updatedComputerBoard = updatedPlayerBoard.map((newRow, rowIndex) =>
                newRow.map((cell, cellIndex) =>
                    rowIndex === computerRow && cellIndex === computerCol ? "O" : cell
                )
            );

            setTimeout(() => {
                setBoard(updatedComputerBoard);
                setWinner(checkWinner(updatedComputerBoard));
            }, 200); // delay
        }
    };

    const restartGame = () => {
        setBoard(initialBoard);
        setPlayer("X");
        setWinner(null);
        setIsNoWinner(false);
        setGameState(GAME_STATES.notStarted);
    };

    const startGame = () => {
        setBoard(initialBoard);
        setPlayer("X");
        setWinner(null);
        setIsNoWinner(false);
        setGameState(GAME_STATES.inGame);
    };

    const changeRows = (e: React.ChangeEvent<HTMLInputElement>) => {
        const str = parseInt(e.target.value);
        if (!isNaN(str) && str > 2) {
            e.target.value = str.toString();
            setRow(str);
        }
        else {
            e.target.value = '';
        }
    };

    const changeColumns = (e: React.ChangeEvent<HTMLInputElement>) => {
        const str = parseInt(e.target.value);
        if (!isNaN(str) && str > 2) {
            e.target.value = str.toString();
            setColumn(str);
        }
        else {
            e.target.value = '';
        }
    };

    return gameState === GAME_STATES.notStarted ? (
        <Inner>
            <h1> XO Game</h1>
            <ButtonRow>
                <Input onChange={changeRows} value={rows} />
                <p>x</p>
                <Input onChange={changeColumns} value={columns} />
            </ButtonRow>
            <Button className='reset' type='button' onClick={() => startGame()}>
                Start new Game
            </Button>
        </Inner>
    ) : (
        <Inner>
            <h1> XO Game</h1>
            <Board board={board} handleClick={handleOnClick} column={columns} />
            {winner && <p>{winner === "X" ? "You Win" : "AI Wins"}</p>}
            {isNoWinner && <p> No one wins</p>}
            <Button className='reset' type='button' onClick={() => restartGame()}>
                Restart new Game
            </Button>
        </Inner>
    );
};

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Button = styled.button`
  display: flex;
  width: 100px;
  margin: 10px 10px 0px 10px;
`;

const ButtonRow = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  display: flex;
  width: 100px;
  margin: 10px 10px 0px 10px;
`;
