use std::{ default::Default};

use serde::{Deserialize, Serialize};
use bincode::{Decode, Encode};

#[derive(Serialize, Deserialize)]
pub struct MyState {
    pub ip: String,
    pub port: i32,
}

impl Default for MyState {
    fn default() -> Self {
        // Return a default instance of MyState
        MyState {
            ip: String::from("127.0.0.1"),
            port: 8000, /* initialize fields here */
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct AppState {
    power_list:Vec<Vec<f32>>,
    torque_list:Vec<Vec<f32>>,
}


// #[derive(Serialize, Deserialize)]
// pub struct RustState {
//     // listener_task: Mutex<Option<AbortHandle>>,
//     // emitter_task: Mutex<Option<AbortHandle>>,
//     pub thread_running_flag: Arc<AtomicBool>,
// }
// impl RustState {
//     fn new() -> Self {
//         Self {
//             thread_running_flag:  Arc::new(AtomicBool::new(false)),
//         }
//     }
// }

// 定义 Channel 中传输的数据格式
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UdpDataPayload {
    pub sender: String,
    pub data: Vec<u8>, // Use bytes for raw UDP data
                       // You might add a timestamp, etc.
}

// #[derive(Clone, Serialize)]
// #[serde(
//     rename_all = "camelCase",
//     rename_all_fields = "camelCase",
//     tag = "event",
//     content = "data"
// )]
// pub enum UdpDataEvent<'a> {
//     DataIn {
//         data: &'a Vec<UdpDataItem>,
//         //  content_length: usize,
//     },
// }

#[derive(Clone, Serialize)]
#[serde(
    rename_all = "camelCase",
    rename_all_fields = "camelCase",
    tag = "event",
    content = "data"
)]
pub enum UdpDataEvent2<'a> {
    DataIn {
        data: &'a UdpDataItem2,
        //  content_length: usize,
    },
}

#[derive(Clone, Serialize)]
#[serde(
    rename_all = "camelCase",
    rename_all_fields = "camelCase",
    tag = "event",
    content = "data"
)]
pub enum MaxAreaEvent<'a> {
    DataIn {
        data: &'a Vec<f32>,
        //  content_length: usize,
    },
}

#[derive(Clone, Serialize)]
#[serde(
    rename_all = "camelCase",
    rename_all_fields = "camelCase",
    tag = "event",
    content = "data"
)]
pub enum RealTimeDataEvent<'a> {
    DataIn {
        data: &'a TelemetryDataItem,
        //  content_length: usize,
    },
}

// #[derive(Clone, Serialize)]
// #[serde(
//     rename_all = "camelCase",
//     rename_all_fields = "camelCase",
//     tag = "event",
//     content = "data"
// )]
// pub enum UdpDataEventTest {
//     DataIn {
//         // data: &'a Vec<UdpDataItem>,
//          content_length: usize,
//     },
// }


