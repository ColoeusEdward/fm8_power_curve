import socket
import time

# 目标 IP 地址和端口
UDP_IP = "127.0.0.1"  # 本地回环地址
UDP_PORT = 8000      # 你希望发送数据的端口

# 要发送的数据
MESSAGE = "Hello, UDP Receiver!"

print(f"目标 IP: {UDP_IP}")
print(f"目标端口: {UDP_PORT}")
print(f"发送数据: {MESSAGE}")

# 创建一个 UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # SOCK_DGRAM 表示 UDP

try:
    while True:
        # 发送数据
        sock.sendto(MESSAGE.encode('utf-8'), (UDP_IP, UDP_PORT))
        print(f"发送了数据: {MESSAGE}")
        time.sleep(0.1) # 每秒发送一次数据

except KeyboardInterrupt:
    print("停止发送数据。")
    sock.close() 