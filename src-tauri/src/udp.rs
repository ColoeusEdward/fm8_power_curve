use std::{
    net::UdpSocket,
    sync::{
        atomic::{AtomicBool, AtomicUsize, Ordering},
        Mutex, OnceLock,
    },
};
use tauri::Emitter;
use tokio::time::{sleep, Duration};

use crate::{
    config::TELEMETRY_FIELDS,
    enums::{self, DownloadEvent, UdpDataEvent, UdpDataItem},
    util::{is_port_available, load_raw_bytes_from_file, save_raw_bytes_to_file},
};

pub static ISSTART: OnceLock<AtomicUsize> = OnceLock::new();
pub static THREAD_RUNINNG_FLAG: OnceLock<AtomicBool> = OnceLock::new();
pub static SAING_DATA: OnceLock<AtomicBool> = OnceLock::new();
pub static TEMP_SAVING_BUFFER: OnceLock<Mutex<Vec<Vec<u8>>>> = OnceLock::new();

// pub static READ: OnceLock<tauri::ipc::Channel<UdpDataEvent>> = OnceLock::new();
// pub static READ: OnceLock<Box<dyn tauri::ipc::Channel<UdpDataEvent>>> = OnceLock::new();

// pub static SOCKET_INSTANCE: OnceLock<UdpSocket> = OnceLock::new();

