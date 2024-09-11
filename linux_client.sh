#!/bin/bash

# Function to connect to OpenVPN using a config file
connect_vpn() {
    echo -n "Enter the path to your OpenVPN config file (.ovpn): "
    read config_file
    if [[ -f "$config_file" ]]; then
        sudo openvpn --config "$config_file" &
        echo "Connecting to VPN using $config_file ..."
    else
        echo "Config file not found: $config_file"
    fi
}

# Function to disconnect any active OpenVPN instances
disconnect_vpn() {
    vpn_pid=$(pgrep openvpn)
    if [[ -n "$vpn_pid" ]]; then
        sudo killall openvpn
        echo "Disconnected from VPN."
    else
        echo "No active VPN connection found."
    fi
}

# Main loop to display options and take action
while true; do
    echo "1. Connect to VPN using a config file"
    echo "2. Disconnect active VPN connections"
    echo "3. Exit"
    echo -n "Choose an option: "
    read choice

    case $choice in
        1)
            connect_vpn
            ;;
        2)
            disconnect_vpn
            ;;
        3)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            ;;
    esac
done
