import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const ToggleStar = () => {
	const [active, setActive] = useState(false);
	
	const handleToggle = (e : any) => {
		e.preventDefault();
		setActive(!active);
	};
	
	return (
		<Link
			to="#!"
			onClick={handleToggle}
			className={`group/item toggle-button ${active ? 'active' : ''}`}
		>
			<Star
				className={
					"size-5 transition-all duration-150 ease-linear " +
					(active
						? "text-yellow-500 dark:text-yellow-500 dark:fill-yellow-500"
						: "text-slate-500 dark:text-zink-200 dark:fill-zink-600")
				}
			/>
		</Link>
	);
};

export default ToggleStar;