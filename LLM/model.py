from transformers import pipeline
import threading
import queue

# Load the model once
classifier = pipeline('text-classification', model='rdpahalavan/bert-network-packet-flow-header-payload')

# Queue to hold incoming packets
packet_queue = queue.Queue()

# Function to process packets
def process_packets():
    while True:
        packet = packet_queue.get()
        if packet is None:
            break
        
        classify_result = classifier(packet, max_length=512, truncation=True)
        print(f"Packet: {packet}")
        print(f"Classification: {classify_result}")
        
        # Here you would implement logic to determine if it's an anomaly
        # and if so, send it to the second model

# Start the processing thread
processing_thread = threading.Thread(target=process_packets)
processing_thread.start()

# Function to add a packet to the queue (call this from your backend)
def classify_packet(packet_data):
    packet_queue.put(packet_data)

# Example usage (replace this with your actual backend integration)
if __name__ == "__main__":
    # Simulate incoming packets
    sample_packets = [
        "0.0 0.0 0.0 -1 22 40258",
        "1.0 1.0 1.0 -1 80 12345",
        "2.0 2.0 2.0 -1 443 54321"
    ]
    
    for packet in sample_packets:
        classify_packet(packet)
    
    # Wait for all packets to be processed
    packet_queue.join()
    
    # Stop the processing thread
    packet_queue.put(None)
    processing_thread.join()