#[derive(Clone, Serialize,Default)]
pub struct TelemetryDataItem {
    pub is_race_on: Option<i32>,
    pub timestamp_ms: Option<u32>,
    pub engine_max_rpm: Option<f32>,
    pub engine_idle_rpm: Option<f32>,
    pub current_engine_rpm: Option<f32>,
    pub acceleration_x: Option<f32>,
    pub acceleration_y: Option<f32>,
    pub acceleration_z: Option<f32>,
    pub velocity_x: Option<f32>,
    pub velocity_y: Option<f32>,
    pub velocity_z: Option<f32>,
    pub angular_velocity_x: Option<f32>,
    pub angular_velocity_y: Option<f32>,
    pub angular_velocity_z: Option<f32>,
    pub yaw: Option<f32>,
    pub pitch: Option<f32>,
    pub roll: Option<f32>,
    pub normalized_suspension_travel_front_left: Option<f32>,
    pub normalized_suspension_travel_front_right: Option<f32>,
    pub normalized_suspension_travel_rear_left: Option<f32>,
    pub normalized_suspension_travel_rear_right: Option<f32>,
    pub tire_slip_ratio_front_left: Option<f32>,
    pub tire_slip_ratio_front_right: Option<f32>,
    pub tire_slip_ratio_rear_left: Option<f32>,
    pub tire_slip_ratio_rear_right: Option<f32>,
    pub wheel_rotation_speed_front_left: Option<f32>,
    pub wheel_rotation_speed_front_right: Option<f32>,
    pub wheel_rotation_speed_rear_left: Option<f32>,
    pub wheel_rotation_speed_rear_right: Option<f32>,
    pub wheel_on_rumble_strip_front_left: Option<i32>,
    pub wheel_on_rumble_strip_front_right: Option<i32>,
    pub wheel_on_rumble_strip_rear_left: Option<i32>,
    pub wheel_on_rumble_strip_rear_right: Option<i32>,
    pub wheel_in_puddle_depth_front_left: Option<f32>,
    pub wheel_in_puddle_depth_front_right: Option<f32>,
    pub wheel_in_puddle_depth_rear_left: Option<f32>,
    pub wheel_in_puddle_depth_rear_right: Option<f32>,
    pub surface_rumble_front_left: Option<f32>,
    pub surface_rumble_front_right: Option<f32>,
    pub surface_rumble_rear_left: Option<f32>,
    pub surface_rumble_rear_right: Option<f32>,
    pub tire_slip_angle_front_left: Option<f32>,
    pub tire_slip_angle_front_right: Option<f32>,
    pub tire_slip_angle_rear_left: Option<f32>,
    pub tire_slip_angle_rear_right: Option<f32>,
    pub tire_combined_slip_front_left: Option<f32>,
    pub tire_combined_slip_front_right: Option<f32>,
    pub tire_combined_slip_rear_left: Option<f32>,
    pub tire_combined_slip_rear_right: Option<f32>,
    pub suspension_travel_meters_front_left: Option<f32>,
    pub suspension_travel_meters_front_right: Option<f32>,
    pub suspension_travel_meters_rear_left: Option<f32>,
    pub suspension_travel_meters_rear_right: Option<f32>,
    pub car_ordinal: Option<i32>,
    pub car_class: Option<i32>,
    pub car_performance_index: Option<i32>,
    pub drivetrain_type: Option<i32>,
    pub num_cylinders: Option<i32>,
    pub position_x: Option<f32>,
    pub position_y: Option<f32>,
    pub position_z: Option<f32>,
    pub speed: Option<f32>,
    pub power: Option<f32>,
    pub torque: Option<f32>,
    pub tire_temp_front_left: Option<f32>,
    pub tire_temp_front_right: Option<f32>,
    pub tire_temp_rear_left: Option<f32>,
    pub tire_temp_rear_right: Option<f32>,
    pub boost: Option<f32>,
    pub fuel: Option<f32>,
    pub distance_traveled: Option<f32>,
    pub best_lap: Option<f32>,
    pub last_lap: Option<f32>,
    pub current_lap: Option<f32>,
    pub current_race_time: Option<f32>,
    pub lap_number: Option<u16>,
    pub race_position: Option<u8>,
    pub accel: Option<u8>,
    pub brake: Option<u8>,
    pub clutch: Option<u8>,
    pub hand_brake: Option<u8>,
    pub gear: Option<u8>,
    pub steer: Option<i8>,
    pub normalized_driving_line: Option<i8>,
    pub normalized_ai_brake_difference: Option<i8>,
    pub tire_wear_front_left: Option<f32>,
    pub tire_wear_front_right: Option<f32>,
    pub tire_wear_rear_left: Option<f32>,
    pub tire_wear_rear_right: Option<f32>,
    pub track_ordinal: Option<i32>,
}

#[derive(Clone, Serialize)]
pub struct UdpDataItem {
    pub name: String,
    pub val: String,
}

#[derive(Clone, Serialize)]
pub struct UdpDataItem2 {
    pub power: Vec<Vec<f32>>,
    pub torque: Vec<Vec<f32>>,
}

#[derive(Clone, Serialize)]
pub struct MaxAreaItem {
    pub rpm_zone: Vec<i32>, //[start,end]
}

#[derive(Clone, Serialize)]
#[serde(
    rename_all = "camelCase",
    rename_all_fields = "camelCase",
    tag = "event",
    content = "data"
)]
pub enum DownloadEvent<'a> {
    Started {
        url: &'a str,
        download_id: usize,
        content_length: usize,
    },
    //   Progress {
    //     download_id: usize,
    //     chunk_length: usize,
    //   },
    //   Finished {
    //     download_id: usize,
    //   },
}

// pub struct Progress {
//     pub value: u8,
//     pub status: String,
// }

#[derive(Serialize, Deserialize)]
#[derive(Encode, Decode, PartialEq, Debug)]
pub struct LocalDataContainer {
    pub buffers: Vec<Vec<u8>>,
}


// 定义一个新类型来包装 Vec<i32>
// #[derive(Debug, Eq, PartialEq)] // 需要 Eq 和 PartialEq 才能实现 Ord
// struct SortedVec(Vec<i32>);

// impl Ord for SortedVec {
//     fn cmp(&self, other: &Self) -> Ordering {
//         // 比较 self.0[0] 和 other.0[0]
//         // 必须处理空向量的情况，因为 Vec<i32>[0] 在空向量上会 panic
//         match (self.0.first(), other.0.first()) {
//             (Some(s_first), Some(o_first)) => s_first.cmp(o_first),
//             (Some(_), None) => Ordering::Greater, // 非空向量排在空向量之后
//             (None, Some(_)) => Ordering::Less,    // 空向量排在非空向量之前
//             (None, None) => Ordering::Equal,      // 两个空向量相等
//         }
//     }
// }

// impl PartialOrd for SortedVec {
//     fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
//         Some(self.cmp(other))
//     }
// }
