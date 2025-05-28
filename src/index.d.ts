type UdpEvent = {
  event: 'dataIn',
  data:{data:UdpDataItem[]},
}

type UdpEvent2 = {
  event: 'dataIn',
  data:{data:UdpDataItem2},
}

type MaxAreaEvent = {
  event: 'dataIn',
  data:{data:number[]},
}

type RealTimeEvent = {
  event: 'dataIn',
  data:{data:TelemetryDataItem},
}

type UdpDataItem = {
  name: string
    val: string
} 

type UdpDataItem2 = {
  power:number[][]
  torque:number[][]
} 

type DownloadEvent =
  | {
      event: 'started';
      data: {
        url: string;
        downloadId: number;
        contentLength: number;
      };
    }
    | {
      event: 'Started';
      data: {
        url: string;
        downloadId: number;
        contentLength: number;
      };
    }
  | {
      event: 'progress';
      data: {
        downloadId: number;
        chunkLength: number;
      };
    }
  | {
      event: 'finished';
      data: {
        downloadId: number;
      };
    };


interface maxDataItem  {
  power:{
    max:number
    rpm:number
  }
  torque:{
    max:number
    rpm:number
  }
}

interface TelemetryDataItem {
  is_race_on?: number | null; // `?` makes it optional, `| null` explicitly allows null
  timestamp_ms?: number | null;
  engine_max_rpm?: number | null;
  engine_idle_rpm?: number | null;
  current_engine_rpm?: number | null;
  acceleration_x?: number | null;
  acceleration_y?: number | null;
  acceleration_z?: number | null;
  velocity_x?: number | null;
  velocity_y?: number | null;
  velocity_z?: number | null;
  angular_velocity_x?: number | null;
  angular_velocity_y?: number | null;
  angular_velocity_z?: number | null;
  yaw?: number | null;
  pitch?: number | null;
  roll?: number | null;
  normalized_suspension_travel_front_left?: number | null;
  normalized_suspension_travel_front_right?: number | null;
  normalized_suspension_travel_rear_left?: number | null;
  normalized_suspension_travel_rear_right?: number | null;
  tire_slip_ratio_front_left?: number | null;
  tire_slip_ratio_front_right?: number | null;
  tire_slip_ratio_rear_left?: number | null;
  tire_slip_ratio_rear_right?: number | null;
  wheel_rotation_speed_front_left?: number | null;
  wheel_rotation_speed_front_right?: number | null;
  wheel_rotation_speed_rear_left?: number | null;
  wheel_rotation_speed_rear_right?: number | null;
  wheel_on_rumble_strip_front_left?: number | null;
  wheel_on_rumble_strip_front_right?: number | null;
  wheel_on_rumble_strip_rear_left?: number | null;
  wheel_on_rumble_strip_rear_right?: number | null;
  wheel_in_puddle_depth_front_left?: number | null;
  wheel_in_puddle_depth_front_right?: number | null;
  wheel_in_puddle_depth_rear_left?: number | null;
  wheel_in_puddle_depth_rear_right?: number | null;
  surface_rumble_front_left?: number | null;
  surface_rumble_front_right?: number | null;
  surface_rumble_rear_left?: number | null;
  surface_rumble_rear_right?: number | null;
  tire_slip_angle_front_left?: number | null;
  tire_slip_angle_front_right?: number | null;
  tire_slip_angle_rear_left?: number | null;
  tire_slip_angle_rear_right?: number | null;
  tire_combined_slip_front_left?: number | null;
  tire_combined_slip_front_right?: number | null;
  tire_combined_slip_rear_left?: number | null;
  tire_combined_slip_rear_right?: number | null;
  suspension_travel_meters_front_left?: number | null;
  suspension_travel_meters_front_right?: number | null;
  suspension_travel_meters_rear_left?: number | null;
  suspension_travel_meters_rear_right?: number | null;
  car_ordinal?: number | null;
  car_class?: number | null;
  car_performance_index?: number | null;
  drivetrain_type?: number | null;
  num_cylinders?: number | null;
  position_x?: number | null;
  position_y?: number | null;
  position_z?: number | null;
  speed?: number | null;
  power?: number | null;
  torque?: number | null;
  tire_temp_front_left?: number | null;
  tire_temp_front_right?: number | null;
  tire_temp_rear_left?: number | null;
  tire_temp_rear_right?: number | null;
  boost?: number | null;
  fuel?: number | null;
  distance_traveled?: number | null;
  best_lap?: number | null;
  last_lap?: number | null;
  current_lap?: number | null;
  current_race_time?: number | null;
  lap_number?: number | null;
  race_position?: number | null;
  accel?: number | null;
  brake?: number | null;
  clutch?: number | null;
  hand_brake?: number | null;
  gear?: number | null;
  steer?: number | null;
  normalized_driving_line?: number | null;
  normalized_ai_brake_difference?: number | null;
  tire_wear_front_left?: number | null;
  tire_wear_front_right?: number | null;
  tire_wear_rear_left?: number | null;
  tire_wear_rear_right?: number | null;
  track_ordinal?: number | null;
}