const configs = {

	"Dash": [
		{
			"name": "IsRaceOn",
			"type": "S32",
			"offset": 0,
			"bytes": 4,
			"description": "= 1 when race is on. = 0 when in menus/race stopped."
		},
		{
			"name": "TimestampMS",
			"type": "U32",
			"offset": 4,
			"bytes": 4,
			"description": "Can overflow to 0 eventually."
		},
		{
			"name": "EngineMaxRpm",
			"type": "F32",
			"offset": 8,
			"bytes": 4,
			"description": "Maximum RPM of the engine."
		},
		{
			"name": "EngineIdleRpm",
			"type": "F32",
			"offset": 12,
			"bytes": 4,
			"description": "Idle RPM of the engine."
		},
		{
			"name": "CurrentEngineRpm",
			"type": "F32",
			"offset": 16,
			"bytes": 4,
			"description": "Current RPM of the engine."
		},
		{
			"name": "AccelerationX",
			"type": "F32",
			"offset": 20,
			"bytes": 4,
			"description": "Acceleration in the car's local space (X = right)."
		},
		{
			"name": "AccelerationY",
			"type": "F32",
			"offset": 24,
			"bytes": 4,
			"description": "Acceleration in the car's local space (Y = up)."
		},
		{
			"name": "AccelerationZ",
			"type": "F32",
			"offset": 28,
			"bytes": 4,
			"description": "Acceleration in the car's local space (Z = forward)."
		},
		{
			"name": "VelocityX",
			"type": "F32",
			"offset": 32,
			"bytes": 4,
			"description": "Velocity in the car's local space (X = right)."
		},
		{
			"name": "VelocityY",
			"type": "F32",
			"offset": 36,
			"bytes": 4,
			"description": "Velocity in the car's local space (Y = up)."
		},
		{
			"name": "VelocityZ",
			"type": "F32",
			"offset": 40,
			"bytes": 4,
			"description": "Velocity in the car's local space (Z = forward)."
		},
		{
			"name": "AngularVelocityX",
			"type": "F32",
			"offset": 44,
			"bytes": 4,
			"description": "Angular velocity in the car's local space (X = pitch)."
		},
		{
			"name": "AngularVelocityY",
			"type": "F32",
			"offset": 48,
			"bytes": 4,
			"description": "Angular velocity in the car's local space (Y = yaw)."
		},
		{
			"name": "AngularVelocityZ",
			"type": "F32",
			"offset": 52,
			"bytes": 4,
			"description": "Angular velocity in the car's local space (Z = roll)."
		},
		{
			"name": "Yaw",
			"type": "F32",
			"offset": 56,
			"bytes": 4,
			"description": "Yaw angle of the car."
		},
		{
			"name": "Pitch",
			"type": "F32",
			"offset": 60,
			"bytes": 4,
			"description": "Pitch angle of the car."
		},
		{
			"name": "Roll",
			"type": "F32",
			"offset": 64,
			"bytes": 4,
			"description": "Roll angle of the car."
		},
		{
			"name": "NormalizedSuspensionTravelFrontLeft",
			"type": "F32",
			"offset": 68,
			"bytes": 4,
			"description": "Normalized suspension travel (0.0 = max stretch, 1.0 = max compression) for front left wheel."
		},
		{
			"name": "NormalizedSuspensionTravelFrontRight",
			"type": "F32",
			"offset": 72,
			"bytes": 4,
			"description": "Normalized suspension travel (0.0 = max stretch, 1.0 = max compression) for front right wheel."
		},
		{
			"name": "NormalizedSuspensionTravelRearLeft",
			"type": "F32",
			"offset": 76,
			"bytes": 4,
			"description": "Normalized suspension travel (0.0 = max stretch, 1.0 = max compression) for rear left wheel."
		},
		{
			"name": "NormalizedSuspensionTravelRearRight",
			"type": "F32",
			"offset": 80,
			"bytes": 4,
			"description": "Normalized suspension travel (0.0 = max stretch, 1.0 = max compression) for rear right wheel."
		},
		{
			"name": "TireSlipRatioFrontLeft",
			"type": "F32",
			"offset": 84,
			"bytes": 4,
			"description": "Normalized tire slip ratio (0 = 100% grip, |ratio| > 1.0 = loss of grip) for front left tire."
		},
		{
			"name": "TireSlipRatioFrontRight",
			"type": "F32",
			"offset": 88,
			"bytes": 4,
			"description": "Normalized tire slip ratio (0 = 100% grip, |ratio| > 1.0 = loss of grip) for front right tire."
		},
		{
			"name": "TireSlipRatioRearLeft",
			"type": "F32",
			"offset": 92,
			"bytes": 4,
			"description": "Normalized tire slip ratio (0 = 100% grip, |ratio| > 1.0 = loss of grip) for rear left tire."
		},
		{
			"name": "TireSlipRatioRearRight",
			"type": "F32",
			"offset": 96,
			"bytes": 4,
			"description": "Normalized tire slip ratio (0 = 100% grip, |ratio| > 1.0 = loss of grip) for rear right tire."
		},
		{
			"name": "WheelRotationSpeedFrontLeft",
			"type": "F32",
			"offset": 100,
			"bytes": 4,
			"description": "Wheel rotation speed in radians/sec for front left wheel."
		},
		{
			"name": "WheelRotationSpeedFrontRight",
			"type": "F32",
			"offset": 104,
			"bytes": 4,
			"description": "Wheel rotation speed in radians/sec for front right wheel."
		},
		{
			"name": "WheelRotationSpeedRearLeft",
			"type": "F32",
			"offset": 108,
			"bytes": 4,
			"description": "Wheel rotation speed in radians/sec for rear left wheel."
		},
		{
			"name": "WheelRotationSpeedRearRight",
			"type": "F32",
			"offset": 112,
			"bytes": 4,
			"description": "Wheel rotation speed in radians/sec for rear right wheel."
		},
		{
			"name": "WheelOnRumbleStripFrontLeft",
			"type": "S32",
			"offset": 116,
			"bytes": 4,
			"description": "= 1 when wheel is on rumble strip, = 0 when off (front left wheel)."
		},
		{
			"name": "WheelOnRumbleStripFrontRight",
			"type": "S32",
			"offset": 120,
			"bytes": 4,
			"description": "= 1 when wheel is on rumble strip, = 0 when off (front right wheel)."
		},
		{
			"name": "WheelOnRumbleStripRearLeft",
			"type": "S32",
			"offset": 124,
			"bytes": 4,
			"description": "= 1 when wheel is on rumble strip, = 0 when off (rear left wheel)."
		},
		{
			"name": "WheelOnRumbleStripRearRight",
			"type": "S32",
			"offset": 128,
			"bytes": 4,
			"description": "= 1 when wheel is on rumble strip, = 0 when off (rear right wheel)."
		},
		{
			"name": "WheelInPuddleDepthFrontLeft",
			"type": "F32",
			"offset": 132,
			"bytes": 4,
			"description": "= from 0 to 1, where 1 is the deepest puddle (front left wheel)."
		},
		{
			"name": "WheelInPuddleDepthFrontRight",
			"type": "F32",
			"offset": 136,
			"bytes": 4,
			"description": "= from 0 to 1, where 1 is the deepest puddle (front right wheel)."
		},
		{
			"name": "WheelInPuddleDepthRearLeft",
			"type": "F32",
			"offset": 140,
			"bytes": 4,
			"description": "= from 0 to 1, where 1 is the deepest puddle (rear left wheel)."
		},
		{
			"name": "WheelInPuddleDepthRearRight",
			"type": "F32",
			"offset": 144,
			"bytes": 4,
			"description": "= from 0 to 1, where 1 is the deepest puddle (rear right wheel)."
		},
		{
			"name": "SurfaceRumbleFrontLeft",
			"type": "F32",
			"offset": 148,
			"bytes": 4,
			"description": "Non-dimensional surface rumble values passed to controller force feedback (front left wheel)."
		},
		{
			"name": "SurfaceRumbleFrontRight",
			"type": "F32",
			"offset": 152,
			"bytes": 4,
			"description": "Non-dimensional surface rumble values passed to controller force feedback (front right wheel)."
		},
		{
			"name": "SurfaceRumbleRearLeft",
			"type": "F32",
			"offset": 156,
			"bytes": 4,
			"description": "Non-dimensional surface rumble values passed to controller force feedback (rear left wheel)."
		},
		{
			"name": "SurfaceRumbleRearRight",
			"type": "F32",
			"offset": 160,
			"bytes": 4,
			"description": "Non-dimensional surface rumble values passed to controller force feedback (rear right wheel)."
		},
		{
			"name": "TireSlipAngleFrontLeft",
			"type": "F32",
			"offset": 164,
			"bytes": 4,
			"description": "Normalized tire slip angle (0 = 100% grip, |angle| > 1.0 = loss of grip) for front left tire."
		},
		{
			"name": "TireSlipAngleFrontRight",
			"type": "F32",
			"offset": 168,
			"bytes": 4,
			"description": "Normalized tire slip angle (0 = 100% grip, |angle| > 1.0 = loss of grip) for front right tire."
		},
		{
			"name": "TireSlipAngleRearLeft",
			"type": "F32",
			"offset": 172,
			"bytes": 4,
			"description": "Normalized tire slip angle (0 = 100% grip, |angle| > 1.0 = loss of grip) for rear left tire."
		},
		{
			"name": "TireSlipAngleRearRight",
			"type": "F32",
			"offset": 176,
			"bytes": 4,
			"description": "Normalized tire slip angle (0 = 100% grip, |angle| > 1.0 = loss of grip) for rear right tire."
		},
		{
			"name": "TireCombinedSlipFrontLeft",
			"type": "F32",
			"offset": 180,
			"bytes": 4,
			"description": "Normalized tire combined slip (0 = 100% grip, |slip| > 1.0 = loss of grip) for front left tire."
		},
		{
			"name": "TireCombinedSlipFrontRight",
			"type": "F32",
			"offset": 184,
			"bytes": 4,
			"description": "Normalized tire combined slip (0 = 100% grip, |slip| > 1.0 = loss of grip) for front right tire."
		},
		{
			"name": "TireCombinedSlipRearLeft",
			"type": "F32",
			"offset": 188,
			"bytes": 4,
			"description": "Normalized tire combined slip (0 = 100% grip, |slip| > 1.0 = loss of grip) for rear left tire."
		},
		{
			"name": "TireCombinedSlipRearRight",
			"type": "F32",
			"offset": 192,
			"bytes": 4,
			"description": "Normalized tire combined slip (0 = 100% grip, |slip| > 1.0 = loss of grip) for rear right tire."
		},
		{
			"name": "SuspensionTravelMetersFrontLeft",
			"type": "F32",
			"offset": 196,
			"bytes": 4,
			"description": "Actual suspension travel in meters for front left wheel."
		},
		{
			"name": "SuspensionTravelMetersFrontRight",
			"type": "F32",
			"offset": 200,
			"bytes": 4,
			"description": "Actual suspension travel in meters for front right wheel."
		},
		{
			"name": "SuspensionTravelMetersRearLeft",
			"type": "F32",
			"offset": 204,
			"bytes": 4,
			"description": "Actual suspension travel in meters for rear left wheel."
		},
		{
			"name": "SuspensionTravelMetersRearRight",
			"type": "F32",
			"offset": 208,
			"bytes": 4,
			"description": "Actual suspension travel in meters for rear right wheel."
		},
		{
			"name": "CarOrdinal",
			"type": "S32",
			"offset": 212,
			"bytes": 4,
			"description": "Unique ID of the car make/model."
		},
		{
			"name": "CarClass",
			"type": "S32",
			"offset": 216,
			"bytes": 4,
			"description": "Between 0 (D -- worst cars) and 7 (X class -- best cars) inclusive."
		},
		{
			"name": "CarPerformanceIndex",
			"type": "S32",
			"offset": 220,
			"bytes": 4,
			"description": "Between 100 (worst car) and 999 (best car) inclusive."
		},
		{
			"name": "DrivetrainType",
			"type": "S32",
			"offset": 224,
			"bytes": 4,
			"description": "0 = FWD, 1 = RWD, 2 = AWD."
		},
		{
			"name": "NumCylinders",
			"type": "S32",
			"offset": 228,
			"bytes": 4,
			"description": "Number of cylinders in the engine."
		},
		{
			"name": "PositionX",
			"type": "F32",
			"offset": 232,
			"bytes": 4,
			"description": "X coordinate of the car's position."
		},
		{
			"name": "PositionY",
			"type": "F32",
			"offset": 236,
			"bytes": 4,
			"description": "Y coordinate of the car's position."
		},
		{
			"name": "PositionZ",
			"type": "F32",
			"offset": 240,
			"bytes": 4,
			"description": "Z coordinate of the car's position."
		},
		{
			"name": "Speed",
			"type": "F32",
			"offset": 244,
			"bytes": 4,
			"description": "Current speed of the car."
		},
		{
			"name": "Power",
			"type": "F32",
			"offset": 248,
			"bytes": 4,
			"description": "Current power output of the engine."
		},
		{
			"name": "Torque",
			"type": "F32",
			"offset": 252,
			"bytes": 4,
			"description": "Current torque output of the engine."
		},
		{
			"name": "TireTempFrontLeft",
			"type": "F32",
			"offset": 256,
			"bytes": 4,
			"description": "Temperature of the front left tire."
		},
		{
			"name": "TireTempFrontRight",
			"type": "F32",
			"offset": 260,
			"bytes": 4,
			"description": "Temperature of the front right tire."
		},
		{
			"name": "TireTempRearLeft",
			"type": "F32",
			"offset": 264,
			"bytes": 4,
			"description": "Temperature of the rear left tire."
		},
		{
			"name": "TireTempRearRight",
			"type": "F32",
			"offset": 268,
			"bytes": 4,
			"description": "Temperature of the rear right tire."
		},
		{
			"name": "Boost",
			"type": "F32",
			"offset": 272,
			"bytes": 4,
			"description": "Current boost level."
		},
		{
			"name": "Fuel",
			"type": "F32",
			"offset": 276,
			"bytes": 4,
			"description": "Remaining fuel in the car."
		},
		{
			"name": "DistanceTraveled",
			"type": "F32",
			"offset": 280,
			"bytes": 4,
			"description": "Total distance traveled by the car."
		},
		{
			"name": "BestLap",
			"type": "F32",
			"offset": 284,
			"bytes": 4,
			"description": "Best lap time of the car."
		},
		{
			"name": "LastLap",
			"type": "F32",
			"offset": 288,
			"bytes": 4,
			"description": "Time of the last completed lap."
		},
		{
			"name": "CurrentLap",
			"type": "F32",
			"offset": 292,
			"bytes": 4,
			"description": "Time of the current lap."
		},
		{
			"name": "CurrentRaceTime",
			"type": "F32",
			"offset": 296,
			"bytes": 4,
			"description": "Total race time elapsed."
		},
		{
			"name": "LapNumber",
			"type": "U16",
			"offset": 300,
			"bytes": 2,
			"description": "Current lap number."
		},
		{
			"name": "RacePosition",
			"type": "U8",
			"offset": 302,
			"bytes": 1,
			"description": "Current race position of the car."
		},
		{
			"name": "Accel",
			"type": "U8",
			"offset": 303,
			"bytes": 1,
			"description": "Current acceleration input."
		},
		{
			"name": "Brake",
			"type": "U8",
			"offset": 304,
			"bytes": 1,
			"description": "Current brake input."
		},
		{
			"name": "Clutch",
			"type": "U8",
			"offset": 305,
			"bytes": 1,
			"description": "Current clutch input."
		},
		{
			"name": "HandBrake",
			"type": "U8",
			"offset": 306,
			"bytes": 1,
			"description": "Current handbrake input."
		},
		{
			"name": "Gear",
			"type": "U8",
			"offset": 307,
			"bytes": 1,
			"description": "Current gear selected."
		},
		{
			"name": "Steer",
			"type": "S8",
			"offset": 308,
			"bytes": 1,
			"description": "Current steering input."
		},
		{
			"name": "NormalizedDrivingLine",
			"type": "S8",
			"offset": 309,
			"bytes": 1,
			"description": "Normalized driving line input."
		},
		{
			"name": "NormalizedAIBrakeDifference",
			"type": "S8",
			"offset": 310,
			"bytes": 1,
			"description": "Normalized AI brake difference."
		},
		{
			"name": "TireWearFrontLeft",
			"type": "F32",
			"offset": 311,
			"bytes": 4,
			"description": "Wear level of the front left tire."
		},
		{
			"name": "TireWearFrontRight",
			"type": "F32",
			"offset": 315,
			"bytes": 4,
			"description": "Wear level of the front right tire."
		},
		{
			"name": "TireWearRearLeft",
			"type": "F32",
			"offset": 319,
			"bytes": 4,
			"description": "Wear level of the rear left tire."
		},
		{
			"name": "TireWearRearRight",
			"type": "F32",
			"offset": 323,
			"bytes": 4,
			"description": "Wear level of the rear right tire."
		},
		{
			"name": "TrackOrdinal",
			"type": "S32",
			"offset": 327,
			"bytes": 4,
			"description": "Unique ID for the track."
		}
	]
};


