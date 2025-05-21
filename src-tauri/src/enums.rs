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



#[derive(Clone, Serialize)]
pub struct UdpDataItem {
    pub name: String,
    pub val: String,
}

#[derive(Clone, Serialize)]
pub struct UdpDataItem2 {
    pub power: Vec<Vec<i32>>,
    pub torque: Vec<Vec<i32>>,
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
