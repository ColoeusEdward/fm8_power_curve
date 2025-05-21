use std::{
    fs::File,
    io::{BufReader, BufWriter, Write},
    net::TcpListener,
};

use crate::config::TelemetryDataField;

pub fn is_port_available(ip: &str, port: u16) -> bool {
    match TcpListener::bind((ip, port)) {
        Ok(_) => true,
        Err(_) => false,
    }
}

pub fn save_raw_bytes_to_file(data: &Vec<Vec<u8>>, filename: &str) -> std::io::Result<()> {
    let cfg = bincode::config::standard();
    let file = File::create(filename)?;
    let mut writer = BufWriter::new(file);

    //use bincode encode data then write data to file
    let encoded: Vec<u8> = bincode::encode_to_vec(&data, cfg).unwrap();
    
    writer.write_all(&encoded)?;
   

    writer.flush()?;
    Ok(())
}

pub fn load_raw_bytes_from_file(filename: &str) -> std::io::Result<Vec<Vec<u8>>> {
    let file = File::open(filename)?;
    let mut reader = BufReader::new(file);
    // let mut result_vec: Vec<Vec<u8>> = Vec::new();

    //use bincode decode data from file
    let decoded: Vec<Vec<u8>> = bincode::decode_from_reader(&mut reader, bincode::config::standard()).unwrap();
    // let result_vec = decoded;

    // // 首先读取 Vec 的长度
    // let mut num_arrays_bytes = [0u8; 8]; // u64 是 8 字节
    // reader.read_exact(&mut num_arrays_bytes)?;
    // let num_arrays = u64::from_le_bytes(num_arrays_bytes) as usize;

    // // 然后根据长度读取每个数组
    // for _ in 0..num_arrays {
    //     let mut buffer = Vec::new();
    //     reader.read_exact(&mut buffer)?;
    //     result_vec.push(buffer);
    // }

    // （可选）检查是否已读取到文件末尾，确保没有额外数据
    // let mut one_byte = [0u8;1];
    // match reader.read(&mut one_byte) {
    //     Ok(0) => {}, // EOF, good
    //     Ok(_) => return Err(std::io::Error::new(ErrorKind::InvalidData, "Extra data found at the end of the file")),
    //     Err(ref e) if e.kind() == ErrorKind::UnexpectedEof => {}, // Also fine if read_exact consumed everything
    //     Err(e) => return Err(e),
    // }

    Ok(decoded)
}


pub fn read_fn_map(item: TelemetryDataField, buf: Vec<u8>) -> String {
  if item.type_name == "F32" {
      return f32::from_le_bytes(buf.try_into().unwrap()).to_string();
  } else if item.type_name == "S32" {
      return i32::from_le_bytes(buf.try_into().unwrap()).to_string();
  } else if item.type_name == "U32" {
      return u32::from_le_bytes(buf.try_into().unwrap()).to_string();
  } else if item.type_name == "U16" {
      return u16::from_le_bytes(buf.try_into().unwrap()).to_string();
  } else if item.type_name == "U8" {
      return u8::from_le_bytes(buf.try_into().unwrap()).to_string();
  } else if item.type_name == "S8" {
      return i8::from_le_bytes(buf.try_into().unwrap()).to_string();
  } else {
      return "".to_string();
  }
}