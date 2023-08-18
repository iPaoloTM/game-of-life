import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Define grid dimensions
rows = 50
cols = 50

# Initialize the grid with all dead cells
grid = np.zeros((rows, cols), dtype=int)

# Create a figure and axis for the visualization
fig, ax = plt.subplots()
img = ax.imshow(grid, interpolation='nearest', cmap='gray', vmin=0, vmax=1)  # Adjust vmin and vmax

# Variables for user interaction
paused = True
live_cell_value = 1

def update(frameNum, img, grid):
    global paused
    if not paused:
        new_grid = apply_rules(grid)
        img.set_data(new_grid)
        grid[:] = new_grid[:]
    return img

def onClick(event):
    global paused
    if not paused:
        return
    if event.inaxes is ax:
        x, y = int(event.xdata), int(event.ydata)
        grid[y, x] = live_cell_value
        img.set_data(grid)
        fig.canvas.draw()

def onKeyPress(event):
    global paused
    if event.key == ' ':
        paused = not paused
        if not paused:
            ani.event_source.start()
        else:
            ani.event_source.stop()

def onNextStep(event):
    global paused
    if paused:
        new_grid = apply_rules(grid)
        img.set_data(new_grid)
        grid[:] = new_grid[:]
        fig.canvas.draw()

# Connect the events to their respective functions
fig.canvas.mpl_connect('button_press_event', onClick)
fig.canvas.mpl_connect('key_press_event', onKeyPress)

# Add a button to progress to the next step
ax_next = plt.axes([0.7, 0.01, 0.1, 0.05])  # x, y, width, height
button_next = plt.Button(ax_next, 'Next Step', color='lightgoldenrodyellow', hovercolor='0.975')
button_next.on_clicked(onNextStep)

def apply_rules(grid):
    print("next step")
    new_grid = np.copy(grid)
    for i in range(rows):
        for j in range(cols):
            live_neighbors = np.sum(grid[max(0, i - 1):min(rows, i + 2), max(0, j - 1):min(cols, j + 2)]) - grid[i, j]
            if grid[i, j] == 1:
                if live_neighbors < 2 or live_neighbors > 3:
                    new_grid[i, j] = 0
            else:
                if live_neighbors == 3:
                    new_grid[i, j] = 1
    return new_grid

# Set up animation
ani = animation.FuncAnimation(fig, update, fargs=(img, grid), frames=50, interval=200, save_count=50)

# Display the initial message to guide user interaction
print("Click on cells to set them as alive.")
print("Press the 'Next Step' button or use the spacebar to start the simulation.")

plt.show()
