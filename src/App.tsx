import { useEffect, useState } from 'react';
import solveSudoku from './sudoku';
import isValid from './validSudoku';
import './App.css';
import { formatSudoku } from './formatSudoku';


function App() {

	const [grid, setGrid] = useState<number[][]>(Array(9).fill('').map(() => Array(9).fill(0)));
	const [solving, setSolving] = useState(false);
	const [inValids, setInValids] = useState<boolean[][]>(Array(9).fill(false).map(() => Array(9).fill(false)));
	const [isFilling, setIsFilling] = useState(false);

	useEffect(() => {
		if (isFilling) {
			handleFill();
			setIsFilling(false);
		}
	}, [])

	function handleChange(row: number, col: number, val: number) {
		if (val > 9 || val < 0) return;
		const newGrid = [...grid];
		newGrid[row][col] = val;
		
		// checking for invalids
		const newInvalids = isValid(grid);
		if (newInvalids.length) {
			setInValids(newInvalids);
		}
		else
			setInValids([]);
	};

	function handleSubmit() {
		const totalInvalids = () => {
			for (let i = 0; i < 9; i++)
				for (let j = 0; j < 9; j++)
					if (inValids[i][j]) return false;
		};
		if (!totalInvalids) {
			alert("Invalid sudoku! Please avoid using same numbers in the same row, column or box.");
			return;
		}
		setSolving(true);
		const solvedSudoku = solveSudoku(grid);
		setGrid(solvedSudoku);
		setSolving(false);
	};

	// Resets all values of the grid and the sudoku to 0
	function handleReset() {
		setGrid(Array(9).fill('').map(() => Array(9).fill(0)));
		setInValids(Array(9).fill(false).map(() => Array(9).fill(false)));
	};

	async function handleFill() {
		setIsFilling(true);
		const apiCall = await fetch('https://sugoku.onrender.com/board?difficulty=medium');
		const data = await apiCall.json();
		const randomSudoku = formatSudoku(data.board);
		setGrid(randomSudoku);
	}

	return (
		<>
			<div className='border-white border-4 w-[30rem] h-[30rem] flex flex-wrap justify-center gap-3 p-2 bg-[#827b7b]'>
				{grid.map((row, r) => (
					<div key={r} className='w-[9rem] h-[9rem] flex justify-center flex-wrap'>
						{row.map((col, c) => (
							<div key={c} className='w-[3rem] h-[3rem] border-white border-2'>
								<input value={col ? col : ''} className={`w-full h-full text-center text-[white] focus:bg-[#4f4f4f] hover:cursor-pointer focus:hover:cursor-pointer ${inValids[r][c] ? 'bg-[#dc2d2d]' : ''} ${solving ? 'cursor-not-allowed' : ''}`} onChange={(e) => { handleChange(r, c, parseInt(e.target.value.slice(-1)) || 0) }} />
							</div>
						))}
					</div>
				))}
			</div>
			<div className='flex justify-around'>
				<button type='button' onClick={handleReset} className='bg-white text-[#242424] p-3 rounded-md mt-4 active:scale-110'>Reset</button>
				<button type='button' onClick={handleFill} className='bg-white text-[#242424] p-3 rounded-md mt-4 active:scale-110'>Fill</button>
				<button type='button' onClick={handleSubmit} className='bg-white text-[#242424] p-3 rounded-md mt-4 active:scale-110'>{solving ? 'Solving...' : 'Solve'}</button>
			</div>
		</>
	)
}

export default App