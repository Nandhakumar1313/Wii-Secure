import threading
import time
from scapy.all import IP
import scapy.all as scapy
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
from netfilterqueue import NetfilterQueue
from datetime import datetime
from nfqueueFunctions import check

# Dictionary to track flow-based stats
flow_data = {}

# Load the saved model and tokenizer from local disk
model_path = './saved_model'
model = AutoModelForSequenceClassification.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

# Initialize the classifier pipeline using the locally stored model and tokenizer
classifier = pipeline('text-classification', model=model, tokenizer=tokenizer, max_length=512, truncation=True)

	
# Function to dynamically calculate forward, backward packets per second, and bytes transferred per second
def calculate_flow_stats(packet):
    flow_id = (packet[IP].src, packet[IP].dst)
    
    current_time = time.time()
    packet_size = len(packet)
    
    if flow_id not in flow_data:
        flow_data[flow_id] = {
            'forward_packets': 0,
            'backward_packets': 0,
            'bytes_transferred': 0,
            'start_time': current_time
        }
    
    # Update forward or backward packet count based on direction
    if packet[IP].src == flow_id[0]:
        flow_data[flow_id]['forward_packets'] += 1
    else:
        flow_data[flow_id]['backward_packets'] += 1
    
    flow_data[flow_id]['bytes_transferred'] += packet_size
    elapsed_time = current_time - flow_data[flow_id]['start_time']
    
    # Avoid division by zero
    if elapsed_time > 0:
        forward_packets_per_sec = flow_data[flow_id]['forward_packets'] / elapsed_time
        backward_packets_per_sec = flow_data[flow_id]['backward_packets'] / elapsed_time
        bytes_transferred_per_sec = flow_data[flow_id]['bytes_transferred'] / elapsed_time
    else:
        forward_packets_per_sec = 0
        backward_packets_per_sec = 0
        bytes_transferred_per_sec = 0
    
    return forward_packets_per_sec, backward_packets_per_sec, bytes_transferred_per_sec

# Function to extract packet information, flow stats, and return it as a string
def extract_packet_info(packet):
    if IP in packet:
        forward_packets_per_sec, backward_packets_per_sec, bytes_transferred_per_sec = calculate_flow_stats(packet)

        # Handle both TCP and UDP packets
        if packet.haslayer(scapy.TCP):
            src_port = packet[scapy.TCP].sport
            dst_port = packet[scapy.TCP].dport
            tcp_offset = packet[scapy.TCP].dataofs
            tcp_flags = packet[scapy.TCP].flags
        elif packet.haslayer(scapy.UDP):
            src_port = packet[scapy.UDP].sport
            dst_port = packet[scapy.UDP].dport
            tcp_offset = -1  # Not applicable to UDP
            tcp_flags = -1  # Not applicable to UDP
        else:
            src_port = -1
            dst_port = -1
            tcp_offset = -1
            tcp_flags = -1

        ip_len = packet[scapy.IP].len
        payload_len = len(packet[scapy.Raw]) if packet.haslayer(scapy.Raw) else -1
        ip_ttl = packet[scapy.IP].ttl
        ip_tos = packet[scapy.IP].tos

        # Extracting full payload bytes
        if packet.haslayer(scapy.Raw):
            payload_bytes = list(packet[scapy.Raw].load)
        else:
            payload_bytes = []

        # Create a list of packet data to convert to a string
        packet_data = [
            forward_packets_per_sec, backward_packets_per_sec, bytes_transferred_per_sec,
            -1, src_port, dst_port, ip_len, payload_len, ip_ttl, ip_tos, tcp_offset, tcp_flags, -1
        ]

        # Append the payload bytes to the packet data
        packet_data.extend(payload_bytes)

        # Convert the list of packet data to a space-separated string
        packet_data_str = " ".join(map(str, packet_data))

        return packet_data_str
    else:
        return ""  # Return an empty string if no IP layer is found in the packet

# Function to handle incoming packets and classify them
def packet_handler(payload):
    data = payload.get_payload()
    packet = IP(data)
    
    # Call extract_packet_info() to get the packet data string
    packet_str = extract_packet_info(packet)
    
    if packet_str:  # Check if packet_str is valid
        # Classify the packet
        start = datetime.now()
        classify_result = classifier(packet_str)
        end = datetime.now()
        print("Classification Time:", end - start)
        print(f"Packet Data: {packet_str}")
        print(f"Classification Result: {classify_result}")
        
        classify_result=check(classify_result)
        # Determine if the packet should be dropped based on classification
        if classify_result[0]['label'] == 'Normal':  # Adjust condition accordingly
            print("Accepting packet")
            payload.accept()
        else:
            print("Dropping packet")
            payload.drop()
            

# Set up NetfilterQueue to listen to a single queue (queue 0)
nfqueue = NetfilterQueue()
nfqueue.bind(0, packet_handler)  # Bind to queue 0

try:
    # Start processing packets from NFQUEUE
    print("Waiting for packets...")
    nfqueue.run()
except KeyboardInterrupt:
    print("Stopping...")
finally:
    nfqueue.unbind()
