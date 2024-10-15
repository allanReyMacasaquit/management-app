'use client';
function DottedSeparator() {
	return (
		<div
			className='max-w-xl mx-auto h-2 mb-4 md:mb-8'
			style={{
				backgroundImage:
					'radial-gradient(circle, #cccccc 1px, transparent 6px)',
				backgroundSize: '20px 20px',
				backgroundRepeat: 'repeat-x',
			}}
		></div>
	);
}
export default DottedSeparator;
