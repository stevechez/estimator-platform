'use client';

import SmartPhotoCapture from '@/components/photo/SmartPhotoCapture';

export default function PhotoTestSandbox() {
	// We use the same dummy project ID so it connects to the memories you saved yesterday!
	const TEST_PROJECT_ID = '11111111-1111-1111-1111-111111111111';

	return (
		<div className="min-h-screen bg-zinc-100 p-8 flex flex-col items-center justify-center font-sans">
			<div className="max-w-md w-full text-center mb-8">
				<h1 className="text-3xl font-black text-zinc-900">
					Phase 3: Visual Intel
				</h1>
				<p className="text-zinc-500 mt-2">
					Upload a photo of a construction defect, messy room, or materials.
				</p>
			</div>

			{/* Mount the Component */}
			<SmartPhotoCapture projectId={TEST_PROJECT_ID} />
		</div>
	);
}
