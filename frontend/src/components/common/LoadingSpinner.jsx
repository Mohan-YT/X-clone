export const LoadingDot = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;
	return <span className={`loading loading-dots ${sizeClass}`}></span>
};


export const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;

	return <span className={`loading loading-spinner ${sizeClass}`} />;
};
