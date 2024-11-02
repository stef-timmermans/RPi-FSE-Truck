import tkinter as tk        # For displaying buttons on the touchscreen
import tkinter.ttk as ttk   # For more styled buttons
import subprocess           # For shutting down processes
import time                 # For waiting to shut down processes
import os                   # For shutting down the Pi

# Functions to switch camera modes
# TODO, these need their own logic
def switch_to_mode_1():
    switch_repo("repo1")

def switch_to_mode_2():
    switch_repo("repo2")

def switch_to_mode_3():
    switch_repo("repo3")

def switch_repo(repo_name):
    try:
        # Tweak this for every process
        # Some camera repos have different shutdown logic
        subprocess.run(["pkill", "-SIGINT", "python"])
        # Adjust the value to change the sleep time (in seconds)
        time.sleep(5)
        subprocess.Popen(["python3", f"/path/to/{repo_name}/script.py"])
    except Exception as e:
        # Print to standard out (only useful while SSH'd)
        # May want to change this to a logging setup in the future
        print(f"Error: {e}")

# Power-off function
# This makes a syscall to shut down the computer
# This is a ONE WAY operation, by default, there is no way to automatically
# reboot the CPU, so use with caution.
def power_off():
    os.system("sudo poweroff")

# Initialize tkinter for the display with buttons
root = tk.Tk()
root.title("Camera Control")
# Dimensions of the touch display
# If not using the Raspberry Pi 7", adapt this line
root.geometry("800x480")

# Set up ttk styling
style = ttk.Style()
style.configure("TButton", font=("Helvetica", 14, "bold"), padding=10)
style.configure("Mode.TButton", background="#3b5998", foreground="white")
style.configure("Power.TButton", background="red", foreground="white")

# Create a frame to hold the mode buttons and center it
button_frame = tk.Frame(root)
button_frame.place(relx=0.5, rely=0.5, anchor="center")

# Create ttk buttons for each mode inside the frame
button_mode1 = ttk.Button(button_frame, text="Mode 1", command=switch_to_mode_1, style="Mode.TButton")
button_mode2 = ttk.Button(button_frame, text="Mode 2", command=switch_to_mode_2, style="Mode.TButton")
button_mode3 = ttk.Button(button_frame, text="Mode 3", command=switch_to_mode_3, style="Mode.TButton")

# Arrange mode buttons in a grid inside the frame
button_mode1.grid(row=0, column=0, padx=10, pady=10)
button_mode2.grid(row=0, column=1, padx=10, pady=10)
button_mode3.grid(row=0, column=2, padx=10, pady=10)

# Create and place the power button in the bottom-right corner of the main window
power_button = ttk.Button(root, text="Power Off", command=power_off, style="Power.TButton")
power_button.place(relx=0.95, rely=0.9, anchor="se")

# Run the GUI loop
root.mainloop()
