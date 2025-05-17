use std::{
    future, net::UdpSocket, sync::{
        atomic::{AtomicBool, AtomicUsize, Ordering},
        Arc, OnceLock,
    }, thread
};
use tauri::{Emitter, State};
use tokio::{
    sync::{mpsc, Mutex},
    time::{sleep, Duration},
};

use crate::enums::{self, DownloadEvent, RustState, UdpDataEvent, UdpDataPayload};

pub static ISSTART: OnceLock<AtomicUsize> = OnceLock::new();
pub static THREAD_RUNINNG_FLAG: OnceLock<AtomicBool> = OnceLock::new();

// pub static READ: OnceLock<tauri::ipc::Channel<UdpDataEvent>> = OnceLock::new();
// pub static READ: OnceLock<Box<dyn tauri::ipc::Channel<UdpDataEvent>>> = OnceLock::new();

// pub static SOCKET_INSTANCE: OnceLock<UdpSocket> = OnceLock::new();


#[tauri::command(async)]
pub async  fn init_config(
    win: tauri::Window,
    config: enums::MyState,
    reader:  tauri::ipc::Channel<UdpDataEvent<'static>>,
) -> Result<(), String>  {
    println!(
        "🪵 [udp.rs:7]~ token ~ \x1b[0;32mconfig\x1b[0m = {} {}",
        config.ip, config.port
    );
    // READ.set(reader);
    let is_start = ISSTART.get_or_init(|| AtomicUsize::new(0));

    if (is_start.load(std::sync::atomic::Ordering::SeqCst) > 0) {
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
            return Err(format!("Failed to bind UDP socket: {}", e));
        }
    };
    println!("Listening on UDP: {}", socket_addr);

    

    let _ = tauri::async_runtime::spawn( async move {
        // let mut buffer = [0u8; 1024]; // Adjust buffer size as needed
        let mut buffer = [0u8; 1500]; // Typical MTU for Ethernet
                                      // let (tx, _) = mpsc::channel::<UdpDataPayload>(1024); // Buffer size 1024

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
                Ok((size, src)) => {
                    
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
                    println!("🪵 [udp.rs:108]~ token ~ \x1b[0;32mdata\x1b[0m = {} {}", size,String::from_utf8_lossy(&buffer as &[u8]));
                    // let payload = UdpDataPayload {
                    //     sender: src.to_string(),
                    //     data,
                    // };

                    let res = reader.send(UdpDataEvent::DataIn { 
                        str: &String::from_utf8_lossy(&buffer as &[u8]).trim(), content_length: size 
                    });
                    match res {
                        Ok(_) => {}
                        Err(e) => {
                            println!("Failed to send data to channel: {}", e);
                            win.emit("connect_fail", format!("Failed to send data to channel: {}", e)).unwrap();
                            break;
                        }
                    }

                    // if  {
                    //     println!("Channel receiver dropped, listener task exiting.");
                    //     win.emit(
                    //         "connect_fail",
                    //         format!("Channel receiver dropped, listener task exiting."),
                    //     )
                    //     .unwrap();
                    //     break;
                    // }
                    // Send data into the channel
                    // if tx.send(payload).await.is_err() {
                    //     // Receiver has been dropped, means the emitter task stopped
                    //     println!("Channel receiver dropped, listener task exiting.");
                    //     win.emit("connect_fail", format!("Channel receiver dropped, listener task exiting.")).unwrap();
                    //     break;
                    // }
                }
                Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                    // Timeout occurred, check the running flag and continue or exit
                    if !thread_running_flag.load(Ordering::SeqCst) {
                        break; // Exit loop if flag is false
                    }
                }
                Err(e) => {
                    eprintln!("UDP receive error: {}", e);
                    win.emit("connect_fail", format!("UDP receive error: {}", e))
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

        // Mark as not running in the main state after the thread finishes
        // let mut listener_state_after_thread = state.udp_listener.lock().unwrap();
        // listener_state_after_thread.running.store(false, Ordering::SeqCst);
        // listener_state_after_thread.handle = None; // Clear handle
    });

    // Store the flag in the shared state so the stop command can access it
    // Also store the handle if you want to join it later (optional)
    // let running_flag_for_state = Arc::clone(&running_flag);
    // listener_state.running = AtomicBool::new(true); // Update the state's running flag
    // listener_state.handle = Some(listener_thread);
    Ok(())

    // let _ = udp_start(win, config, reader);
    // Emit a custom event to the frontend
    // window.emit("config-to_rust").expect("failed to emit event");
}
// pub fn wait_to_reconnet() {
//     tokio::spawn(async move {
//         sleep(Duration::from_secs(1)).await;
//         init_config(enums::MyState::default()).unwrap();
//     });
// }
// pub fn udp_start(
//     win: tauri::Window,
//     config: enums::MyState,
//     reader: tauri::ipc::Channel<UdpDataEvent>,
// ) -> Result<(), String> {
    
// }

#[tauri::command]
pub fn stop_udp(_win: tauri::Window) {
    let thread_running_flag = THREAD_RUNINNG_FLAG.get_or_init(|| AtomicBool::new(false));
    thread_running_flag.store(false, Ordering::SeqCst);
}

#[tauri::command(async)]
pub async fn test_channel_data(
    win: tauri::Window,
    config: enums::MyState,
    reader:  tauri::ipc::Channel<DownloadEvent<'static>>,
) -> Result<(), String>  {
    loop {

        let _ = reader.send(DownloadEvent::Started {
            url: "https://www.baidu.com",
            download_id: 1,
            content_length: 100,
        });
            println!("🪵 [udp.rs:202]~ token ~ \x1b[0;32mhello\x1b[0m = {}", "hello");
        sleep(Duration::from_millis(1000)).await;
        // win.emit("connect_stop", format!("UDP listener thread stopped: ")).unwrap();
    }
    Ok(())
}

#[tauri::command]
pub fn fuck_channel(
    win: tauri::Window,
    config: enums::MyState,
    reader_event:  tauri::ipc::Channel<DownloadEvent>,
) -> Result<(), String>  {
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