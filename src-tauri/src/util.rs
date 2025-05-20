use std::{
    fs::File,
    io::{BufReader, BufWriter, Read, Write},
    net::TcpListener,
};

pub fn is_port_available(ip: &str, port: u16) -> bool {
    match TcpListener::bind((ip, port)) {
        Ok(_) => true,
        Err(_) => false,
    }
}

pub fn save_raw_bytes_to_file(data: &Vec<Vec<u8>>, filename: &str) -> std::io::Result<()> {
    let file = File::create(filename)?;
    let mut writer = BufWriter::new(file);

    // 首先写入 Vec 的长度 (即包含多少个 [u8; 1500] 数组)
    let num_arrays = data.len() as u64; // 使用 u64 以便存储较大的长度
    writer.write_all(&num_arrays.to_le_bytes())?; // 使用小端字节序

    // 然后逐个写入每个数组的字节
    for array in data {
        writer.write_all(array)?;
    }
    writer.flush()?;
    Ok(())
}

pub fn load_raw_bytes_from_file(filename: &str) -> std::io::Result<Vec<Vec<u8>>> {
    let file = File::open(filename)?;
    let mut reader = BufReader::new(file);
    let mut result_vec: Vec<Vec<u8>> = Vec::new();

    // 首先读取 Vec 的长度
    let mut num_arrays_bytes = [0u8; 8]; // u64 是 8 字节
    reader.read_exact(&mut num_arrays_bytes)?;
    let num_arrays = u64::from_le_bytes(num_arrays_bytes) as usize;

    // 然后根据长度读取每个数组
    for _ in 0..num_arrays {
        let mut buffer = Vec::new();
        reader.read_exact(&mut buffer)?;
        result_vec.push(buffer);
    }

    // （可选）检查是否已读取到文件末尾，确保没有额外数据
    // let mut one_byte = [0u8;1];
    // match reader.read(&mut one_byte) {
    //     Ok(0) => {}, // EOF, good
    //     Ok(_) => return Err(std::io::Error::new(ErrorKind::InvalidData, "Extra data found at the end of the file")),
    //     Err(ref e) if e.kind() == ErrorKind::UnexpectedEof => {}, // Also fine if read_exact consumed everything
    //     Err(e) => return Err(e),
    // }

    Ok(result_vec)
}