#[tauri::command(async)]
pub async fn init_config(
    win: tauri::Window,
    config: enums::MyState,
    reader: tauri::ipc::Channel<UdpDataEvent<'static>>,
) -> Result<(), String> {
    println!(
        "🪵 [udp.rs:7]~ token ~ \x1b[0;32mconfig\x1b[0m = {} {}",
        config.ip, config.port
    );
    // READ.set(reader);
    let is_start = ISSTART.get_or_init(|| AtomicUsize::new(0));

    if is_start.load(std::sync::atomic::Ordering::SeqCst) > 0 {
        println!("UDP listener is already running");
        return Ok(());
    }
    is_start.store(1, std::sync::atomic::Ordering::SeqCst);
    let port = config.port;

    // let running_flag = Arc::new(AtomicBool::new(true)); // Flag for the new thread
    // let thread_running_flag = Arc::clone(&running_flag); // Clone for the thread closure
    let thread_running_flag = THREAD_RUNINNG_FLAG.get_or_init(|| AtomicBool::new(true));
    thread_running_flag.store(true, Ordering::SeqCst);
    //  &state.thread_running_flag;
    //  = thread_running_flag;
    // state.

    let socket_addr = format!("{}:{}", config.ip, port); // Listen on all interfaces
    let socket = match UdpSocket::bind(&socket_addr) {
        Ok(s) => s,
        Err(e) => {
            println!("Failed to bind UDP socket: {}", e);
            is_start.store(0, std::sync::atomic::Ordering::SeqCst);
            thread_running_flag.store(false, Ordering::SeqCst);
            win.emit(
                "connect_fail",
                format!("UDP receive error: Failed to bind UDP socket: {}", e),
            )
            .unwrap();
            return Err(format!("Failed to bind UDP socket:  {}", e));
        }
    };

    println!("Listening on UDP: {}", socket_addr);

    let _ = tauri::async_runtime::spawn(async move {
        // let mut buffer = [0u8; 1024]; // Adjust buffer size as needed
        let mut buffer = [0u8; 1500]; // Typical MTU for Ethernet
                                      // let (tx, _) = mpsc::channel::<UdpDataPayload>(1024); // Buffer size 1024
        let name_list = ["Power", "CurrentEngineRpm", "Torque"];
        let field_vec = TELEMETRY_FIELDS
            .iter()
            .filter(|item| name_list.contains(&item.name))
            .collect::<Vec<_>>();
        while thread_running_flag.load(Ordering::SeqCst) {
            // Use a non-blocking or timed receive in a real app to allow checking the flag
            // For simplicity here, we'll use blocking, which makes stopping immediate less trivial
            // A better approach would be using a channel or tokio with select!

            // Example with a small timeout to check the flag (less efficient but works with std::net)

            match socket.set_read_timeout(Some(std::time::Duration::from_millis(3000))) {
                Ok(_) => {}
                Err(_) => {
                    println!("Failed to set read timeout");
                    break;
                } // Error setting timeout, exit thread
            }

            match socket.recv_from(&mut buffer) {
                Ok((_size, _)) => {
                    save_5_sec_data(buffer).unwrap();
                    // let data = &buffer[..size];
                    // // Assuming data is UTF-8 for simplicity. Handle other formats as needed.
                    // let received_text = String::from_utf8_lossy(data).to_string();
                    // println!("Received {} bytes from {}: {}", size, src, received_text);

                    // // Emit event to the frontend
                    // let payload = serde_json::json!({
                    //     "sender": src.to_string(),
                    //     "data": received_text, // Send as string
                    //     "rawData": data // Or send raw bytes if needed
                    // });
                    // win.emit("udp_data",  payload).unwrap();

                    // let data = buffer[..size].to_vec();
                    // println!("🪵 [udp.rs:108]~ token ~ \x1b[0;32mdata\x1b[0m = {} {}", size,String::from_utf8_lossy(&buffer as &[u8]));

                    let mut data_vec: Vec<UdpDataItem> = Vec::new();

                    for item in field_vec.iter() {
                        let buf: &[u8] = &buffer[item.offset..item.offset + item.bytes - 1];
                        let val = String::from_utf8_lossy(&buf as &[u8]).to_string();
                        data_vec.push(UdpDataItem {
                            name: item.name.to_string(),
                            val,
                        });
                    }
                    println!(
                        "🪵 [udp.rs:118]~ token ~ \x1b[0;32mdata_vec\x1b[0m = {}",
                        data_vec[0].val
                    );

                    let res = reader.send(UdpDataEvent::DataIn { data: &data_vec });
                    match res {
                        Ok(_) => {}
                        Err(e) => {
                            println!("Failed to send data to channel: {}", e);
                            win.emit(
                                "connect_fail",
                                format!("Failed to send data to channel: {}", e),
                            )
                            .unwrap();
                            break;
                        }
                    }
                }
                Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                    // Timeout occurred, check the running flag and continue or exit
                    if !thread_running_flag.load(Ordering::SeqCst) {
                        break; // Exit loop if flag is false
                    }
                }
                Err(e) => {
                    eprintln!("UDP receive error: {}", e);
                    let mut err = e.to_string();
                    if !is_port_available(&config.ip, config.port as u16) {
                        err = format!("端口 {} 已被程序占用", config.port);
                    }
                    win.emit("connect_fail", format!("UDP receive error: {}", err))
                        .unwrap();

                    // Handle other errors, maybe emit an error event
                    break; // Exit loop on other errors
                }
            }
        }
        println!("UDP listener thread stopped.");
        is_start.store(0, std::sync::atomic::Ordering::SeqCst);
        thread_running_flag.store(false, Ordering::SeqCst);
        win.emit("connect_stop", format!("UDP listener thread stopped: "))
            .unwrap();
    });
    Ok(())
}

#[tauri::command]
pub fn stop_udp(_win: tauri::Window) {
    let thread_running_flag = THREAD_RUNINNG_FLAG.get_or_init(|| AtomicBool::new(false));
    thread_running_flag.store(false, Ordering::SeqCst);
}

#[tauri::command(async)]
pub async fn test_channel_data(
    // win: tauri::Window,
    // config: enums::MyState,
    reader: tauri::ipc::Channel<DownloadEvent<'static>>,
) -> Result<(), String> {
    loop {
        let _ = reader.send(DownloadEvent::Started {
            url: "https://www.baidu.com",
            download_id: 1,
            content_length: 100,
        });
        println!(
            "🪵 [udp.rs:202]~ token ~ \x1b[0;32mhello\x1b[0m = {}",
            "hello"
        );
        sleep(Duration::from_millis(1000)).await;
        // win.emit("connect_stop", format!("UDP listener thread stopped: ")).unwrap();
    }
}

