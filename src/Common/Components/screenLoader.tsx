import React from "react";


const screenLoader = () => {
    return (
		<div className="absolute inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
			<div className="w-8 h-8 border-2 rounded-full animate-spin border-l-transparent border-custom-500"></div>
		</div>
    );
}

export default screenLoader;
