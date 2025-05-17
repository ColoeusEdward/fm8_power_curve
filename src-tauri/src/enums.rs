use std::{default::Default, sync::{atomic::AtomicBool, Arc}};

use serde::{Serialize, Deserialize};
use tokio::sync::Mutex;


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


// #[derive(Serialize, Deserialize)]
pub struct RustState {
    // listener_task: Mutex<Option<AbortHandle>>,
    // emitter_task: Mutex<Option<AbortHandle>>,
    pub thread_running_flag: Arc<AtomicBool>,
}
impl RustState {
    fn new() -> Self {
        Self {
            thread_running_flag:  Arc::new(AtomicBool::new(false)),
        }
    }
}

// 定义 Channel 中传输的数据格式
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UdpDataPayload {
    pub sender: String,
    pub data: Vec<u8>, // Use bytes for raw UDP data
    // You might add a timestamp, etc.
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", rename_all_fields = "camelCase", tag = "event", content = "data")]
pub enum UdpDataEvent<'a> {
     DataIn {
         str: &'a str,
         content_length: usize,
  }
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", rename_all_fields = "camelCase", tag = "event", content = "data")]
pub enum DownloadEvent<'a> {
  Started {
    url: &'a str,
    download_id: usize,
    content_length: usize,
  },
  Progress {
    download_id: usize,
    chunk_length: usize,
  },
  Finished {
    download_id: usize,
  },
}

pub struct Progress {
    pub value: u8,
    pub status: String,
}