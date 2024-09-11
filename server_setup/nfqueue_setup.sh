i=$(whoami)
if [ "$i" != "root" ]
then
    echo "Needed Sudo Privileges"
    exit
fi

echo -e "\nLoading necessary Modules\n"

# Load necessary kernel modules
modprobe nfnetlink_queue

echo "IpTables NFQUEUE Setup"

# Set up iptables rules for the as0t0 interface
iptables -A INPUT -i as0t0 -j NFQUEUE --queue-num 0
iptables -A OUTPUT -o as0t0 -j NFQUEUE --queue-num 0

# Set up iptables rules for the as0t1 interface
iptables -A INPUT -i as0t1 -j NFQUEUE --queue-num 0
iptables -A OUTPUT -o as0t1 -j NFQUEUE --queue-num 0

echo "IpTables NFQUEUE Setup Done"
echo "Starting NFQUEUE"

python3 ./nfqueueML.py

echo "Stopping NFQUEUE"

# Flush the iptables rules
iptables -F

echo -e "\nRemoving the required modules"
# Remove the loaded modules
modprobe -r nfnetlink_queue


echo "NFQUEUE Stopped"
echo "Listing the iptables rules"

iptables -L

echo "Exiting..."
exit
