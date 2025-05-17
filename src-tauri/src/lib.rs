use udp::{fuck_channel, init_config, stop_udp, test_channel_data};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod udp;
mod enums;

#[tauri::command]
fn greet(name: &str,reader_event: tauri::ipc::Channel<enums::DownloadEvent>) -> String {
    let rs = format!("Hello, {}! You've been greeted from Rust!", name);
    println!("🪵 [lib.rs:9]~ token ~ \x1b[0;32mrs\x1b[0m = {}", rs);
    reader_event.send(enums::DownloadEvent::Started{ url: "https://www.baidu.com", download_id: 1, content_length: 100 });
    rs
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // .manage(enums::MyState::default())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet,init_config,stop_udp,test_channel_data,fuck_channel])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

}