export const option2 = {
	// Chart title
	title: {
			text: '发动机性能曲线 (RPM vs. 马力 & 扭矩)',
			left: 'center'
	},
	// Tooltip for displaying data on hover
	tooltip: {
			trigger: 'axis', // Show tooltip for all series on the same X-axis point
			axisPointer: {
					type: 'cross' // Crosshairs for better data point identification
			},
			// formatter: function (params: { value: number[],seriesName: string }[]) {
			// 		let tooltipContent = 'RPM: ' + params[0].value[0] + '<br/>';
			// 		params.forEach(function (item) {
			// 				if (item.seriesName === '马力') {
			// 						tooltipContent += '马力: ' + item.value[1] + ' HP<br/>';
			// 				} else if (item.seriesName === '扭矩') {
			// 						tooltipContent += '扭矩: ' + item.value[1] + ' Nm<br/>';
			// 				}
			// 		});
			// 		return tooltipContent;
			// }
	},
	toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
	// Legend to distinguish between Horsepower and Torque lines
	legend: {
			data: ['马力', '扭矩'],
			bottom: 1,
			left: 'center'
	},
	// Grid settings for the chart area
	grid: {
			left: '5%',
			right: '5%',
			bottom: '10%',
			containLabel: true // Ensure labels are fully visible
	},
	// X-axis (RPM)
	xAxis: {
			type: 'value', // Value axis for numerical RPM
			name: '转速 (RPM)', // Axis name
			nameLocation: 'middle',
			nameGap: 30,
			axisLabel: {
					formatter: '{value} RPM'
			},
			splitLine: {
					show: true // Show grid lines for X-axis
			}
	},
	// First Y-axis (Horsepower)
	yAxis: [
			{
					type: 'value',
					name: '马力 (HP)', // Axis name
					nameLocation: 'middle',
					nameGap: 40,
					axisLabel: {
							formatter: '{value} HP'
					},
					splitLine: {
							show: true // Show grid lines for Horsepower Y-axis
					}
			},
			// Second Y-axis (Torque)
			{
					type: 'value',
					name: '扭矩 (Nm)', // Axis name
					nameLocation: 'middle',
					nameGap: 40,
					axisLabel: {
							formatter: '{value} Nm'
					},
					splitLine: {
							show: false // Optional: Hide grid lines for Torque Y-axis if you want to avoid clutter
					}
			}
	],
	// Series for Horsepower and Torque
	series: [
			{
					name: '马力', // Corresponds to legend data
					type: 'scatter', // Scatter plot for individual data points
					yAxisIndex: 0, // Binds to the first Y-axis (Horsepower)
					itemStyle: {
						color: '#f45057' // 红色
					},
					symbolSize: 5, 
					data: [
							// Example data: [RPM, Horsepower]
							[1000, 50],
							[1500, 75],
							[2000, 100],
							[2500, 120],
							[3000, 140],
							[3500, 155],
							[4000, 160],
							[4500, 150],
							[5000, 130]
							// ... add your actual horsepower data here
					]
			},
			{
					name: '扭矩', // Corresponds to legend data
					type: 'scatter', // Scatter plot for individual data points
					yAxisIndex: 1, // Binds to the second Y-axis (Torque)
					itemStyle: {	
						color: '#0052d9' // 蓝色
					},
					symbolSize: 5, 
					data: [
							// Example data: [RPM, Torque]
							[1000, 180],
							[1500, 200],
							[2000, 220],
							[2500, 230],
							[3000, 225],
							[3500, 210],
							[4000, 190],
							[4500, 170],
							[5000, 150]
							// ... add your actual torque data here
					]
			}
	]
};