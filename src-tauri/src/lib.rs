use udp::{
    calc_max_area_rpm_zone, fuck_channel, init_config, local_data_test_mode, loop_send_data, reset_data, set_saving_data_flag, stop_udp, test_channel_data
};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod config;
mod enums;
mod udp;
mod util;

#[tauri::command]
fn greet(name: &str) -> String {
    let rs = format!("Hello, {}! You've been greeted from Rust!", name);
    println!("🪵 [lib.rs:9]~ token ~ \x1b[0;32mrs\x1b[0m = {}", rs);
    rs
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        // .manage(enums::MyState::default())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            init_config,
            stop_udp,
            test_channel_data,
            set_saving_data_flag,
            local_data_test_mode,
            fuck_channel,
            loop_send_data,
            reset_data,
            calc_max_area_rpm_zone
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
