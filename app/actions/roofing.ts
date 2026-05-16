// app/actions/roofing.ts
"use server";

export async function getRoofData(lat: number, lng: number) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        // Manually tell Google where this server request is "coming from"
        Referer: "http://localhost:3000/",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google API Error (${response.status}):`, errorText);
      throw new Error(`Google API responded with ${response.status}`);
    }

    const data = await response.json();

    const stats = data.solarPotential?.wholeRoofStats;
    const roofSegments = data.solarPotential?.roofSegmentStats || [];

    const netAreaM2 = stats?.areaMeters2 || 0;
    const netSquares = (netAreaM2 * 10.7639) / 100;

    // The "Professional" Adjustment
    const WASTE_FACTOR = 1.15; // 15% for hips, valleys, and starter shingles
    const grossSquares = netSquares * WASTE_FACTOR;

    return {
      success: true,
      totalAreaM2: netAreaM2,
      totalSquares: grossSquares.toFixed(2),
      avgPitch:
        roofSegments.length > 0
          ? (
              roofSegments.reduce(
                (acc: number, curr: any) => acc + curr.pitchDegrees,
                0,
              ) / roofSegments.length
            ).toFixed(1)
          : 0,
    };
  } catch (error) {
    console.error("Roofing API Error:", error);
    return {
      success: false,
      error: "Could not find roof data for this location.",
    };
  }
}
