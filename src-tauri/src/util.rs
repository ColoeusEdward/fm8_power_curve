use std::net::TcpListener;

pub fn  is_port_available(ip: &str, port: u16) -> bool {
  match TcpListener::bind((ip, port)) {
      Ok(_) => true,
      Err(_) => false,
  }
}