#[tauri::command]
pub fn fuck_channel(
    // win: tauri::Window,
    // config: enums::MyState,
    reader_event: tauri::ipc::Channel<DownloadEvent>,
) -> Result<(), String> {
    let res = reader_event.send(DownloadEvent::Started {
        url: "https://www.baidu.com",
        download_id: 1,
        content_length: 100,
    });
    match res {
        Ok(_) => {
            println!("🪵 [udp.rs:222]~ token ~ \x1b[0;32mok\x1b[0m = {}", "ok");
        }
        Err(e) => {
            println!("🪵 [udp.rs:222]~ token ~ \x1b[0;32merror\x1b[0m = {}", e);
        }
    }
    println!("🪵 [udp.rs:222]~ token ~ \x1b[0;32m100\x1b[0m = {}", 100);
    Ok(())
}

#[tauri::command]
pub fn set_saving_data_flag() {
    let start_flag = SAING_DATA.get_or_init(|| AtomicBool::new(false));
    start_flag.store(true, Ordering::SeqCst);
    let _ = tauri::async_runtime::spawn(async move {
        sleep(Duration::from_secs(8)).await;
        let start_flag = SAING_DATA.get_or_init(|| AtomicBool::new(false));
        start_flag.store(false, Ordering::SeqCst);
        sleep(Duration::from_millis(10)).await;
        let temp_buf_list = TEMP_SAVING_BUFFER
            .get_or_init(|| Mutex::new(Vec::new()))
            .lock();
        let mut temp_buf_list = match temp_buf_list {
            Ok(temp_buf_list) => temp_buf_list,
            Err(e) => {
                eprintln!("Failed to acquire lock on TEMP_SAVING_BUFFER: {}", e);
                return;
            }
        };
        // temp_buf_list.push([123, 110].to_vec());
        let save_res = save_raw_bytes_to_file(&*temp_buf_list, "fm.data");
        match save_res {
            Ok(_) => {
                println!("🪵 [udp.rs:222]~ token ~ \x1b[0;32mok\x1b[0m = {}", "ok");
            }
            Err(e) => {
                println!("🪵 [udp.rs:222]~ token ~ \x1b[0;32merror\x1b[0m = {}", e);
            }
        }
    });
}

#[tauri::command(async)]
pub fn local_data_test_mode(reader: tauri::ipc::Channel<UdpDataEvent<'static>>) -> () {
    let data = load_raw_bytes_from_file("fm.data");
    let data = match data {
        Ok(data) => data,
        Err(e) => {
            println!("Error loading data: {}", e);
            return;
        }
    };
    let _ = tauri::async_runtime::spawn(async move {
        let name_list = ["Power", "CurrentEngineRpm", "Torque"];
        let field_vec = TELEMETRY_FIELDS
            .iter()
            .filter(|item| name_list.contains(&item.name))
            .collect::<Vec<_>>();

        for i in data {
            let mut data_vec: Vec<UdpDataItem> = Vec::new();

            for item in field_vec.iter() {
                let buf: &[u8] = &i[item.offset..item.offset + item.bytes - 1];
                let val = String::from_utf8_lossy(&buf as &[u8]).to_string();
                data_vec.push(UdpDataItem {
                    name: item.name.to_string(),
                    val,
                });
            }
            let _ = reader.send(UdpDataEvent::DataIn { data: &data_vec });
            sleep(Duration::from_millis(15)).await;
        }
    });
    //    let mut temp_buf_list = TEMP_SAVING_BUFFER.get_or_init(|| Mutex::new(Vec::new())).lock().unwrap();
    //    temp_buf_list = data;
    //    Ok(())
}

fn save_5_sec_data(buf: [u8; 1500]) -> Result<(), String> {
    let start_flag = SAING_DATA.get_or_init(|| AtomicBool::new(false));
    if start_flag.load(Ordering::SeqCst) {
        let temp_buf_list = TEMP_SAVING_BUFFER.get_or_init(|| Mutex::new(Vec::new()));
        if let Ok(mut buffer_guard) = temp_buf_list.lock() {
            buffer_guard.push(buf.to_vec());
            println!("Pushed data. Current length: {}", buffer_guard.len());
        } else {
            eprintln!("Failed to acquire lock on TEMP_SAVING_BUFFER");
        }
    }
    Ok(())
}
